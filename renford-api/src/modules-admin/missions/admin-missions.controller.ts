import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';

// GET /admin/missions - List all missions
export const getAdminMissions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const missions = await prisma.mission.findMany({
      select: {
        id: true,
        statut: true,
        modeMission: true,
        discipline: true,
        specialitePrincipale: true,
        dateDebut: true,
        dateFin: true,
        methodeTarification: true,
        tarif: true,
        montantHT: true,
        montantTTC: true,
        dateCreation: true,
        etablissement: {
          select: {
            id: true,
            nom: true,
            ville: true,
            profilEtablissement: {
              select: {
                utilisateurId: true,
                avatarChemin: true,
              },
            },
          },
        },
        _count: {
          select: { missionsRenford: true },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(missions);
  } catch (err) {
    return next(err);
  }
};

// GET /admin/missions/:missionId - Mission detail with candidatures
export const getAdminMissionDetail = async (
  req: Request<{ missionId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { missionId } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        etablissement: {
          select: {
            id: true,
            nom: true,
            adresse: true,
            codePostal: true,
            ville: true,
            typeEtablissement: true,
            emailPrincipal: true,
            telephonePrincipal: true,
            profilEtablissement: {
              select: {
                id: true,
                utilisateurId: true,
                avatarChemin: true,
                raisonSociale: true,
              },
            },
          },
        },
        PlageHoraireMission: {
          orderBy: { date: 'asc' },
        },
        missionsRenford: {
          include: {
            profilRenford: {
              select: {
                id: true,
                avatarChemin: true,
                titreProfil: true,
                noteMoyenne: true,
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
            evaluation: true,
          },
          orderBy: { dateProposition: 'desc' },
        },
      },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    return res.json(mission);
  } catch (err) {
    return next(err);
  }
};
