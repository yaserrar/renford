import type { NextFunction, Request, Response } from 'express';
import type { StatutMission } from '@prisma/client';
import prisma from '../../config/prisma';
import { mail } from '../../config/mail';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { getMissionDemandeConfirmeeEmail } from '../../config/email-templates';
import { saveSignatureDataUrl } from '../../utils/signature-storage';
import { computeMissionPricing } from '../../lib/mission-pricing';
import {
  registerEtablissementMissionRenfordResponse,
  syncMissionMatches,
} from '../../jobs/missions-matching';
import {
  buildMissionDocumentPdf,
  getMissionDocumentFilename,
  type MissionDocumentType,
} from './mission-documents';
import { getTypeMissionLabel } from './missions.schema';
import type {
  CreateMissionSchema,
  EtablissementMissionsTab,
  GetEtablissementMissionsQuerySchema,
  MissionDocumentParamsSchema,
  MissionIdParamsSchema,
  MissionRenfordIdParamsSchema,
  RespondToMissionRenfordByEtablissementSchema,
  SignMissionDocumentSchema,
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

const getMissionTotalHours = (
  slots: Array<{
    heureDebut: string;
    heureFin: string;
  }>,
) => {
  return slots.reduce((acc, slot) => {
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
};

export const getEtablissementPendingMissionsCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { etablissements: { select: { id: true } } },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const etablissementIds = profilEtablissement.etablissements.map((e) => e.id);

    const count = await prisma.mission.count({
      where: { etablissementId: { in: etablissementIds }, statut: 'en_recherche' },
    });

    return res.json({ count });
  } catch (err) {
    return next(err);
  }
};

export const getEtablissementMissions = async (
  req: Request<unknown, unknown, unknown, GetEtablissementMissionsQuerySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

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
        etablissement: {
          include: {
            profilEtablissement: { select: { avatarChemin: true } },
          },
        },
        PlageHoraireMission: {
          orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
        },
        missionsRenford: {
          where: {
            statut: {
              notIn: ['nouveau', 'vu', 'refuse_par_renford', 'refuse_par_etablissement', 'annule'],
            },
          },
          take: 1,
          orderBy: [{ ordreShortlist: 'asc' }, { dateProposition: 'asc' }],
          include: {
            profilRenford: {
              select: {
                id: true,
                avatarChemin: true,
                titreProfil: true,
                noteMoyenne: true,
                utilisateur: {
                  select: { nom: true, prenom: true },
                },
              },
            },
          },
        },
      },
      orderBy: [{ dateDebut: 'desc' }, { dateCreation: 'desc' }],
    });

    const missionsWithTotalHours = missions.map((mission) => {
      const totalHours = getMissionTotalHours(mission.PlageHoraireMission);
      const renford = mission.missionsRenford[0]?.profilRenford;
      const { profilEtablissement: etabProfil, ...etabRest } = mission.etablissement;

      return {
        ...mission,
        etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
        missionsRenford: undefined,
        totalHours,
        renfordAssigne: renford
          ? {
              id: renford.id,
              avatarChemin: renford.avatarChemin,
              titreProfil: renford.titreProfil,
              noteMoyenne: renford.noteMoyenne,
              nom: renford.utilisateur.nom,
              prenom: renford.utilisateur.prenom,
            }
          : null,
      };
    });

    return res.json(missionsWithTotalHours);
  } catch (err) {
    return next(err);
  }
};

