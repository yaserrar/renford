import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import {
  CreateEtablissementSiteSchema,
  UpdateAvatarProfilEtablissementSchema,
  UpdateCouvertureProfilEtablissementSchema,
  UpdateEtablissementSiteSchema,
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

export const createEtablissementSite = async (
  req: Request<unknown, unknown, CreateEtablissementSiteSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const profil = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: {
        id: true,
        siret: true,
        typeEtablissement: true,
        etablissements: {
          select: { id: true },
        },
      },
    });

    if (!profil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const {
      nom,
      adresse,
      codePostal,
      ville,
      latitude,
      longitude,
      siret,
      typeEtablissement,
      emailPrincipal,
      telephonePrincipal,
      nomContactPrincipal,
      prenomContactPrincipal,
      adresseFacturationDifferente,
      adresseFacturation,
      codePostalFacturation,
      villeFacturation,
    } = req.body;

    const finalSiret = siret ?? profil.siret;
    const finalType = typeEtablissement ?? profil.typeEtablissement;

    if (!finalSiret || !/^\d{14}$/.test(finalSiret)) {
      return res.status(400).json({ message: 'SIRET invalide pour cet établissement' });
    }

    if (!finalType) {
      return res.status(400).json({ message: "Type d'établissement manquant" });
    }

    const etablissement = await prisma.etablissement.create({
      data: {
        profilEtablissementId: profil.id,
        nom,
        siret: finalSiret,
        typeEtablissement: finalType,
        roleEtablissement: profil.etablissements.length === 0 ? 'principal' : 'secondaire',
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        emailPrincipal: emailPrincipal ?? null,
        telephonePrincipal: telephonePrincipal ?? null,
        nomContactPrincipal: nomContactPrincipal ?? null,
        prenomContactPrincipal: prenomContactPrincipal ?? null,
        adresseFacturationDifferente,
        adresseFacturation: adresseFacturationDifferente
          ? (adresseFacturation as string)
          : adresse,
        codePostalFacturation: adresseFacturationDifferente
          ? (codePostalFacturation as string)
          : codePostal,
        villeFacturation: adresseFacturationDifferente
          ? (villeFacturation as string)
          : ville,
      },
    });

    return res.status(201).json(etablissement);
  } catch (err) {
    return next(err);
  }
};

export const updateEtablissementSite = async (
  req: Request<{ etablissementId: string }, unknown, UpdateEtablissementSiteSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { etablissementId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const profil = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profil) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const existingEtablissement = await prisma.etablissement.findFirst({
      where: {
        id: etablissementId,
        profilEtablissementId: profil.id,
      },
    });

    if (!existingEtablissement) {
      return res.status(404).json({ message: 'Établissement non trouvé' });
    }

    const {
      nom,
      adresse,
      codePostal,
      ville,
      latitude,
      longitude,
      siret,
      typeEtablissement,
      emailPrincipal,
      telephonePrincipal,
      nomContactPrincipal,
      prenomContactPrincipal,
      adresseFacturationDifferente,
      adresseFacturation,
      codePostalFacturation,
      villeFacturation,
    } = req.body;

    const etablissement = await prisma.etablissement.update({
      where: { id: etablissementId },
      data: {
        nom,
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        ...(siret ? { siret } : {}),
        ...(typeEtablissement ? { typeEtablissement } : {}),
        emailPrincipal: emailPrincipal ?? null,
        telephonePrincipal: telephonePrincipal ?? null,
        nomContactPrincipal: nomContactPrincipal ?? null,
        prenomContactPrincipal: prenomContactPrincipal ?? null,
        adresseFacturationDifferente,
        ...(adresseFacturationDifferente
          ? {
              adresseFacturation: adresseFacturation as string,
              codePostalFacturation: codePostalFacturation as string,
              villeFacturation: villeFacturation as string,
            }
          : {
              adresseFacturation: adresse,
              codePostalFacturation: codePostal,
              villeFacturation: ville,
            }),
      },
    });

    return res.json(etablissement);
  } catch (err) {
    return next(err);
  }
};
