import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { stripe } from '../../config/stripe';
import type { PaiementIdParamSchema } from '../../modules/paiement/paiement.schema';

// ─── Admin: List all payments ────────────────────────────────────────────────

export const getAdminPaiements = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const paiements = await prisma.paiement.findMany({
      include: {
        mission: {
          select: {
            id: true,
            specialitePrincipale: true,
            dateDebut: true,
            dateFin: true,
            etablissement: {
              select: {
                id: true,
                nom: true,
                profilEtablissement: {
                  select: {
                    utilisateurId: true,
                    avatarChemin: true,
                  },
                },
              },
            },
            missionsRenford: {
              where: {
                statut: { in: ['contrat_signe', 'mission_en_cours', 'mission_terminee'] },
              },
              take: 1,
              select: {
                profilRenford: {
                  select: {
                    utilisateurId: true,
                    avatarChemin: true,
                    utilisateur: {
                      select: {
                        nom: true,
                        prenom: true,
                      },
                    },
                  },
                },
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

// ─── Admin: Get Stripe Receipt URL for a Payment ────────────────────────────

export const getAdminPaymentReceiptUrl = async (
  req: Request<PaiementIdParamSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { paiementId } = req.params as { paiementId: string };

    const paiement = await prisma.paiement.findUnique({
      where: { id: paiementId },
      select: { stripePaymentIntentId: true },
    });

    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    if (!paiement.stripePaymentIntentId) {
      return res.status(400).json({ message: 'Aucun paiement Stripe associé' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paiement.stripePaymentIntentId, {
      expand: ['latest_charge'],
    });

    const charge = paymentIntent.latest_charge;
    if (!charge || typeof charge === 'string' || !charge.receipt_url) {
      return res.status(404).json({ message: 'Reçu non disponible' });
    }

    return res.json({ receiptUrl: charge.receipt_url });
  } catch (err) {
    return next(err);
  }
};
