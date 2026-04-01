import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type { ToggleUserStatusSchema } from './utilisateur.schema';

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
  req: Request<ToggleUserStatusSchema['params'], unknown, ToggleUserStatusSchema['body']>,
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
