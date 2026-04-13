import type { NextFunction, Request, Response } from 'express';
import type { StatutMissionRenford } from '@prisma/client';
import prisma from '../../config/prisma';
import { mail } from '../../config/mail';
import { getSignatureConfirmationEmail } from '../../config/email-templates';
import { logger } from '../../config/logger';
import { registerMissionRenfordResponse } from '../../jobs/missions-matching';
import {
  buildMissionDocumentPdf,
  getMissionDocumentFilename,
  type MissionDocumentType,
} from '../missions/mission-documents';
import type {
  GetRenfordMissionsQuerySchema,
  RenfordMissionDocumentParamsSchema,
  RenfordMissionIdParamsSchema,
  RenfordMissionsTab,
  RespondToMissionProposalSchema,
} from './missions-renford.schema';

const RENFORD_TAB_STATUS_MAP: Record<RenfordMissionsTab, StatutMissionRenford[]> = {
  opportunites: ['nouveau', 'vu'],
  candidatures: ['selection_en_cours', 'attente_de_signature', 'refuse_par_etablissement'],
  validees: ['contrat_signe', 'mission_en_cours', 'mission_terminee'],
};

const RENFORD_ALL_STATUSES = Array.from(new Set(Object.values(RENFORD_TAB_STATUS_MAP).flat()));

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

export const getRenfordPendingMissionsCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const count = await prisma.missionRenford.count({
      where: { profilRenfordId: profilRenford.id, statut: 'nouveau' },
    });

    return res.json({ count });
  } catch (err) {
    return next(err);
  }
};

export const getRenfordMissions = async (
  req: Request<unknown, unknown, unknown, GetRenfordMissionsQuerySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const tab = req.query.tab;
    const statuts = tab ? RENFORD_TAB_STATUS_MAP[tab] : RENFORD_ALL_STATUSES;

    const missionsRenford = await prisma.missionRenford.findMany({
      where: {
        profilRenfordId: profilRenford.id,
        statut: { in: statuts },
      },
      include: {
        mission: {
          include: {
            etablissement: {
              select: {
                id: true,
                nom: true,
                profilEtablissement: { select: { avatarChemin: true } },
                adresse: true,
                codePostal: true,
                ville: true,
              },
            },
            PlageHoraireMission: {
              orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
            },
          },
        },
      },
      orderBy: [{ dateProposition: 'desc' }],
    });

    const results = missionsRenford.map((mr) => {
      const { profilEtablissement: etabProfil, ...etabRest } = mr.mission.etablissement;
      return {
        ...mr,
        mission: {
          ...mr.mission,
          etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
          totalHours: getMissionTotalHours(mr.mission.PlageHoraireMission),
        },
      };
    });

    return res.json(results);
  } catch (err) {
    return next(err);
  }
};

