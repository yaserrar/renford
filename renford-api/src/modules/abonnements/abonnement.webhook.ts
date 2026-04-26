import type { Request, Response } from 'express';
import type Stripe from 'stripe';
import prisma from '../../config/prisma';
import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';
import {
  getAbonnementActivationEmail,
  getAbonnementRenewalEmail,
  getAbonnementPaymentFailedEmail,
  getAbonnementCancellationEmail,
} from '../../config/email-templates';
import { PLAN_QUOTA_MAP } from './abonnement.schema';

type AllowedPlan = 'echauffement' | 'performance' | 'competition';

async function getEtablissementEmail(profilEtablissementId: string) {
  const profil = await prisma.profilEtablissement.findUnique({
    where: { id: profilEtablissementId },
    include: { utilisateur: { select: { email: true, prenom: true } } },
  });
  return profil?.utilisateur ?? null;
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const profilEtablissementId = session.metadata?.profilEtablissementId;
  const plan = session.metadata?.plan as AllowedPlan | undefined;

  if (!profilEtablissementId || !plan) {
    logger.warn({ sessionId: session.id }, 'checkout.session.completed: missing metadata');
    return;
  }

  const stripeSubscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  // Determine period dates from subscription items (Stripe v20: dates live on SubscriptionItem)
  const firstItem = subscription.items.data[0];
  const periodStart = new Date((firstItem?.current_period_start ?? subscription.start_date) * 1000);
  const periodEnd = new Date((firstItem?.current_period_end ?? subscription.start_date) * 1000);

  // Cancel any previously active abonnement
  await prisma.abonnement.updateMany({
    where: { profilEtablissementId, statut: { in: ['actif', 'en_pause'] } },
    data: { statut: 'annule', dateFin: new Date() },
  });

  const quotaMissions = PLAN_QUOTA_MAP[plan];

  const abonnement = await prisma.abonnement.create({
    data: {
      profilEtablissementId,
      plan,
      statut: 'actif',
      quotaMissions,
      missionsUtilisees: 0,
      prixMensuelHT: subscription.items.data[0]?.price.unit_amount
        ? (subscription.items.data[0].price.unit_amount ?? 0) / 100
        : 0,
      dateDebut: periodStart,
      dateProchainRenouvellement: periodEnd,
      stripeSubscriptionId,
      stripeCurrentPeriodStart: periodStart,
      stripeCurrentPeriodEnd: periodEnd,
    },
  });

  await prisma.abonnementEvenement.create({
    data: {
      abonnementId: abonnement.id,
      type: 'activation',
      ancienStatut: null,
      nouveauStatut: 'actif',
      montantCentimes:
        session.amount_total ?? subscription.items.data[0]?.price.unit_amount ?? null,
      stripeSubscriptionId,
      stripeEventType: 'checkout.session.completed',
    },
  });

  // Send activation email
  const user = await getEtablissementEmail(profilEtablissementId);
  if (user) {
    const unitAmount = subscription.items.data[0]?.price.unit_amount ?? 0;
    const emailPayload = getAbonnementActivationEmail({
      prenom: user.prenom,
      plan: plan.toUpperCase(),
      quotaMissions,
      prixMensuelHT: unitAmount / 100,
      periodStart,
      periodEnd,
    });
    try {
      await mail.sendMail({
        to: user.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });
    } catch (err) {
      logger.error({ err }, 'Failed to send activation email');
    }
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subDetails =
    invoice.parent?.type === 'subscription_details' ? invoice.parent.subscription_details : null;
  const stripeSubscriptionId = subDetails?.subscription
    ? typeof subDetails.subscription === 'string'
      ? subDetails.subscription
      : subDetails.subscription.id
    : null;
  if (!stripeSubscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const profilEtablissementId = subscription.metadata?.profilEtablissementId;
  if (!profilEtablissementId) return;

  const firstItem = subscription.items.data[0];
  const periodStart = new Date((firstItem?.current_period_start ?? subscription.start_date) * 1000);
  const periodEnd = new Date((firstItem?.current_period_end ?? subscription.start_date) * 1000);

  const abonnement = await prisma.abonnement.findFirst({
    where: { stripeSubscriptionId, statut: { in: ['actif', 'en_pause', 'en_attente'] } },
  });

  if (!abonnement) return;

  // On renewal: reset quota usage
  const isRenewal =
    abonnement.statut === 'actif' && invoice.billing_reason === 'subscription_cycle';

  await prisma.abonnement.update({
    where: { id: abonnement.id },
    data: {
      statut: 'actif',
      stripeCurrentPeriodStart: periodStart,
      stripeCurrentPeriodEnd: periodEnd,
      dateProchainRenouvellement: periodEnd,
      ...(isRenewal ? { missionsUtilisees: 0 } : {}),
    },
  });

  const eventType = isRenewal ? 'renouvellement' : 'paiement_reussi';

  await prisma.abonnementEvenement.create({
    data: {
      abonnementId: abonnement.id,
      type: eventType,
      ancienStatut: abonnement.statut,
      nouveauStatut: 'actif',
      montantCentimes: invoice.amount_paid,
      stripeSubscriptionId,
      stripeEventType: 'invoice.paid',
    },
  });

  if (isRenewal) {
    const user = await getEtablissementEmail(profilEtablissementId);
    if (user) {
      const emailPayload = getAbonnementRenewalEmail({
        prenom: user.prenom,
        plan: abonnement.plan.toUpperCase(),
        montantCentimes: invoice.amount_paid,
        periodEnd,
      });
      try {
        await mail.sendMail({
          to: user.email,
          subject: emailPayload.subject,
          html: emailPayload.html,
          text: emailPayload.text,
        });
      } catch (err) {
        logger.error({ err }, 'Failed to send renewal email');
      }
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subDetails =
    invoice.parent?.type === 'subscription_details' ? invoice.parent.subscription_details : null;
  const stripeSubscriptionId = subDetails?.subscription
    ? typeof subDetails.subscription === 'string'
      ? subDetails.subscription
      : subDetails.subscription.id
    : null;
  if (!stripeSubscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const profilEtablissementId = subscription.metadata?.profilEtablissementId;
  if (!profilEtablissementId) return;

  const abonnement = await prisma.abonnement.findFirst({
    where: { stripeSubscriptionId, statut: { in: ['actif', 'en_attente'] } },
  });

  if (!abonnement) return;

  await prisma.abonnement.update({
    where: { id: abonnement.id },
    data: { statut: 'en_pause' },
  });

  await prisma.abonnementEvenement.create({
    data: {
      abonnementId: abonnement.id,
      type: 'paiement_echoue',
      ancienStatut: abonnement.statut,
      nouveauStatut: 'en_pause',
      montantCentimes: invoice.amount_due,
      stripeSubscriptionId,
      stripeEventType: 'invoice.payment_failed',
    },
  });

  const user = await getEtablissementEmail(profilEtablissementId);
  if (user) {
    const emailPayload = getAbonnementPaymentFailedEmail({
      prenom: user.prenom,
      montantCentimes: invoice.amount_due,
    });
    try {
      await mail.sendMail({
        to: user.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });
    } catch (err) {
      logger.error({ err }, 'Failed to send payment failed email');
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeSubscriptionId = subscription.id;
  const profilEtablissementId = subscription.metadata?.profilEtablissementId;

  const abonnement = await prisma.abonnement.findFirst({
    where: { stripeSubscriptionId, statut: { notIn: ['annule', 'expire'] } },
  });

  if (!abonnement) return;

  await prisma.abonnement.update({
    where: { id: abonnement.id },
    // Preserve dateFin if user self-cancelled earlier; otherwise stamp now
    data: { statut: 'expire', dateFin: abonnement.dateFin ?? new Date() },
  });

  await prisma.abonnementEvenement.create({
    data: {
      abonnementId: abonnement.id,
      type: 'expiration',
      ancienStatut: abonnement.statut,
      nouveauStatut: 'expire',
      stripeSubscriptionId,
      stripeEventType: 'customer.subscription.deleted',
    },
  });

  // Only send the cancellation email if the user hasn't already received one.
  // dateFin being set means cancelAbonnement already sent the email.
  if (profilEtablissementId && !abonnement.dateFin) {
    const user = await getEtablissementEmail(profilEtablissementId);
    if (user) {
      const emailPayload = getAbonnementCancellationEmail({
        prenom: user.prenom,
        plan: abonnement.plan.toUpperCase(),
        dateFin: new Date(),
      });
      try {
        await mail.sendMail({
          to: user.email,
          subject: emailPayload.subject,
          html: emailPayload.html,
          text: emailPayload.text,
        });
      } catch (err) {
        logger.error({ err }, 'Failed to send subscription deleted email');
      }
    }
  }
}

// ─── Main Webhook Handler ─────────────────────────────────────────────────────

export const handleAbonnementWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET_ABONNEMENTS);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.warn({ message }, 'Abonnement webhook signature verification failed');
    return res.status(400).json({ message: `Webhook Error: ${message}` });
  }

  logger.info({ type: event.type, id: event.id }, 'Abonnement webhook received');

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        logger.debug({ type: event.type }, 'Unhandled abonnement webhook event');
    }
  } catch (err) {
    logger.error({ err, type: event.type }, 'Error processing abonnement webhook event');
    return res.status(500).json({ message: 'Internal error processing webhook' });
  }

  return res.status(200).json({ received: true });
};