export const getEtablissementMissionDetails = async (
  req: Request<MissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      include: {
        etablissement: {
          include: {
            profilEtablissement: { select: { avatarChemin: true } },
          },
        },
        PlageHoraireMission: {
          orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
        },
        missionsRenford: {
          where: {
            statut: {
              notIn: ['nouveau', 'vu', 'refuse_par_renford', 'refuse_par_etablissement', 'annule'],
            },
          },
          include: {
            profilRenford: {
              select: {
                id: true,
                utilisateurId: true,
                avatarChemin: true,
                titreProfil: true,
                niveauExperience: true,
                noteMoyenne: true,
                ville: true,
                utilisateur: {
                  select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    telephone: true,
                  },
                },
              },
            },
          },
          orderBy: [{ ordreShortlist: 'asc' }, { dateProposition: 'asc' }],
        },
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    const { profilEtablissement: etabProfil, ...etabRest } = mission.etablissement;
    return res.json({
      ...mission,
      etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
      totalHours: getMissionTotalHours(mission.PlageHoraireMission),
    });
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
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: {
        id: true,
        stripeCustomerId: true,
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

    const missionStatut = profilEtablissement.stripeCustomerId
      ? 'en_recherche'
      : 'ajouter_mode_paiement';

    const pricing = computeMissionPricing({
      plagesHoraires: req.body.plagesHoraires,
      methodeTarification: req.body.methodeTarification,
      tarif: normalizedTarif,
      commissionPercent: env.STRIPE_COMMISSION_PERCENT,
    });

    const mission = await prisma.mission.create({
      data: {
        statut: missionStatut,
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
        montantHT: pricing.montantHT,
        montantFraisService: pricing.montantFraisService,
        montantTTC: pricing.montantTTC,
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

    try {
      if (missionStatut === 'en_recherche') {
        await syncMissionMatches(mission.id);
      }
    } catch (matchingError) {
      logger.error(
        { err: matchingError, missionId: mission.id },
        'Échec du matching automatique après création de mission',
      );
    }

    return res.status(201).json(mission);
  } catch (err) {
    return next(err);
  }
};

// ─── Établissement: Activate missions pending payment setup ──────────────────

export const activatePendingMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: {
        id: true,
        stripeCustomerId: true,
        raisonSociale: true,
        utilisateur: { select: { email: true, nom: true, prenom: true } },
        etablissements: { select: { id: true } },
      },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    // Create Stripe Customer if it doesn't exist
    if (!profilEtablissement.stripeCustomerId) {
      const { stripe } = await import('../../config/stripe.js');
      const user = profilEtablissement.utilisateur;

      const customer = await stripe.customers.create({
        email: user.email,
        name: profilEtablissement.raisonSociale || `${user.prenom} ${user.nom}`.trim(),
        metadata: {
          profilEtablissementId: profilEtablissement.id,
          utilisateurId: userId,
        },
      });

      await prisma.profilEtablissement.update({
        where: { id: profilEtablissement.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Find all missions in ajouter_mode_paiement for this établissement
    const etablissementIds = profilEtablissement.etablissements.map((e) => e.id);

    const pendingMissions = await prisma.mission.findMany({
      where: {
        etablissementId: { in: etablissementIds },
        statut: 'ajouter_mode_paiement',
      },
      select: { id: true },
    });

    if (pendingMissions.length === 0) {
      return res.json({ activated: 0 });
    }

    // Transition all to en_recherche
    await prisma.mission.updateMany({
      where: {
        id: { in: pendingMissions.map((m) => m.id) },
        statut: 'ajouter_mode_paiement',
      },
      data: { statut: 'en_recherche' },
    });

    // Sync matches for each activated mission
    for (const mission of pendingMissions) {
      try {
        await syncMissionMatches(mission.id);
      } catch (matchingError) {
        logger.error(
          { err: matchingError, missionId: mission.id },
          'Échec du matching après activation de mission',
        );
      }
    }

    logger.info(
      { userId, count: pendingMissions.length },
      'Missions activées après configuration paiement',
    );

    return res.json({ activated: pendingMissions.length });
  } catch (err) {
    return next(err);
  }
};

export const triggerManualMissionSearchByEtablissement = async (
  req: Request<MissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: {
        id: true,
        statut: true,
        dateDerniereRechercheRenford: true,
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (mission.statut !== 'en_recherche') {
      return res.status(400).json({
        message: 'La recherche manuelle est disponible uniquement pour les missions en recherche',
      });
    }

    if (mission.dateDerniereRechercheRenford) {
      const now = Date.now();
      const lastSearchAt = new Date(mission.dateDerniereRechercheRenford).getTime();
      const cooldownMs = 60_000;
      const remainingMs = cooldownMs - (now - lastSearchAt);

      if (remainingMs > 0) {
        return res.status(429).json({
          message: 'Veuillez patienter avant de relancer une recherche manuelle',
          cooldownRemainingMs: remainingMs,
        });
      }
    }

    const result = await syncMissionMatches(mission.id);

    return res.json({
      ...result,
      dateDerniereRechercheRenford: new Date().toISOString(),
      source: 'manuel',
    });
  } catch (err) {
    return next(err);
  }
};

export const respondToMissionRenfordByEtablissement = async (
  req: Request<MissionRenfordIdParamsSchema, unknown, RespondToMissionRenfordByEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    try {
      const result = await registerEtablissementMissionRenfordResponse({
        missionId: req.params.missionId,
        missionRenfordId: req.params.missionRenfordId,
        response: req.body.response,
      });

      return res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'MISSION_RENFORD_NOT_FOUND') {
        return res.status(404).json({
          message: 'Candidature non trouvée ou non en cours de sélection',
        });
      }

      if (error instanceof Error && error.message === 'MISSION_ALREADY_STARTED') {
        return res.status(400).json({
          message: 'Cette candidature ne peut plus être refusée car la mission a déjà démarré',
        });
      }

      throw error;
    }
  } catch (err) {
    return next(err);
  }
};

export const signContractByEtablissement = async (
  req: Request<MissionRenfordIdParamsSchema, unknown, SignMissionDocumentSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true, statut: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    const missionRenford = await prisma.missionRenford.findUnique({
      where: { id: req.params.missionRenfordId },
    });

    if (!missionRenford || missionRenford.missionId !== mission.id) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    if (missionRenford.statut !== 'contrat_signe') {
      return res.status(400).json({
        message: 'Le renford doit signer le contrat en premier',
      });
    }

    await prisma.$transaction([
      prisma.missionRenford.update({
        where: { id: missionRenford.id },
        data: {
          statut: 'mission_en_cours',
          signatureContratPrestationEtablissementChemin: await saveSignatureDataUrl(
            req.body.signatureDataUrl,
            'signatures/contrat-prestation',
            `etablissement-${missionRenford.id}`,
          ),
        },
      }),
      prisma.mission.update({
        where: { id: mission.id },
        data: { statut: 'mission_en_cours' },
      }),
      prisma.missionRenford.updateMany({
        where: {
          missionId: mission.id,
          id: { not: missionRenford.id },
          statut: { in: ['selection_en_cours', 'attente_de_signature'] },
        },
        data: {
          statut: 'refuse_par_etablissement',
          ordreShortlist: null,
        },
      }),
    ]);

    return res.json({
      missionRenfordId: missionRenford.id,
      statut: 'mission_en_cours',
    });
  } catch (err) {
    return next(err);
  }
};

export const signAttestationByEtablissement = async (
  req: Request<MissionRenfordIdParamsSchema, unknown, SignMissionDocumentSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true, statut: true, modeMission: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (mission.modeMission !== 'flex') {
      return res.status(400).json({
        message: "L'attestation de mission est uniquement disponible pour les missions Flex",
      });
    }

    const missionRenford = await prisma.missionRenford.findUnique({
      where: { id: req.params.missionRenfordId },
    });

    if (!missionRenford || missionRenford.missionId !== mission.id) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    if (mission.statut !== 'mission_terminee' || missionRenford.statut !== 'mission_terminee') {
      return res.status(400).json({
        message: "L'attestation de mission ne peut être signée qu'après la fin de mission",
      });
    }

    if (missionRenford.signatureAttestationMissionEtablissementChemin) {
      return res.status(400).json({
        message: "L'attestation de mission a déjà été signée par l'établissement",
      });
    }

    const updated = await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: {
        signatureAttestationMissionEtablissementChemin: await saveSignatureDataUrl(
          req.body.signatureDataUrl,
          'signatures/attestation-mission',
          `etablissement-${missionRenford.id}`,
        ),
      },
      select: { id: true, statut: true, signatureAttestationMissionEtablissementChemin: true },
    });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};

