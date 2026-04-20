import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type { ToggleUserStatusBody, ToggleDiplomeVerificationBody } from './utilisateur.schema';

// GET /admin/users - Liste des utilisateurs (établissements + renfords)
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.utilisateur.findMany({
      where: { typeUtilisateur: { in: ['etablissement', 'renford'] } },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        typeUtilisateur: true,
        statut: true,
        dateCreation: true,
        derniereConnexion: true,
        profilEtablissement: {
          select: {
            id: true,
            avatarChemin: true,
          },
        },
        profilRenford: {
          select: {
            id: true,
            avatarChemin: true,
            titreProfil: true,
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

// GET /admin/users/:userId - Détail d'un utilisateur
export const getUserDetail = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const user = await prisma.utilisateur.findFirst({
      where: {
        id: userId,
        typeUtilisateur: { in: ['etablissement', 'renford'] },
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        typeUtilisateur: true,
        statut: true,
        etapeOnboarding: true,
        emailVerifie: true,
        dateCreation: true,
        derniereConnexion: true,
        profilEtablissement: {
          include: {
            etablissements: true,
          },
        },
        profilRenford: {
          include: {
            renfordDiplomes: true,
            experiencesProfessionnelles: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

// PUT /admin/users/:userId/status - Activer/Suspendre un utilisateur
export const toggleUserStatus = async (
  req: Request<{ userId: string }, unknown, ToggleUserStatusBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const { statut } = req.body;

    const user = await prisma.utilisateur.findFirst({
      where: {
        id: userId,
        typeUtilisateur: { in: ['etablissement', 'renford'] },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const updated = await prisma.utilisateur.update({
      where: { id: userId },
      data: { statut },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        statut: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};

// PUT /admin/diplomes/:diplomeId/verification - Vérifier/Dévérifier un diplôme
export const toggleDiplomeVerification = async (
  req: Request<{ diplomeId: string }, unknown, ToggleDiplomeVerificationBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { diplomeId } = req.params;
    const { verifie } = req.body;

    const diplome = await prisma.renfordDiplome.findUnique({
      where: { id: diplomeId },
    });

    if (!diplome) {
      return res.status(404).json({ message: 'Diplôme non trouvé' });
    }

    const updated = await prisma.renfordDiplome.update({
      where: { id: diplomeId },
      data: {
        verifie,
        dateVerification: verifie ? new Date() : null,
      },
    });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};
