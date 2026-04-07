import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { CreateCheckoutSessionSchema, MissionIdParamSchema } from './paiement.schema';

// ─── Renford: Create Stripe Connect onboarding link ──────────────────────────

export const createConnectOnboardingLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: {
        id: true,
        stripeConnectAccountId: true,
        utilisateur: { select: { email: true, nom: true, prenom: true } },
      },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    let accountId = profilRenford.stripeConnectAccountId;

    // Create Stripe Connect account if it doesn't exist yet
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        email: profilRenford.utilisateur.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          first_name: profilRenford.utilisateur.prenom,
          last_name: profilRenford.utilisateur.nom,
          email: profilRenford.utilisateur.email,
        },
      });

      accountId = account.id;

      await prisma.profilRenford.update({
        where: { id: profilRenford.id },
        data: { stripeConnectAccountId: accountId },
      });
    }

    // Create onboarding link
    const returnUrl = typeof req.query?.returnUrl === 'string' ? req.query.returnUrl : undefined;
    const defaultReturn = `${env.PLATFORM_URL}/dashboard/renford/paiement?stripe_onboarding=complete`;
    const defaultRefresh = `${env.PLATFORM_URL}/dashboard/renford/paiement?stripe_refresh=true`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: returnUrl
        ? `${env.PLATFORM_URL}/onboarding/etape-6-renford?stripe_refresh=true`
        : defaultRefresh,
      return_url: returnUrl
        ? `${env.PLATFORM_URL}/onboarding/etape-6-renford?stripe_onboarding=complete`
        : defaultReturn,
      type: 'account_onboarding',
    });

    return res.json({ url: accountLink.url });
  } catch (err) {
    return next(err);
  }
};

// ─── Renford: Get Connect account status ─────────────────────────────────────

export const getConnectAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: {
        stripeConnectAccountId: true,
        stripeConnectOnboardingComplete: true,
      },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    if (!profilRenford.stripeConnectAccountId) {
      return res.json({
        hasAccount: false,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    let account;
    try {
      account = await stripe.accounts.retrieve(profilRenford.stripeConnectAccountId);
    } catch (stripeErr: unknown) {
      // Handle deleted or invalid Stripe accounts
      const errCode =
        stripeErr instanceof Error && 'code' in stripeErr
          ? (stripeErr as { code?: string }).code
          : undefined;
      if (errCode === 'account_invalid' || errCode === 'resource_missing') {
        logger.warn(
          { stripeAccountId: profilRenford.stripeConnectAccountId },
          'Stripe account not found, resetting',
        );
        await prisma.profilRenford.update({
          where: { utilisateurId: userId },
          data: { stripeConnectAccountId: null, stripeConnectOnboardingComplete: false },
        });
        return res.json({
          hasAccount: false,
          onboardingComplete: false,
          chargesEnabled: false,
          payoutsEnabled: false,
        });
      }
      throw stripeErr;
    }

    // Update onboarding status if it changed
    const isComplete = account.charges_enabled && account.payouts_enabled;
    if (isComplete !== profilRenford.stripeConnectOnboardingComplete) {
      await prisma.profilRenford.update({
        where: { utilisateurId: userId },
        data: { stripeConnectOnboardingComplete: isComplete },
      });
    }

    return res.json({
      hasAccount: true,
      onboardingComplete: isComplete,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Renford: Create Stripe Connect login link (Express Dashboard) ───────────

export const createConnectDashboardLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { stripeConnectAccountId: true },
    });

    if (!profilRenford?.stripeConnectAccountId) {
      return res.status(400).json({ message: 'Aucun compte Stripe Connect configuré' });
    }

    // Verify account onboarding is complete before creating dashboard link
    const profilCheck = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { stripeConnectOnboardingComplete: true },
    });
    if (!profilCheck?.stripeConnectOnboardingComplete) {
      return res
        .status(400)
        .json({ message: "Veuillez d'abord compléter la configuration de votre compte Stripe" });
    }

    const loginLink = await stripe.accounts.createLoginLink(profilRenford.stripeConnectAccountId);

    return res.json({ url: loginLink.url });
  } catch (err) {
    return next(err);
  }
};

// ─── Établissement: Create Checkout Session for mission payment ──────────────

