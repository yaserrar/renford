import type { NextFunction, Request, Response } from 'express';
import type { StatutMission } from '@prisma/client';
import prisma from '../../config/prisma';
import { mail } from '../../config/mail';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { getMissionDemandeConfirmeeEmail } from '../../config/email-templates';
import { getTypeMissionLabel } from './missions.schema';
import type {
  CreateMissionSchema,
  EtablissementMissionsTab,
  FinalizeMissionPaymentSchema,
  GetEtablissementMissionsQuerySchema,
  MissionIdParamsSchema,
} from './missions.schema';

const ETABLISSEMENT_TAB_STATUS_MAP: Record<EtablissementMissionsTab, StatutMission[]> = {
  'en-recherche': [
    'brouillon',
    'ajouter_mode_paiement',
    'en_recherche',
    'candidatures_disponibles',
  ],
  confirmees: ['attente_de_signature', 'mission_en_cours', 'remplacement_en_cours', 'en_litige'],
  terminees: ['mission_terminee', 'archivee', 'annulee'],
};

const ETABLISSEMENT_ALL_STATUSES = Array.from(
  new Set(Object.values(ETABLISSEMENT_TAB_STATUS_MAP).flat()),
);

export const getEtablissementMissions = async (
  req: Request<unknown, unknown, unknown, GetEtablissementMissionsQuerySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (req.utilisateur?.typeUtilisateur !== 'etablissement') {
      return res
        .status(403)
        .json({ message: 'Seuls les établissements peuvent consulter ces missions' });
    }

    const tab = req.query.tab;
    const statuts = tab ? ETABLISSEMENT_TAB_STATUS_MAP[tab] : ETABLISSEMENT_ALL_STATUSES;

    const missions = await prisma.mission.findMany({
      where: {
        statut: { in: statuts },
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      include: {
        etablissement: true,
        PlageHoraireMission: {
          orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
        },
      },
      orderBy: [{ dateDebut: 'desc' }, { dateCreation: 'desc' }],
    });

    const missionsWithTotalHours = missions.map((mission) => {
      const totalHours = mission.PlageHoraireMission.reduce((acc, slot) => {
        const startParts = slot.heureDebut.split(':').map(Number);
        const endParts = slot.heureFin.split(':').map(Number);
        const startHour = startParts[0];
        const startMinute = startParts[1];
        const endHour = endParts[0];
        const endMinute = endParts[1];

        if (
          startHour === undefined ||
          startMinute === undefined ||
          endHour === undefined ||
          endMinute === undefined
        ) {
          return acc;
        }

        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;

        if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
          return acc;
        }

        return acc + (end - start) / 60;
      }, 0);

      return {
        ...mission,
        totalHours,
      };
    });

    return res.json(missionsWithTotalHours);
  } catch (err) {
    return next(err);
  }
};

export const createMission = async (
  req: Request<unknown, unknown, CreateMissionSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (req.utilisateur?.typeUtilisateur !== 'etablissement') {
      return res
        .status(403)
        .json({ message: 'Seuls les établissements peuvent créer une mission' });
    }

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: {
        id: true,
        etablissements: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const etablissementAppartientAuProfil = profilEtablissement.etablissements.some(
      (etablissement) => etablissement.id === req.body.etablissementId,
    );

    if (!etablissementAppartientAuProfil) {
      return res
        .status(403)
        .json({ message: "Le site d'exécution sélectionné n'est pas autorisé" });
    }

    const normalizedTarif = Number(req.body.tarif);
    if (!Number.isFinite(normalizedTarif) || normalizedTarif > 99_999_999.99) {
      return res.status(400).json({ message: 'Le tarif ne peut pas dépasser 99 999 999,99' });
    }

    const mission = await prisma.mission.create({
      data: {
        statut: 'en_recherche',
        modeMission: req.body.modeMission,
        discipline: req.body.discipline,
        specialitePrincipale: req.body.specialitePrincipale,
        specialitesSecondaires: req.body.specialitesSecondaires,
        niveauExperienceRequis: req.body.niveauExperienceRequis,
        assuranceObligatoire: req.body.assuranceObligatoire,
        materielsRequis: req.body.materielsRequis,
        description: req.body.description ?? null,
        etablissementId: req.body.etablissementId,
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        methodeTarification: req.body.methodeTarification,
        tarif: normalizedTarif,
        pourcentageVariationTarif: req.body.pourcentageVariationTarif,
        PlageHoraireMission: {
          createMany: {
            data: req.body.plagesHoraires,
          },
        },
      },
      select: {
        id: true,
        statut: true,
        specialitePrincipale: true,
      },
    });

    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        email: true,
        prenom: true,
        nom: true,
      },
    });

    if (user?.email) {
      const dashboardUrl = `${env.PLATFORM_URL.replace(/\/$/, '')}/dashboard/etablissement/accueil`;

      const emailPayload = getMissionDemandeConfirmeeEmail({
        nomComplet: `${user.prenom} ${user.nom}`.trim(),
        specialiteLabel: getTypeMissionLabel(mission.specialitePrincipale),
        dashboardUrl,
      });

      try {
        await mail.sendMail({
          to: user.email,
          subject: emailPayload.subject,
          html: emailPayload.html,
          text: emailPayload.text,
        });
      } catch (emailError) {
        logger.error(
          { err: emailError, userId, missionId: mission.id },
          "Échec d'envoi de l'email de confirmation de mission",
        );
      }
    }

    return res.status(201).json(mission);
  } catch (err) {
    return next(err);
  }
};

export const finalizeMissionPayment = async (
  req: Request<MissionIdParamsSchema, unknown, FinalizeMissionPaymentSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (req.utilisateur?.typeUtilisateur !== 'etablissement') {
      return res
        .status(403)
        .json({ message: 'Seuls les établissements peuvent finaliser un paiement mission' });
    }

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (mission.statut === 'annulee' || mission.statut === 'archivee') {
      return res.status(400).json({ message: 'Cette mission ne peut plus être payée' });
    }

    const now = new Date();

    const paymentData =
      req.body.typePaiement === 'carte_bancaire'
        ? {
            typePaiement: 'carte_bancaire' as const,
            titulaireCarteBancaire: req.body.titulaireCarteBancaire,
            numeroCarteBancaire: req.body.numeroCarteBancaire,
            dateExpirationCarte: req.body.dateExpirationCarte,
            cvvCarte: req.body.cvvCarte,
            autorisationDebit: true,
            dateAutorisationDebit: now,
            titulaireCompteBancaire: null,
            IBANCompteBancaire: null,
            BICCompteBancaire: null,
            autorisationPrelevement: false,
            dateAutorisationPrelevement: null,
          }
        : {
            typePaiement: 'prelevement_sepa' as const,
            titulaireCompteBancaire: req.body.titulaireCompteBancaire,
            IBANCompteBancaire: req.body.IBANCompteBancaire,
            BICCompteBancaire: req.body.BICCompteBancaire,
            autorisationPrelevement: true,
            dateAutorisationPrelevement: now,
            titulaireCarteBancaire: null,
            numeroCarteBancaire: null,
            dateExpirationCarte: null,
            cvvCarte: null,
            autorisationDebit: false,
            dateAutorisationDebit: null,
          };

    const updatedMission = await prisma.mission.update({
      where: { id: mission.id },
      data: {
        ...paymentData,
        statut: 'en_recherche',
      },
      select: {
        id: true,
        statut: true,
        typePaiement: true,
      },
    });

    return res.json(updatedMission);
  } catch (err) {
    return next(err);
  }
};
