import type { NextFunction, Request, Response } from 'express';
import type { StatutMission } from '@prisma/client';
import prisma from '../../config/prisma';
import { mail } from '../../config/mail';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import {
  getMissionDemandeConfirmeeCoachEmail,
  getMissionDemandeConfirmeeFlexEmail,
  getSignatureConfirmationEmail,
  getVisioInvitationRenfordEmail,
  getFinMissionRenfordCoachEmail,
  getFinMissionRenfordFlexEmail,
  getFinMissionEtablissementCoachEmail,
  getFinMissionEtablissementFlexEmail,
  getMissionAnnuleeRenfordEmail,
  getContratSigneEtablissementCoachEmail,
  getContratSigneEtablissementFlexEmail,
  getChangementSignaleRenfordEmail,
} from '../../config/email-templates';
import { createNotification } from '../../config/notification';
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

const formatMissionPlageForEmail = (
  plagesHoraires: Array<{
    date: Date | string;
    heureDebut: string;
    heureFin: string;
  }>,
) => {
  return plagesHoraires
    .slice()
    .sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.heureDebut.localeCompare(b.heureDebut);
    })
    .map((plage) => {
      const dateLabel = new Date(plage.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return `${dateLabel} (${plage.heureDebut} - ${plage.heureFin})`;
    })
    .join(' ; ');
};