export const getRenfordMissionDetails = async (
  req: Request<RenfordMissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const missionRenford = await prisma.missionRenford.findFirst({
      where: {
        mission: { id: req.params.missionId },
        profilRenfordId: profilRenford.id,
      },
      include: {
        mission: {
          include: {
            etablissement: {
              select: {
                id: true,
                nom: true,
                profilEtablissement: { select: { avatarChemin: true } },
                adresse: true,
                codePostal: true,
                ville: true,
                typeEtablissement: true,
              },
            },
            PlageHoraireMission: {
              orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
            },
          },
        },
      },
    });

    if (!missionRenford) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (missionRenford.statut === 'nouveau') {
      await prisma.missionRenford.update({
        where: { id: missionRenford.id },
        data: { statut: 'vu' },
      });
      missionRenford.statut = 'vu';
    }

    const { profilEtablissement: etabProfil, ...etabRest } = missionRenford.mission.etablissement;
    return res.json({
      ...missionRenford,
      mission: {
        ...missionRenford.mission,
        etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
        totalHours: getMissionTotalHours(missionRenford.mission.PlageHoraireMission),
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const respondToMissionProposal = async (
  req: Request<RenfordMissionIdParamsSchema, unknown, RespondToMissionProposalSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    try {
      const result = await registerMissionRenfordResponse({
        missionId: req.params.missionId,
        profilRenfordId: profilRenford.id,
        response: req.body.response,
      });

      return res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'MISSION_RENFORD_NOT_FOUND') {
        return res
          .status(404)
          .json({ message: 'Aucune proposition de mission trouvée pour ce Renford' });
      }

      if (error instanceof Error && error.message === 'MISSION_RENFORD_NOT_PROPOSED') {
        return res.status(400).json({
          message: 'Cette mission nest pas actuellement proposée à ce Renford',
        });
      }

      throw error;
    }
  } catch (err) {
    return next(err);
  }
};

export const signContractByRenford = async (
  req: Request<RenfordMissionIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, utilisateur: { select: { email: true, prenom: true, nom: true } } },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const missionRenford = await prisma.missionRenford.findFirst({
      where: {
        mission: { id: req.params.missionId },
        profilRenfordId: profilRenford.id,
      },
      include: {
        profilRenford: { include: { utilisateur: true } },
        mission: {
          include: {
            PlageHoraireMission: true,
            etablissement: {
              include: { profilEtablissement: { include: { utilisateur: true } } },
            },
          },
        },
      },
    });

    if (!missionRenford) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (missionRenford.statut !== 'attente_de_signature') {
      return res.status(400).json({
        message: 'Ce contrat ne peut pas être signé dans son état actuel',
      });
    }

    // Check if renford already signed
    if (missionRenford.signatureContratPrestationRenfordId) {
      return res.json({
        id: missionRenford.id,
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

    // Save signature image to disk
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const signatureDir = path.join(process.cwd(), 'uploads', 'signatures');
    await fs.mkdir(signatureDir, { recursive: true });

    const filename = `contrat-renford-${missionRenford.id}-${Date.now()}.png`;
    const filePath = path.join(signatureDir, filename);

    // Remove data URL prefix if present
    const base64Data = signatureImage.replace(/^data:image\/\w+;base64,/, '');
    await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));

    const cheminImage = `uploads/signatures/${filename}`;

    // Create signature record
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const lienCgu = `${req.protocol}://${req.get('host')?.replace('/api', '')}/conditions`;

    const signature = await prisma.signatureContrat.create({
      data: {
        cheminImage,
        nomSignataire: `${profilRenford.utilisateur.prenom} ${profilRenford.utilisateur.nom}`,
        emailSignataire: profilRenford.utilisateur.email,
        roleSignataire: 'renford',
        lienCgu,
        source: 'web',
        adresseIp: ipAddress,
        userAgent,
      },
    });

    // Link signature to mission renford and update status
    await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: {
        signatureContratPrestationRenfordId: signature.id,
        statut: 'contrat_signe',
        dateContratSigne: new Date(),
      },
    });

    // Send confirmation email to renford

    const emailPayload = getSignatureConfirmationEmail({
      prenom: profilRenford.utilisateur.prenom,
      nomSignataire: `${profilRenford.utilisateur.prenom} ${profilRenford.utilisateur.nom}`,
      roleSignataire: 'Renford',
      missionDescription: `${missionRenford.mission.discipline} – ${new Date(missionRenford.mission.dateDebut).toLocaleDateString('fr-FR')}`,
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
        to: profilRenford.utilisateur.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });
    } catch (emailError) {
      logger.error({ err: emailError }, 'Échec envoi email confirmation signature renford');
    }

    return res.json({
      id: missionRenford.id,
      statut: 'contrat_signe',
      signatureId: signature.id,
    });
  } catch (err) {
    return next(err);
  }
};

export const downloadMissionDocumentByRenford = async (
  req: Request<RenfordMissionDocumentParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { missionId, documentType } = req.params;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const missionRenford = await prisma.missionRenford.findFirst({
      where: {
        missionId,
        profilRenfordId: profilRenford.id,
      },
      include: {
        profilRenford: {
          include: { utilisateur: true },
        },
        mission: {
          include: {
            PlageHoraireMission: true,
            etablissement: {
              include: {
                profilEtablissement: true,
              },
            },
          },
        },
      },
    });

    if (!missionRenford) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    if (documentType === 'attestation_mission' && missionRenford.mission.modeMission !== 'flex') {
      return res.status(400).json({
        message: "L'attestation de mission est uniquement disponible pour les missions Flex",
      });
    }

    const pdfBuffer = buildMissionDocumentPdf(documentType as MissionDocumentType, {
      mission: missionRenford.mission,
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
