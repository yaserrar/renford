import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type {
  ProfilRenfordIdParamsSchema,
  ProposerMissionBodySchema,
} from './favoris-renford.schema';

export const getFavoris = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const favoris = await prisma.favorisRenford.findMany({
      where: { profilEtablissementId: profilEtablissement.id },
      include: {
        profilRenford: {
          select: {
            id: true,
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
              },
            },
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(favoris);
  } catch (err) {
    return next(err);
  }
};

export const addFavori = async (
  req: Request<ProfilRenfordIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { profilRenfordId } = req.params;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { id: profilRenfordId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const favori = await prisma.favorisRenford.upsert({
      where: {
        profilEtablissementId_profilRenfordId: {
          profilEtablissementId: profilEtablissement.id,
          profilRenfordId,
        },
      },
      update: {},
      create: {
        profilEtablissementId: profilEtablissement.id,
        profilRenfordId,
      },
    });

    return res.status(201).json(favori);
  } catch (err) {
    return next(err);
  }
};

export const removeFavori = async (
  req: Request<ProfilRenfordIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { profilRenfordId } = req.params;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    await prisma.favorisRenford.deleteMany({
      where: {
        profilEtablissementId: profilEtablissement.id,
        profilRenfordId,
      },
    });

    return res.json({ message: 'Favori supprimé' });
  } catch (err) {
    return next(err);
  }
};

export const checkFavori = async (
  req: Request<ProfilRenfordIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { profilRenfordId } = req.params;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const favori = await prisma.favorisRenford.findUnique({
      where: {
        profilEtablissementId_profilRenfordId: {
          profilEtablissementId: profilEtablissement.id,
          profilRenfordId,
        },
      },
    });

    return res.json({ isFavori: Boolean(favori) });
  } catch (err) {
    return next(err);
  }
};

export const proposerMission = async (
  req: Request<ProfilRenfordIdParamsSchema, unknown, ProposerMissionBodySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { profilRenfordId } = req.params;
    const { missionId } = req.body;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, etablissements: { select: { id: true } } },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const etablissementIds = profilEtablissement.etablissements.map((e) => e.id);

    // Verify mission belongs to this etablissement and is in valid status
    const mission = await prisma.mission.findFirst({
      where: {
        id: missionId,
        etablissementId: { in: etablissementIds },
        statut: { in: ['en_recherche', 'candidatures_disponibles'] },
      },
      select: { id: true },
    });

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée ou non éligible' });
    }

    // Verify renford profile exists
    const profilRenford = await prisma.profilRenford.findUnique({
      where: { id: profilRenfordId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    // Check if MissionRenford already exists
    const existing = await prisma.missionRenford.findUnique({
      where: {
        missionId_profilRenfordId: {
          missionId,
          profilRenfordId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'Ce Renford est déjà associé à cette mission' });
    }

    const missionRenford = await prisma.missionRenford.create({
      data: {
        missionId,
        profilRenfordId,
        statut: 'nouveau',
      },
    });

    return res.status(201).json(missionRenford);
  } catch (err) {
    return next(err);
  }
};