const formatMissionTarifForEmail = (tarif: number, methodeTarification: string) => {
  const methodeLabel =
    methodeTarification === 'horaire'
      ? 'heure'
      : methodeTarification === 'journee'
        ? 'journee'
        : 'demi-journee';

  return `${tarif.toLocaleString('fr-FR', {
    minimumFractionDigits: Number.isInteger(tarif) ? 0 : 2,
    maximumFractionDigits: 2,
  })} EUR / ${methodeLabel}`;
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
            evaluation: {
              select: { id: true, note: true, commentaire: true, dateCreation: true },
            },
          },
        },
      },
      orderBy: [{ dateDebut: 'desc' }, { dateCreation: 'desc' }],
    });

    const missionsWithTotalHours = missions.map((mission) => {
      const totalHours = getMissionTotalHours(mission.PlageHoraireMission);
      const firstMR = mission.missionsRenford[0];
      const renford = firstMR?.profilRenford;
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
              missionRenfordId: firstMR.id,
              missionRenfordStatut: firstMR.statut,
              evaluation: firstMR.evaluation ?? null,
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
            evaluation: {
              select: { id: true, note: true, commentaire: true, dateCreation: true },
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
      modeMission: req.body.modeMission,
      coachFeeHT: env.COACH_FEE_HT,
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
        dateFin: req.body.dateFin ?? null,
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
      const posteDemande = getTypeMissionLabel(mission.specialitePrincipale);
      const plageMission = formatMissionPlageForEmail(req.body.plagesHoraires);
      const prenomEtablissement = user.prenom;

      const emailPayload =
        req.body.modeMission === 'coach'
          ? getMissionDemandeConfirmeeCoachEmail({
              prenomEtablissement,
              posteDemande,
              plageMission,
              tarifSouhaite: formatMissionTarifForEmail(
                normalizedTarif,
                req.body.methodeTarification,
              ),
            })
          : getMissionDemandeConfirmeeFlexEmail({
              prenomEtablissement,
              posteDemande,
              plageMission,
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
      select: {
        id: true,
        statut: true,
        modeMission: true,
        discipline: true,
        dateDebut: true,
        etablissement: {
          select: {
            profilEtablissement: {
              select: { utilisateur: { select: { email: true, prenom: true, nom: true } } },
            },
          },
        },
        PlageHoraireMission: true,
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    const missionRenford = await prisma.missionRenford.findUnique({
      where: { id: req.params.missionRenfordId },
      include: {
        profilRenford: {
          select: { utilisateur: { select: { prenom: true } } },
        },
      },
    });

    if (!missionRenford || missionRenford.missionId !== mission.id) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    // Renford must have signed first
    if (!missionRenford.signatureContratPrestationRenfordId) {
      return res.status(400).json({
        message: 'Le renford doit signer le contrat en premier',
      });
    }

    // Check if etablissement already signed
    if (missionRenford.signatureContratPrestationEtablissementId) {
      return res.json({
        missionRenfordId: missionRenford.id,
        statut: missionRenford.statut,
        alreadySigned: true,
        message: 'Vous avez déjà signé ce contrat',
      });
    }

    // Validate signature data from request body
    const { signatureImage } = req.body as { signatureImage?: string };
    if (!signatureImage) {
      return res.status(400).json({ message: 'La signature est requise' });
    }

    const etablissementUser = mission.etablissement?.profilEtablissement?.utilisateur;
    if (!etablissementUser?.email) {
      return res.status(400).json({ message: "Email de l'établissement introuvable" });
    }

    // Save signature image to disk
    const { promises: fsPromises } = await import('fs');
    const pathModule = await import('path');
    const signatureDir = pathModule.join(process.cwd(), 'uploads', 'signatures');
    await fsPromises.mkdir(signatureDir, { recursive: true });

    const filename = `contrat-etab-${missionRenford.id}-${Date.now()}.png`;
    const filePath = pathModule.join(signatureDir, filename);

    const base64Data = signatureImage.replace(/^data:image\/\w+;base64,/, '');
    await fsPromises.writeFile(filePath, Buffer.from(base64Data, 'base64'));

    const cheminImage = `uploads/signatures/${filename}`;

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgentStr = req.headers['user-agent'] || 'unknown';
    const lienCgu = `${env.PLATFORM_URL}/conditions`;

    // Create signature record
    const signature = await prisma.signatureContrat.create({
      data: {
        cheminImage,
        nomSignataire: `${etablissementUser.prenom} ${etablissementUser.nom}`,
        emailSignataire: etablissementUser.email,
        roleSignataire: 'etablissement',
        lienCgu,
        source: 'web',
        adresseIp: ipAddress,
        userAgent: userAgentStr,
      },
    });

    // Link signature to mission renford and transition to mission_en_cours
    await prisma.$transaction([
      prisma.missionRenford.update({
        where: { id: missionRenford.id },
        data: {
          signatureContratPrestationEtablissementId: signature.id,
          statut: 'mission_en_cours',
        },
      }),
      prisma.mission.update({
        where: { id: mission.id },
        data: { statut: 'mission_en_cours' },
      }),
      // Reject other candidates
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

    // Send confirmation email to etablissement
    const emailPayload = getSignatureConfirmationEmail({
      prenom: etablissementUser.prenom,
      nomSignataire: `${etablissementUser.prenom} ${etablissementUser.nom}`,
      roleSignataire: 'Établissement',
      missionDescription: `${mission.discipline} – ${new Date(mission.dateDebut).toLocaleDateString('fr-FR')}`,
      dateSignature: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      lienCgu,
    });

    try {
      await mail.sendMail({
        to: etablissementUser.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });
    } catch (emailError) {
      logger.error({ err: emailError }, 'Échec envoi email confirmation signature établissement');
    }

    // Send "contrat signé par les deux parties" email to établissement
    const renfordPrenom = missionRenford.profilRenford?.utilisateur?.prenom ?? '';
    const contratSignePayload =
      mission.modeMission === 'coach'
        ? getContratSigneEtablissementCoachEmail({
            prenomEtablissement: etablissementUser.prenom,
            prenomRenford: renfordPrenom,
            espaceUrl: `${env.PLATFORM_URL}/dashboard/etablissement/missions/${mission.id}`,
          })
        : getContratSigneEtablissementFlexEmail({
            prenomEtablissement: etablissementUser.prenom,
            prenomRenford: renfordPrenom,
            espaceUrl: `${env.PLATFORM_URL}/dashboard/etablissement/missions/${mission.id}`,
          });

    try {
      await mail.sendMail({
        to: etablissementUser.email,
        subject: contratSignePayload.subject,
        html: contratSignePayload.html,
        text: contratSignePayload.text,
      });
    } catch (emailError) {
      logger.error({ err: emailError }, 'Échec envoi email contrat signé établissement');
    }

    return res.json({
      missionRenfordId: missionRenford.id,
      statut: 'mission_en_cours',
      signatureId: signature.id,
    });
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
        signatureContratPrestationRenford: true,
        signatureContratPrestationEtablissement: true,
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
      select: {
        id: true,
        statut: true,
        modeMission: true,
        etablissement: {
          select: {
            nom: true,
            profilEtablissement: {
              select: {
                raisonSociale: true,
                utilisateur: { select: { email: true, prenom: true } },
              },
            },
          },
        },
        missionsRenford: {
          where: { statut: { in: ['mission_en_cours', 'contrat_signe'] } },
          select: {
            profilRenford: {
              select: {
                utilisateur: { select: { email: true, prenom: true } },
              },
            },
          },
        },
      },
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
        data: { statut: 'mission_terminee', dateTerminee: new Date() },
      }),
      prisma.missionRenford.updateMany({
        where: {
          missionId: mission.id,
          statut: { in: ['mission_en_cours', 'contrat_signe'] },
        },
        data: { statut: 'mission_terminee' },
      }),
    ]);

    // Send end-of-mission emails
    const urlBase = env.PLATFORM_URL.replace(/\/$/, '');
    const etabUser = mission.etablissement.profilEtablissement.utilisateur;
    const raisonSociale =
      mission.etablissement.profilEtablissement.raisonSociale || mission.etablissement.nom;

    for (const mr of mission.missionsRenford) {
      const renfordUser = mr.profilRenford.utilisateur;
      if (!renfordUser.email) continue;

      const renfordPayload =
        mission.modeMission === 'coach'
          ? getFinMissionRenfordCoachEmail({
              prenomRenford: renfordUser.prenom,
              raisonSociale,
              espaceUrl: `${urlBase}/dashboard/renford/missions`,
            })
          : getFinMissionRenfordFlexEmail({
              prenomRenford: renfordUser.prenom,
              raisonSociale,
              espaceUrl: `${urlBase}/dashboard/renford/missions`,
            });

      mail
        .sendMail({
          to: renfordUser.email,
          subject: renfordPayload.subject,
          html: renfordPayload.html,
          text: renfordPayload.text,
        })
        .catch((err) =>
          logger.error({ err, missionId: mission.id }, 'Échec envoi email fin de mission Renford'),
        );
    }

    if (etabUser.email) {
      const etabPayload =
        mission.modeMission === 'coach'
          ? getFinMissionEtablissementCoachEmail({
              prenomEtablissement: etabUser.prenom,
              prenomRenford: mission.missionsRenford[0]?.profilRenford.utilisateur.prenom || '',
              espaceUrl: `${urlBase}/dashboard/etablissement/missions/${mission.id}`,
            })
          : getFinMissionEtablissementFlexEmail({
              prenomEtablissement: etabUser.prenom,
              prenomRenford: mission.missionsRenford[0]?.profilRenford.utilisateur.prenom || '',
              espaceUrl: `${urlBase}/dashboard/etablissement/missions/${mission.id}`,
            });

      mail
        .sendMail({
          to: etabUser.email,
          subject: etabPayload.subject,
          html: etabPayload.html,
          text: etabPayload.text,
        })
        .catch((err) =>
          logger.error(
            { err, missionId: mission.id },
            'Échec envoi email fin de mission Établissement',
          ),
        );
    }

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
      data: { statut: 'archivee', dateCloturee: new Date() },
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
      select: {
        id: true,
        statut: true,
        modeMission: true,
        specialitePrincipale: true,
        etablissement: {
          select: {
            nom: true,
            profilEtablissement: { select: { raisonSociale: true } },
          },
        },
        missionsRenford: {
          where: {
            statut: {
              in: ['nouveau', 'vu', 'selection_en_cours', 'attente_de_signature', 'contrat_signe'],
            },
          },
          select: {
            profilRenford: {
              select: {
                utilisateur: { select: { email: true, prenom: true } },
              },
            },
          },
        },
      },
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
        data: { statut: 'annulee', dateAnnulee: new Date() },
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

    // Send cancellation email to all affected renfords
    const raisonSociale =
      mission.etablissement.profilEtablissement.raisonSociale || mission.etablissement.nom;

    for (const mr of mission.missionsRenford) {
      const renfordUser = mr.profilRenford.utilisateur;
      if (!renfordUser.email) continue;

      const payload = getMissionAnnuleeRenfordEmail({
        prenomRenford: renfordUser.prenom,
        typeMission: getTypeMissionLabel(mission.specialitePrincipale),
        raisonSociale,
      });

      mail
        .sendMail({
          to: renfordUser.email,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        })
        .catch((err) =>
          logger.error({ err, missionId: mission.id }, 'Échec envoi email annulation Renford'),
        );
    }

    return res.json({ id: mission.id, statut: 'annulee' });
  } catch (err) {
    return next(err);
  }
};

export const setVisioLinkByEtablissement = async (
  req: Request<MissionRenfordIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { missionId, missionRenfordId } = req.params;

    const mission = await prisma.mission.findFirst({
      where: {
        id: missionId,
        etablissement: {
          profilEtablissement: {
            utilisateurId: userId,
          },
        },
      },
      select: { id: true, modeMission: true, discipline: true, dateDebut: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    // if (mission.modeMission === 'flex') {
    //   return res.status(400).json({
    //     message: "La visio n'est pas disponible pour les missions Flex",
    //   });
    // }

    const missionRenford = await prisma.missionRenford.findFirst({
      where: {
        id: missionRenfordId,
        missionId,
        statut: 'selection_en_cours',
      },
      select: {
        id: true,
        lienVisio: true,
        profilRenford: {
          select: {
            utilisateur: {
              select: { id: true, prenom: true, email: true },
            },
          },
        },
      },
    });

    if (!missionRenford) {
      return res.status(404).json({
        message: 'Candidature non trouvée ou non en cours de sélection',
      });
    }

    const lienVisio = missionRenford.lienVisio ?? `https://meet.jit.si/renford-${missionRenfordId}`;
    const isFirstGeneration = !missionRenford.lienVisio;

    if (isFirstGeneration) {
      await prisma.missionRenford.update({
        where: { id: missionRenfordId },
        data: { lienVisio },
      });

      const renfordUser = missionRenford.profilRenford.utilisateur;
      const etablissement = await prisma.etablissement.findFirst({
        where: {
          profilEtablissement: { utilisateurId: userId },
        },
        select: { nom: true },
      });
      const etablissementNom = etablissement?.nom ?? "L'établissement";
      const missionDescription = `${mission.discipline} – ${new Date(mission.dateDebut).toLocaleDateString('fr-FR')}`;
      const missionUrl = `${env.PLATFORM_URL}/dashboard/renford/missions/${missionId}`;

      const emailPayload = getVisioInvitationRenfordEmail({
        prenom: renfordUser.prenom,
        missionDescription,
        etablissementNom,
        lienVisio,
        missionUrl,
      });

      Promise.all([
        mail
          .sendMail({
            to: renfordUser.email,
            subject: emailPayload.subject,
            html: emailPayload.html,
            text: emailPayload.text,
          })
          .catch((err) => logger.error({ err }, 'Échec envoi email invitation visio Renford')),
        createNotification({
          utilisateurId: renfordUser.id,
          source: 'mission_renfords',
          sourceId: missionRenfordId,
          titre: 'Invitation à une visioconférence',
          description: `${etablissementNom} vous invite à une visio avant votre mission.`,
        }).catch((err) => logger.error({ err }, 'Échec création notification visio Renford')),
      ]);
    }

    return res.json({ lienVisio });
  } catch (err) {
    return next(err);
  }
};

export const signalerChangementByEtablissement = async (
  req: Request<{ missionId: string }, unknown, { type: string; motif: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { missionId } = req.params;
    const { type, motif } = req.body;

    if (!type || !motif) {
      return res.status(400).json({ message: 'Le type et le motif sont obligatoires' });
    }

    const mission = await prisma.mission.findFirst({
      where: {
        id: missionId,
        etablissement: { profilEtablissement: { utilisateurId: userId } },
        statut: { in: ['attente_de_signature', 'mission_en_cours', 'remplacement_en_cours'] },
      },
      include: {
        etablissement: { select: { nom: true } },
        missionsRenford: {
          where: { statut: { in: ['attente_de_signature', 'contrat_signe', 'mission_en_cours'] } },
          include: {
            profilRenford: { include: { utilisateur: true } },
          },
        },
      },
    });

    if (!mission) {
      return res.status(400).json({
        message: 'Mission non trouvée ou état non compatible pour signaler un changement.',
      });
    }

    // Notifier tous les renforts assignés
    const raisonSociale = mission.etablissement?.nom ?? "L'établissement";
    const emailPromises = mission.missionsRenford.map((mr) => {
      const user = mr.profilRenford.utilisateur;
      const emailPayload = getChangementSignaleRenfordEmail({
        prenomRenford: user.prenom,
        raisonSociale,
        typeMission: getTypeMissionLabel(mission.specialitePrincipale),
        typeChangement: type,
        motif,
        espaceUrl: `${env.PLATFORM_URL}/dashboard/renford/missions/${missionId}`,
      });
      return mail
        .sendMail({
          to: user.email,
          subject: emailPayload.subject,
          html: emailPayload.html,
          text: emailPayload.text,
        })
        .catch((err) => logger.error({ err }, 'Échec envoi email changement renford'));
    });
    await Promise.all(emailPromises);

    return res.json({ message: 'Changement signalé avec succès' });
  } catch (err) {
    return next(err);
  }
};
