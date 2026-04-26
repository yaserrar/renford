import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { stripe } from '../../config/stripe';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';
import { getAbonnementCancellationEmail } from '../../config/email-templates';

// ─── Admin: List all abonnements ─────────────────────────────────────────────

export const adminListAbonnements = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const abonnements = await prisma.abonnement.findMany({
      include: {
        profilEtablissement: {
          select: {
            id: true,
            stripeCustomerId: true,
            utilisateur: {
              select: { id: true, email: true, prenom: true, nom: true },
            },
            etablissements: {
              take: 1,
              select: { nom: true },
            },
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(abonnements);
  } catch (err) {
    return next(err);
  }
};

// ─── Admin: Get one abonnement with events ────────────────────────────────────

export const adminGetAbonnement = async (
  req: Request<{ abonnementId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { abonnementId } = req.params;

    const abonnement = await prisma.abonnement.findUnique({
      where: { id: abonnementId },
      include: {
        evenements: { orderBy: { occurredAt: 'desc' } },
        profilEtablissement: {
          select: {
            id: true,
            stripeCustomerId: true,
            avatarChemin: true,
            utilisateur: {
              select: { id: true, email: true, prenom: true, nom: true },
            },
            etablissements: {
              take: 1,
              select: { nom: true },
            },
          },
        },
      },
    });

    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    return res.json(abonnement);
  } catch (err) {
    return next(err);
  }
};

// ─── Admin: Set negotiated competition quote on an établissement ──────────────
// This does NOT create a Stripe subscription. It just stores the negotiated
// monthly price so the établissement can self-subscribe via Checkout.

export const adminSetCompetitionQuote = async (
  req: Request<unknown, unknown, { profilEtablissementId: string; prixMensuelHT: number }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profilEtablissementId, prixMensuelHT } = req.body;

    const profil = await prisma.profilEtablissement.findUnique({
      where: { id: profilEtablissementId },
      include: { utilisateur: { select: { email: true, prenom: true, nom: true } } },
    });

    if (!profil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    await prisma.profilEtablissement.update({
      where: { id: profilEtablissementId },
      data: { prixCompetitionNegocie: prixMensuelHT },
    });

    return res.status(200).json({ message: 'Devis Compétition enregistré', prixMensuelHT });
  } catch (err) {
    return next(err);
  }
};

// ─── Admin: Cancel an abonnement immediately ──────────────────────────────────

export const adminCancelAbonnement = async (
  req: Request<{ abonnementId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { abonnementId } = req.params;

    const abonnement = await prisma.abonnement.findUnique({
      where: { id: abonnementId },
      include: {
        profilEtablissement: {
          include: { utilisateur: { select: { email: true, prenom: true } } },
        },
      },
    });

    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    if (['annule', 'expire'].includes(abonnement.statut)) {
      return res.status(400).json({ message: 'Abonnement déjà annulé ou expiré' });
    }

    if (abonnement.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(abonnement.stripeSubscriptionId);
    }

    await prisma.abonnement.update({
      where: { id: abonnementId },
      data: { statut: 'annule', dateFin: new Date() },
    });

    await prisma.abonnementEvenement.create({
      data: {
        abonnementId,
        type: 'annulation',
        ancienStatut: abonnement.statut,
        nouveauStatut: 'annule',
        stripeSubscriptionId: abonnement.stripeSubscriptionId ?? undefined,
        stripeEventType: 'admin_cancel',
        details: { cancelledByAdmin: true },
      },
    });

    const { utilisateur } = abonnement.profilEtablissement;
    const emailPayload = getAbonnementCancellationEmail({
      prenom: utilisateur.prenom,
      plan: abonnement.plan.toUpperCase(),
      dateFin: new Date(),
    });
    try {
      await mail.sendMail({
        to: utilisateur.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });
    } catch (emailErr) {
      logger.error({ err: emailErr }, 'Failed to send admin cancellation email');
    }

    return res.status(200).json({ message: 'Abonnement annulé avec succès' });
  } catch (err) {
    return next(err);
  }
};

// ─── Admin: Pause an abonnement (pause collection) ────────────────────────────

export const adminPauseAbonnement = async (
  req: Request<{ abonnementId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { abonnementId } = req.params;

    const abonnement = await prisma.abonnement.findUnique({
      where: { id: abonnementId },
    });

    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    if (abonnement.statut !== 'actif') {
      return res.status(400).json({ message: 'Seul un abonnement actif peut être mis en pause' });
    }

    if (abonnement.stripeSubscriptionId) {
      await stripe.subscriptions.update(abonnement.stripeSubscriptionId, {
        pause_collection: { behavior: 'void' },
      });
    }

    await prisma.abonnement.update({
      where: { id: abonnementId },
      data: { statut: 'en_pause' },
    });

    await prisma.abonnementEvenement.create({
      data: {
        abonnementId,
        type: 'mise_en_pause',
        ancienStatut: 'actif',
        nouveauStatut: 'en_pause',
        stripeSubscriptionId: abonnement.stripeSubscriptionId ?? undefined,
        stripeEventType: 'admin_pause',
        details: { pausedByAdmin: true },
      },
    });

    return res.status(200).json({ message: 'Abonnement mis en pause' });
  } catch (err) {
    return next(err);
  }
};

// ─── Admin: Resume a paused abonnement ───────────────────────────────────────

export const adminResumeAbonnement = async (
  req: Request<{ abonnementId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { abonnementId } = req.params;

    const abonnement = await prisma.abonnement.findUnique({
      where: { id: abonnementId },
      include: {
        profilEtablissement: {
          include: {
            utilisateur: { select: { email: true, prenom: true } },
          },
        },
      },
    });

    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    if (abonnement.statut !== 'en_pause') {
      return res.status(400).json({ message: 'Seul un abonnement en pause peut être repris' });
    }

    if (abonnement.stripeSubscriptionId) {
      await stripe.subscriptions.update(abonnement.stripeSubscriptionId, {
        pause_collection: '',
      });
    }

    await prisma.abonnement.update({
      where: { id: abonnementId },
      data: { statut: 'actif' },
    });

    await prisma.abonnementEvenement.create({
      data: {
        abonnementId,
        type: 'reprise',
        ancienStatut: 'en_pause',
        nouveauStatut: 'actif',
        stripeSubscriptionId: abonnement.stripeSubscriptionId ?? undefined,
        stripeEventType: 'admin_resume',
        details: { resumedByAdmin: true },
      },
    });

    return res.status(200).json({ message: 'Abonnement repris avec succès' });
  } catch (err) {
    return next(err);
  }
};

// ─── Admin: Update quota usage (manual correction) ───────────────────────────

export const adminUpdateQuota = async (
  req: Request<{ abonnementId: string }, unknown, { missionsUtilisees: number }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { abonnementId } = req.params;
    const { missionsUtilisees } = req.body;

    const abonnement = await prisma.abonnement.findUnique({
      where: { id: abonnementId },
    });

    if (!abonnement) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    const updated = await prisma.abonnement.update({
      where: { id: abonnementId },
      data: { missionsUtilisees },
    });

    await prisma.abonnementEvenement.create({
      data: {
        abonnementId,
        type: 'changement_plan',
        ancienStatut: abonnement.statut,
        nouveauStatut: abonnement.statut,
        details: {
          ancienneValeur: abonnement.missionsUtilisees,
          nouvelleValeur: missionsUtilisees,
          modifiedByAdmin: true,
        },
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
};
