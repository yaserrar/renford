import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import {
  UpdateAvatarProfilEtablissementSchema,
  UpdateCouvertureProfilEtablissementSchema,
  UpdateIdentiteProfilEtablissementSchema,
  UpdateInfosProfilEtablissementSchema,
} from './profil-etablissement.schema';

export const updateCouvertureProfilEtablissement = async (
  req: Request<unknown, unknown, UpdateCouvertureProfilEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const existingProfil = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!existingProfil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const profil = await prisma.profilEtablissement.update({
      where: { utilisateurId: userId },
      data: {
        imageCouvertureChemin: req.body.imageCouvertureChemin,
      },
    });

    return res.json(profil);
  } catch (err) {
    return next(err);
  }
};

export const updateAvatarProfilEtablissement = async (
  req: Request<unknown, unknown, UpdateAvatarProfilEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const existingProfil = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!existingProfil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const profil = await prisma.profilEtablissement.update({
      where: { utilisateurId: userId },
      data: {
        avatarChemin: req.body.avatarChemin,
      },
    });

    return res.json(profil);
  } catch (err) {
    return next(err);
  }
};

export const updateInfosProfilEtablissement = async (
  req: Request<unknown, unknown, UpdateInfosProfilEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const existingProfil = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!existingProfil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const { raisonSociale, typeEtablissement, aPropos } = req.body;

    const profil = await prisma.profilEtablissement.update({
      where: { utilisateurId: userId },
      data: {
        raisonSociale,
        typeEtablissement,
        aPropos: aPropos ?? null,
      },
    });

    return res.json(profil);
  } catch (err) {
    return next(err);
  }
};

export const updateIdentiteProfilEtablissement = async (
  req: Request<unknown, unknown, UpdateIdentiteProfilEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const existingProfil = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!existingProfil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const {
      raisonSociale,
      siret,
      adresse,
      codePostal,
      ville,
      latitude,
      longitude,
      typeEtablissement,
      adresseSiegeDifferente,
      adresseSiege,
      codePostalSiege,
      villeSiege,
    } = req.body;

    const siegeData = adresseSiegeDifferente
      ? {
          adresseSiege,
          codePostalSiege,
          villeSiege,
        }
      : {
          adresseSiege: null,
          codePostalSiege: null,
          villeSiege: null,
        };

    const profil = await prisma.profilEtablissement.update({
      where: { utilisateurId: userId },
      data: {
        raisonSociale,
        siret,
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        typeEtablissement,
        adresseSiegeDifferente,
        ...siegeData,
      },
    });

    return res.json(profil);
  } catch (err) {
    return next(err);
  }
};
