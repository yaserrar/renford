import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { mail } from '../../config/mail';
import { env } from '../../config/env';
import { getFavoriInvitationEmail } from '../../config/email-templates';
import type { InviteRenfordSchema } from './parrainage.schema';

// ============================================================================
// POST /parrainage/inviter — Invite a renford by email (both renford & etablissement)
// ============================================================================
export const inviterRenford = async (
  req: Request<unknown, unknown, InviteRenfordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { nom, prenom, email: invitedEmail } = req.body;

    // Vérifier si l'email est déjà inscrit
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: invitedEmail.trim().toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà inscrit sur Renford.' });
    }

    // Build invitation URL with parrainId
    const baseUrl = env.PLATFORM_URL.replace(/\/$/, '');
    const invitationUrl = `${baseUrl}/inscription?parrainId=${userId}`;

    // Send invitation email
    const emailContent = getFavoriInvitationEmail({
      nomFavori: prenom,
      invitationUrl,
    });

    await mail.sendMail({
      to: invitedEmail.trim().toLowerCase(),
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return res.json({ message: `Invitation envoyée à ${prenom} ${nom}.` });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// GET /parrainage/filleuls — Get list of users referred by current user
// ============================================================================
export const getFilleuls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const filleuls = await prisma.utilisateur.findMany({
      where: { parrainId: userId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        typeUtilisateur: true,
        dateCreation: true,
        profilRenford: {
          select: {
            id: true,
            avatarChemin: true,
            titreProfil: true,
            noteMoyenne: true,
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    return res.json(filleuls);
  } catch (err) {
    return next(err);
  }
};
