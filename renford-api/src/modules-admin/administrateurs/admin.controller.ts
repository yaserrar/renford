import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type { CreateAdminBody, UpdateAdminBody, UpdateAdminPasswordBody } from './admin.schema';

// GET /admin/admins - Liste des administrateurs
export const getAdmins = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await prisma.utilisateur.findMany({
      where: { typeUtilisateur: 'administrateur' },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        statut: true,
        dateCreation: true,
        derniereConnexion: true,
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(admins);
  } catch (err) {
    return next(err);
  }
};

// POST /admin/admins - Créer un administrateur
export const createAdmin = async (
  req: Request<unknown, unknown, CreateAdminBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, nom, prenom } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.utilisateur.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(409).json({ message: 'Cette adresse email est déjà utilisée' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.utilisateur.create({
      data: {
        email: normalizedEmail,
        motDePasse: hashedPassword,
        typeUtilisateur: 'administrateur',
        nom,
        prenom,
        statut: 'actif',
        emailVerifie: true,
        etapeOnboarding: 5,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        statut: true,
        dateCreation: true,
      },
    });

    return res.status(201).json(admin);
  } catch (err) {
    return next(err);
  }
};

// PUT /admin/admins/:adminId - Modifier un administrateur
export const updateAdmin = async (
  req: Request<{ adminId: string }, unknown, UpdateAdminBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adminId } = req.params;
    const { email, nom, prenom } = req.body;

    const admin = await prisma.utilisateur.findFirst({
      where: { id: adminId, typeUtilisateur: 'administrateur' },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailTaken = await prisma.utilisateur.findFirst({
        where: { email: normalizedEmail, id: { not: adminId } },
      });
      if (emailTaken) {
        return res.status(409).json({ message: 'Cette adresse email est déjà utilisée' });
      }
    }

    const updated = await prisma.utilisateur.update({
      where: { id: adminId },
      data: {
        ...(email && { email: email.trim().toLowerCase() }),
        ...(nom && { nom }),
        ...(prenom && { prenom }),
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        statut: true,
        dateCreation: true,
        derniereConnexion: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};

// PUT /admin/admins/:adminId/password - Modifier le mot de passe d'un admin
export const updateAdminPassword = async (
  req: Request<{ adminId: string }, unknown, UpdateAdminPasswordBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adminId } = req.params;
    const { password } = req.body;

    const admin = await prisma.utilisateur.findFirst({
      where: { id: adminId, typeUtilisateur: 'administrateur' },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.utilisateur.update({
      where: { id: adminId },
      data: { motDePasse: hashedPassword },
    });

    return res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    return next(err);
  }
};

// DELETE /admin/admins/:adminId - Supprimer un administrateur
export const deleteAdmin = async (
  req: Request<{ adminId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adminId } = req.params;
    const currentUserId = req.userId;

    if (adminId === currentUserId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const admin = await prisma.utilisateur.findFirst({
      where: { id: adminId, typeUtilisateur: 'administrateur' },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    await prisma.utilisateur.delete({ where: { id: adminId } });

    return res.json({ message: 'Administrateur supprimé' });
  } catch (err) {
    return next(err);
  }
};
