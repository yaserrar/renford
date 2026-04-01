import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type { CreateContactMessageSchema } from './contact.schema';

// POST /contact - Envoyer un message de contact
export const createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId as string;
    const { sujet, texte } = req.body as CreateContactMessageSchema;

    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    const message = await prisma.messageContact.create({
      data: {
        utilisateurId: userId,
        email: user.email,
        sujet,
        texte,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
