import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { ChangePasswordSchema, UpdateProfileSchema } from './utilisateur.schema';

// GET /user/me - Obtenir l'utilisateur connecté
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        avatarChemin: true,
        typeUtilisateur: true,
        statut: true,
        emailVerifie: true,
        dateCreation: true,
        derniereConnexion: true,
        // Relations selon le type d'utilisateur
        profilEtablissement: {
          include: {
            etablissements: true,
            informationsBancaires: true,
          },
        },
        profilRenford: {
          include: {
            typesPostes: true,
            specialisations: true,
            diplomes: true,
            documentsRenford: true,
          },
        },
      },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// PUT /user/profile - Mettre à jour le profil
export const updateProfile = async (
  req: Request<unknown, unknown, UpdateProfileSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { nom, prenom, telephone, avatarChemin } = req.body;

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        ...(nom && { nom }),
        ...(prenom && { prenom }),
        ...(telephone !== undefined && { telephone }),
        ...(avatarChemin !== undefined && { avatarChemin }),
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        avatarChemin: true,
        typeUtilisateur: true,
      },
    });

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// PUT /user/password - Changer le mot de passe
export const changePassword = async (
  req: Request<unknown, unknown, ChangePasswordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!utilisateur.motDePasse) {
      return res.status(400).json({
        message: 'Impossible de changer le mot de passe pour ce type de compte',
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, utilisateur.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Le mot de passe actuel est incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.utilisateur.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword },
    });

    return res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    return next(err);
  }
};
