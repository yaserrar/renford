import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import { VerifyEmailSchema } from './account-verification.schema';
import { env } from '../../config/env';
import { EMAIL_CODE_TTL } from '../../config/consts';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';

// ============================================================================
// POST /account-verification/verify-email - Vérifier l'email avec un code
// ============================================================================
export const verifyEmail = async (
  req: Request<unknown, unknown, VerifyEmailSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (utilisateur.emailVerifie) {
      return res.status(400).json({ message: 'Email déjà vérifié' });
    }

    // Vérifier le code
    if (utilisateur.codeVerificationEmail !== code) {
      return res.status(400).json({ message: 'Code de vérification invalide' });
    }

    // Vérifier l'expiration (15 minutes)
    const codeCreation = utilisateur.dateCreationCodeVerif;
    if (!codeCreation || Date.now() - codeCreation.getTime() > EMAIL_CODE_TTL) {
      return res.status(400).json({ message: 'Code de vérification expiré' });
    }

    // Valider l'email et passer en statut onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        emailVerifie: true,
        emailVerifieA: new Date(),
        codeVerificationEmail: null,
        dateCreationCodeVerif: null,
        statut: 'onboarding',
      },
    });

    return res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /account-verification/resend-code - Renvoyer le code de vérification
// ============================================================================
export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (utilisateur.emailVerifie) {
      return res.status(400).json({ message: 'Email déjà vérifié' });
    }

    // Générer nouveau code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        codeVerificationEmail: code,
        dateCreationCodeVerif: new Date(),
      },
    });

    // Envoyer l'email
    const mailOptions = {
      from: env.EMAIL_HOST_USER,
      to: utilisateur.email,
      subject: 'RENFORD: Nouveau code de vérification',
      html: `
        <h3>Nouveau code de vérification</h3>
        <p>Votre code de vérification est: <strong>${code}</strong></p>
        <p>Ce code expire dans 15 minutes.</p>
      `,
    };

    try {
      await mail.sendMail(mailOptions);
    } catch (e) {
      logger.error(e, 'Échec envoi email de vérification');
    }

    return res.json({ message: 'Code de vérification envoyé' });
  } catch (err) {
    return next(err);
  }
};
