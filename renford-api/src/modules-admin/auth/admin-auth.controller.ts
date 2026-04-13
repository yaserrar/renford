import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';

// GET /admin/me — Current authenticated admin
export const getCurrentAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Administrateur non authentifié' });
    }

    const admin = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        typeUtilisateur: true,
        statut: true,
        derniereConnexion: true,
        dateCreation: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    if (admin.typeUtilisateur !== 'administrateur') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    return res.json(admin);
  } catch (err) {
    return next(err);
  }
};
