import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';

// GET /admin/contact-messages - Liste des messages de contact
export const getContactMessages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.messageContact.findMany({
      include: {
        utilisateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            typeUtilisateur: true,
          },
        },
      },
      orderBy: [{ traite: 'asc' }, { dateCreation: 'desc' }],
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// PUT /admin/contact-messages/:messageId/traiter - Marquer un message comme traité
export const markContactMessageTraite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params as { messageId: string };

    const message = await prisma.messageContact.findUnique({ where: { id: messageId } });
    if (!message) {
      res.status(404).json({ message: 'Message introuvable' });
      return;
    }

    const updated = await prisma.messageContact.update({
      where: { id: messageId },
      data: { traite: true, traiteA: new Date() },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
