import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import type { VerifyEmailSchema } from './account-verification.schema';
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
    const mailOptions = {
      from: env.EMAIL_HOST_USER,
      to: utilisateur.email,
      subject: 'RENFORD: Nouveau code de vérification',
      html: `
        <div style="margin:0;padding:24px;background:#f5f6f8;font-family:Arial,sans-serif;color:#1f2937;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e7eb;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
              <div style="width:36px;height:36px;border-radius:10px;background:#3b82f6;"></div>
              <h2 style="margin:0;font-size:24px;line-height:1.2;color:#111827;">Renford</h2>
            </div>
            <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;">Bonjour,</p>
            <p style="margin:0 0 18px 0;font-size:16px;line-height:1.6;">
              Voici votre nouveau code de vérification :
            </p>
            <div style="margin:0 0 20px 0;padding:14px 16px;border-radius:12px;background:#f8fafc;border:1px dashed #cbd5e1;text-align:center;">
              <span style="font-size:30px;letter-spacing:6px;font-weight:700;color:#111827;">${code}</span>
            </div>
            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#4b5563;">
              Ce code expire dans 15 minutes.
            </p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">
              Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous pouvez ignorer cet email.
            </p>
          </div>
        </div>
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