export const createCheckoutSession = async (
  req: Request<unknown, unknown, CreateCheckoutSessionSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.body.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      include: {
        etablissement: {
          include: {
            profilEtablissement: {
              select: {
                id: true,
                stripeCustomerId: true,
                utilisateurId: true,
                raisonSociale: true,
              },
            },
          },
        },
        missionsRenford: {
          where: {
            statut: { in: ['contrat_signe', 'mission_en_cours', 'mission_terminee'] },
          },
          take: 1,
          include: {
            profilRenford: {
              select: {
                stripeConnectAccountId: true,
                stripeConnectOnboardingComplete: true,
                utilisateur: { select: { nom: true, prenom: true } },
              },
            },
          },
        },
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (mission.statut !== 'mission_terminee') {
      return res.status(400).json({
        message: 'La mission doit être terminée pour procéder au paiement',
      });
    }

    // Check the latest payment to decide whether we can resume/retry or must block.
    const existingPayment = await prisma.paiement.findFirst({
      where: { missionId: mission.id },
      orderBy: { dateCreation: 'desc' },
    });

    if (existingPayment?.statut === 'libere') {
      return res.status(400).json({ message: 'Cette mission a déjà été payée' });
    }

    if (existingPayment?.statut === 'bloque') {
      return res.status(400).json({
        message: 'Le paiement est bloqué. Contactez le support pour débloquer la situation.',
      });
    }

    if (existingPayment?.statut === 'en_cours') {
      return res.status(400).json({
        message: 'Un paiement est déjà en cours de traitement pour cette mission',
      });
    }

    if (existingPayment?.statut === 'en_attente' && existingPayment.stripeCheckoutSessionId) {
      const currentSession = await stripe.checkout.sessions.retrieve(
        existingPayment.stripeCheckoutSessionId,
      );

      if (currentSession.status === 'open' && currentSession.url) {
        return res.json({ url: currentSession.url });
      }

      if (currentSession.status === 'complete') {
        return res.status(400).json({
          message: 'Ce paiement a déjà été validé. Rafraîchissez la page.',
        });
      }

      await prisma.paiement.update({
        where: { id: existingPayment.id },
        data: { statut: 'echoue' },
      });
    }

    const missionRenford = mission.missionsRenford[0];
    if (!missionRenford) {
      return res.status(400).json({ message: 'Aucun Renford assigné à cette mission' });
    }

    const renford = missionRenford.profilRenford;
    if (!renford.stripeConnectAccountId || !renford.stripeConnectOnboardingComplete) {
      return res.status(400).json({
        message: "Le Renford n'a pas encore configuré son compte de paiement",
      });
    }

    const montantHT = Number(mission.montantHT ?? 0);
    const montantCommission = Number(mission.montantFraisService ?? 0);
    const montantTTC = Number(mission.montantTTC ?? 0);

    const montantTVA = 0;
    const montantNetRenford = Math.round((montantTTC - montantCommission) * 100) / 100;

    // Validate calculated amounts
    if (montantTTC <= 0 || montantHT <= 0) {
      return res.status(400).json({
        message:
          'Le montant calculé est invalide. Vérifiez le tarif et les horaires de la mission.',
      });
    }

    // Stripe amounts in cents
    const amountCents = Math.round(montantTTC * 100);
    const applicationFeeCents = Math.round(montantCommission * 100);

    // Get or create Stripe Customer for the Établissement
    const profilEtab = mission.etablissement.profilEtablissement;
    let stripeCustomerId = profilEtab.stripeCustomerId;

    if (!stripeCustomerId) {
      const user = await prisma.utilisateur.findUnique({
        where: { id: profilEtab.utilisateurId },
        select: { email: true, nom: true, prenom: true },
      });

      const customer = await stripe.customers.create({
        email: user?.email,
        name: profilEtab.raisonSociale || `${user?.prenom} ${user?.nom}`.trim(),
        metadata: {
          profilEtablissementId: profilEtab.id,
          utilisateurId: profilEtab.utilisateurId,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.profilEtablissement.update({
        where: { id: profilEtab.id },
        data: { stripeCustomerId },
      });
    }

    const renfordName = `${renford.utilisateur.nom} ${renford.utilisateur.prenom}`.trim();

    // Create Stripe Checkout Session with destination charge
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Mission - ${mission.specialitePrincipale}`,
              description: `Paiement de la mission avec ${renfordName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFeeCents,
        transfer_data: {
          destination: renford.stripeConnectAccountId,
        },
      },
      success_url: `${env.PLATFORM_URL}/dashboard/etablissement/missions/${mission.id}?paiement=succes`,
      cancel_url: `${env.PLATFORM_URL}/dashboard/etablissement/missions/${mission.id}?paiement=annule`,
      metadata: {
        missionId: mission.id,
        missionRenfordId: missionRenford.id,
      },
    });

    // Reuse the latest failed/pending payment row when possible, otherwise create one.
    if (existingPayment && ['en_attente', 'echoue'].includes(existingPayment.statut)) {
      await prisma.paiement.update({
        where: { id: existingPayment.id },
        data: {
          montantHT,
          montantTVA,
          montantTTC,
          montantCommission,
          montantNetRenford,
          statut: 'en_attente',
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: null,
          stripeChargeId: null,
          stripeTransferId: null,
          dateCapture: null,
          dateLiberation: null,
        },
      });
    } else {
      await prisma.paiement.create({
        data: {
          missionId: mission.id,
          montantHT,
          montantTVA,
          montantTTC,
          montantCommission,
          montantNetRenford,
          statut: 'en_attente',
          stripeCheckoutSessionId: session.id,
        },
      });
    }

    return res.json({ url: session.url });
  } catch (err) {
    return next(err);
  }
};

// ─── Webhook Handler ─────────────────────────────────────────────────────────

export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ message: 'Missing stripe-signature header' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error({ err }, 'Stripe webhook signature verification failed');
    return res.status(400).json({ message: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const paiement = await prisma.paiement.findUnique({
          where: { stripeCheckoutSessionId: session.id },
        });

        if (paiement && paiement.statut !== 'libere') {
          await prisma.paiement.update({
            where: { id: paiement.id },
            data: {
              statut: 'libere',
              stripePaymentIntentId:
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : (session.payment_intent?.id ?? null),
              dateCapture: new Date(),
              dateLiberation: new Date(),
            },
          });

          // Archive the mission
          await prisma.mission.update({
            where: { id: paiement.missionId },
            data: { statut: 'archivee' },
          });

          logger.info(
            { paiementId: paiement.id, missionId: paiement.missionId },
            'Paiement complété et mission archivée',
          );
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;

        await prisma.paiement.updateMany({
          where: { stripeCheckoutSessionId: session.id, statut: 'en_attente' },
          data: { statut: 'echoue' },
        });
        break;
      }

      case 'account.updated': {
        const account = event.data.object;
        const isComplete = account.charges_enabled && account.payouts_enabled;

        await prisma.profilRenford.updateMany({
          where: { stripeConnectAccountId: account.id },
          data: { stripeConnectOnboardingComplete: isComplete },
        });
        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    logger.error({ err, eventType: event.type }, 'Error processing Stripe webhook');
    return next(err);
  }
};

// ─── Get Payment Status for a Mission ────────────────────────────────────────

export const getMissionPaymentStatus = async (
  req: Request<MissionIdParamSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { missionId } = req.params as { missionId: string };

    // Verify user has access to this mission (either as établissement or renford)
    const mission = await prisma.mission.findFirst({
      where: {
        id: missionId,
        OR: [
          {
            etablissement: {
              profilEtablissement: { utilisateurId: userId },
            },
          },
          {
            missionsRenford: {
              some: {
                profilRenford: { utilisateurId: userId },
              },
            },
          },
        ],
      },
      select: { id: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    const paiement = await prisma.paiement.findFirst({
      where: { missionId },
      orderBy: { dateCreation: 'desc' },
    });

    if (!paiement) {
      return res.json({ hasPaiement: false, paiement: null });
    }

    return res.json({
      hasPaiement: true,
      paiement: {
        id: paiement.id,
        reference: paiement.reference,
        montantHT: paiement.montantHT,
        montantTVA: paiement.montantTVA,
        montantTTC: paiement.montantTTC,
        montantCommission: paiement.montantCommission,
        montantNetRenford: paiement.montantNetRenford,
        statut: paiement.statut,
        dateCreation: paiement.dateCreation,
        dateCapture: paiement.dateCapture,
        dateLiberation: paiement.dateLiberation,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Get Payment History ─────────────────────────────────────────────────────

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const paiements = await prisma.paiement.findMany({
      where: {
        mission: {
          OR: [
            {
              etablissement: {
                profilEtablissement: { utilisateurId: userId },
              },
            },
            {
              missionsRenford: {
                some: {
                  profilRenford: { utilisateurId: userId },
                },
              },
            },
          ],
        },
      },
      include: {
        mission: {
          select: {
            id: true,
            specialitePrincipale: true,
            dateDebut: true,
            dateFin: true,
            etablissement: {
              select: {
                nom: true,
              },
            },
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(paiements);
  } catch (err) {
    return next(err);
  }
};
