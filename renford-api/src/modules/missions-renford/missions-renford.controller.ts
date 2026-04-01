import type { NextFunction, Request, Response } from 'express';
import type { StatutMissionRenford } from '@prisma/client';
import prisma from '../../config/prisma';
import { registerMissionRenfordResponse } from '../../jobs/missions-matching';
import type {
  GetRenfordMissionsQuerySchema,
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
                avatarChemin: true,
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

    const results = missionsRenford.map((mr) => ({
      ...mr,
      mission: {
        ...mr.mission,
        totalHours: getMissionTotalHours(mr.mission.PlageHoraireMission),
      },
    }));

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
                avatarChemin: true,
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

    return res.json({
      ...missionRenford,
      mission: {
        ...missionRenford.mission,
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
