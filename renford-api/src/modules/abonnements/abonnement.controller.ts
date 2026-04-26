import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { checkQuotaExceeded } from '../../lib/abonnement-quota';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';
import { getAbonnementCancellationEmail } from '../../config/email-templates';
import type { CheckoutBodySchema } from './abonnement.schema';

const PLAN_PRICE_MAP: Record<'echauffement' | 'performance', string> = {
  echauffement: env.STRIPE_PRICE_ECHAUFFEMENT,
  performance: env.STRIPE_PRICE_PERFORMANCE,
};

// ─── POST /abonnements/checkout ──────────────────────────────────────────────

export const createCheckoutSession = async (
  req: Request<unknown, unknown, CheckoutBodySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { plan } = req.body;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, stripeCustomerId: true, prixCompetitionNegocie: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    // Competition plan requires an admin-set quote
    if (plan === 'competition') {
      if (!profilEtablissement.prixCompetitionNegocie) {
        return res.status(400).json({
          message: 'Aucun devis Compétition défini. Veuillez contacter notre équipe commerciale.',
        });
      }
    }

    // Check if already has active subscription to the same plan
    const activeAbonnement = await prisma.abonnement.findFirst({
      where: { profilEtablissementId: profilEtablissement.id, statut: 'actif' },
    });

    if (activeAbonnement?.plan === plan) {
      return res.status(400).json({ message: 'Vous êtes déjà abonné à ce plan' });
    }

    // Get or create Stripe Customer
    let stripeCustomerId = profilEtablissement.stripeCustomerId;
    if (!stripeCustomerId) {
      const user = await prisma.utilisateur.findUnique({
        where: { id: userId },
        select: { email: true, prenom: true, nom: true },
      });
      const customer = await stripe.customers.create({
        email: user!.email,
        name: `${user!.prenom} ${user!.nom}`,
        metadata: { profilEtablissementId: profilEtablissement.id },
      });
      stripeCustomerId = customer.id;
      await prisma.profilEtablissement.update({
        where: { id: profilEtablissement.id },
        data: { stripeCustomerId },
      });
    }

    // Cancel existing active subscription at period end (upgrade/downgrade)
    if (activeAbonnement?.stripeSubscriptionId) {
      await stripe.subscriptions.update(activeAbonnement.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      await prisma.abonnement.update({
        where: { id: activeAbonnement.id },
        data: { statut: 'annule' },
      });
      await prisma.abonnementEvenement.create({
        data: {
          abonnementId: activeAbonnement.id,
          type: 'annulation',
          ancienStatut: 'actif',
          nouveauStatut: 'annule',
          details: { raison: 'changement_plan', nouveauPlan: plan },
        },
      });
    }

    const successUrl = `${env.PLATFORM_URL}/dashboard/etablissement/abonnement?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${env.PLATFORM_URL}/dashboard/etablissement/abonnement?canceled=true`;

    const lineItems =
      plan === 'competition'
        ? [
            {
              price_data: {
                currency: 'eur',
                product: env.STRIPE_PRODUCT_COMPETITION,
                recurring: { interval: 'month' as const },
                unit_amount: Math.round(Number(profilEtablissement.prixCompetitionNegocie!) * 100),
              },
              quantity: 1,
            },
          ]
        : [{ price: PLAN_PRICE_MAP[plan as 'echauffement' | 'performance'], quantity: 1 }];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { profilEtablissementId: profilEtablissement.id, plan },
      subscription_data: {
        metadata: { profilEtablissementId: profilEtablissement.id, plan },
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    return next(err);
  }
};

// ─── GET /abonnements/current ────────────────────────────────────────────────

export const getCurrentAbonnement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, prixCompetitionNegocie: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const abonnement = await prisma.abonnement.findFirst({
      where: {
        profilEtablissementId: profilEtablissement.id,
        statut: { in: ['actif', 'en_pause'] },
      },
      include: {
        evenements: {
          orderBy: { occurredAt: 'desc' },
          take: 20,
        },
      },
    });

    const quota = await checkQuotaExceeded(profilEtablissement.id);

    return res.status(200).json({
      abonnement,
      quota,
      prixCompetitionNegocie: profilEtablissement.prixCompetitionNegocie
        ? Number(profilEtablissement.prixCompetitionNegocie)
        : null,
    });
  } catch (err) {
    return next(err);
  }
};

// ─── GET /abonnements/history ────────────────────────────────────────────────

export const getAbonnementHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const abonnements = await prisma.abonnement.findMany({
      where: { profilEtablissementId: profilEtablissement.id },
      include: {
        evenements: {
          orderBy: { occurredAt: 'desc' },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.status(200).json(abonnements);
  } catch (err) {
    return next(err);
  }
};

// ─── POST /abonnements/cancel ────────────────────────────────────────────────

export const cancelAbonnement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const abonnement = await prisma.abonnement.findFirst({
      where: {
        profilEtablissementId: profilEtablissement.id,
        statut: { in: ['actif', 'en_pause'] },
      },
    });

    if (!abonnement) {
      return res.status(404).json({ message: 'Aucun abonnement actif trouvé' });
    }

    if (abonnement.stripeSubscriptionId) {
      // Cancel at period end — client keeps access until billing cycle ends
      await stripe.subscriptions.update(abonnement.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    // For actif subs: keep status 'actif' so quota remains accessible until period end.
    // Stripe will fire customer.subscription.deleted at period end → webhook sets 'expire'.
    // For en_pause subs (payment failed): cancel immediately, access was already blocked.
    const isCancelImmediate = abonnement.statut === 'en_pause';
    const endDate = isCancelImmediate
      ? new Date()
      : (abonnement.stripeCurrentPeriodEnd ?? new Date());

    await prisma.abonnement.update({
      where: { id: abonnement.id },
      data: {
        dateFin: endDate,
        ...(isCancelImmediate ? { statut: 'annule' } : {}),
      },
    });

    await prisma.abonnementEvenement.create({
      data: {
        abonnementId: abonnement.id,
        type: 'annulation',
        ancienStatut: abonnement.statut,
        nouveauStatut: isCancelImmediate ? 'annule' : abonnement.statut,
        stripeSubscriptionId: abonnement.stripeSubscriptionId ?? undefined,
      },
    });

    // Send cancellation email
    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { email: true, prenom: true },
    });

    if (user) {
      const emailPayload = getAbonnementCancellationEmail({
        prenom: user.prenom,
        plan: abonnement.plan.toUpperCase(),
        dateFin: endDate,
      });
      try {
        await mail.sendMail({
          to: user.email,
          subject: emailPayload.subject,
          html: emailPayload.html,
          text: emailPayload.text,
        });
      } catch (emailError) {
        logger.error({ err: emailError }, 'Failed to send abonnement cancellation email');
      }
    }

    return res.status(200).json({ message: 'Abonnement annulé avec succès' });
  } catch (err) {
    return next(err);
  }
};
