import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import type { VerifyEmailSchema } from './account-verification.schema';
import { EMAIL_CODE_TTL } from '../../config/consts';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';
import { getNewVerificationCodeEmail } from '../../config/email-templates';

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
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
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
    const verificationCodeEmail = getNewVerificationCodeEmail(code);

    try {
      await mail.sendMail({
        to: utilisateur.email,
        subject: verificationCodeEmail.subject,
        html: verificationCodeEmail.html,
        text: verificationCodeEmail.text,
      });
    } catch (e) {
      logger.error(e, 'Échec envoi email de vérification');
    }

    return res.json({ message: 'Code de vérification envoyé' });
  } catch (err) {
    return next(err);
  }
};