export const downloadMissionDocumentByEtablissement = async (
  req: Request<MissionDocumentParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { missionId, missionRenfordId, documentType } = req.params;

    const mission = await prisma.mission.findFirst({
      where: {
        id: missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      include: {
        etablissement: {
          include: {
            profilEtablissement: true,
          },
        },
        PlageHoraireMission: true,
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    const missionRenford = await prisma.missionRenford.findFirst({
      where: {
        id: missionRenfordId,
        missionId,
      },
      include: {
        profilRenford: {
          include: {
            utilisateur: true,
          },
        },
      },
    });

    if (!missionRenford) {
      return res.status(404).json({ message: 'Mission Renford non trouvée' });
    }

    if (documentType === 'attestation_mission' && mission.modeMission !== 'flex') {
      return res.status(400).json({
        message: "L'attestation de mission est uniquement disponible pour les missions Flex",
      });
    }

    const pdfBuffer = buildMissionDocumentPdf(documentType as MissionDocumentType, {
      mission,
      missionRenford,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${getMissionDocumentFilename(documentType as MissionDocumentType, missionId)}"`,
    );

    return res.send(pdfBuffer);
  } catch (err) {
    return next(err);
  }
};

export const markMissionAsTermineeByEtablissement = async (
  req: Request<MissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true, statut: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (!['mission_en_cours', 'remplacement_en_cours', 'en_litige'].includes(mission.statut)) {
      return res.status(400).json({
        message: 'Cette mission ne peut pas être marquée comme terminée dans son état actuel',
      });
    }

    await prisma.$transaction([
      prisma.mission.update({
        where: { id: mission.id },
        data: { statut: 'mission_terminee' },
      }),
      prisma.missionRenford.updateMany({
        where: {
          missionId: mission.id,
          statut: { in: ['mission_en_cours', 'contrat_signe'] },
        },
        data: { statut: 'mission_terminee' },
      }),
    ]);

    return res.json({ id: mission.id, statut: 'mission_terminee' });
  } catch (err) {
    return next(err);
  }
};

export const clotureMissionByEtablissement = async (
  req: Request<MissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true, statut: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (mission.statut !== 'mission_terminee') {
      return res.status(400).json({
        message: 'Seules les missions terminées peuvent être clôturées',
      });
    }

    const paiement = await prisma.paiement.findFirst({
      where: {
        missionId: mission.id,
        statut: 'libere',
      },
      select: { id: true },
    });

    if (!paiement) {
      return res.status(400).json({
        message: "La mission doit être payée avant d'être clôturée",
      });
    }

    const updatedMission = await prisma.mission.update({
      where: { id: mission.id },
      data: { statut: 'archivee' },
      select: { id: true, statut: true },
    });

    return res.json(updatedMission);
  } catch (err) {
    return next(err);
  }
};

export const cancelMissionByEtablissement = async (
  req: Request<MissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const mission = await prisma.mission.findFirst({
      where: {
        id: req.params.missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true, statut: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (
      [
        'mission_en_cours',
        'remplacement_en_cours',
        'en_litige',
        'mission_terminee',
        'archivee',
      ].includes(mission.statut)
    ) {
      return res.status(400).json({
        message: 'Cette mission ne peut plus être annulée dans son état actuel',
      });
    }

    await prisma.$transaction([
      prisma.mission.update({
        where: { id: mission.id },
        data: { statut: 'annulee' },
      }),
      prisma.missionRenford.updateMany({
        where: {
          missionId: mission.id,
          statut: {
            in: ['nouveau', 'vu', 'selection_en_cours', 'attente_de_signature', 'contrat_signe'],
          },
        },
        data: {
          statut: 'annule',
          ordreShortlist: null,
        },
      }),
    ]);

    return res.json({ id: mission.id, statut: 'annulee' });
  } catch (err) {
    return next(err);
  }
};
