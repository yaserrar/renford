import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import {
  LoginSchema,
  SignupSchema,
  PasswordResetSendCodeSchema,
  PasswordResetValidateCodeSchema,
  PasswordResetUpdatePasswordSchema,
} from './auth.schema';
import { env } from '../../config/env';
import { JWT_EXPIRES_IN, EMAIL_CODE_TTL } from '../../config/consts';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';

// ============================================================================
// POST /auth/signup - Inscription simple (sans type utilisateur)
// ============================================================================
export const signup = async (
  req: Request<unknown, unknown, SignupSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Cette adresse email est déjà utilisée',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Générer le code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer l'utilisateur (sans type pour l'instant)
    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        motDePasse: hashedPassword,
        typeUtilisateur: 'renford', // Valeur temporaire (sera modifiée dans l'onboarding)
        nom: '',
        prenom: '',
        statut: 'en_attente_verification',
        codeVerificationEmail: verificationCode,
        dateCreationCodeVerif: new Date(),
      },
    });

    // Envoyer l'email de vérification
    const mailOptions = {
      from: env.EMAIL_HOST_USER,
      to: email,
      subject: 'RENFORD: Vérification de votre compte',
      html: `
        <div style="margin:0;padding:24px;background:#f5f6f8;font-family:Arial,sans-serif;color:#1f2937;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e7eb;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
              <div style="width:36px;height:36px;border-radius:10px;background:#3b82f6;"></div>
              <h2 style="margin:0;font-size:24px;line-height:1.2;color:#111827;">Renford</h2>
            </div>
            <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;">Bonjour,</p>
            <p style="margin:0 0 18px 0;font-size:16px;line-height:1.6;">
              Bienvenue sur Renford. Utilisez ce code pour vérifier votre adresse email :
            </p>
            <div style="margin:0 0 20px 0;padding:14px 16px;border-radius:12px;background:#f8fafc;border:1px dashed #cbd5e1;text-align:center;">
              <span style="font-size:30px;letter-spacing:6px;font-weight:700;color:#111827;">${verificationCode}</span>
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
      console.error('Erreur envoi email:', e);
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: utilisateur.id, email: utilisateur.email }, env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      message: 'Compte créé avec succès. Veuillez vérifier votre email.',
      token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        statut: utilisateur.statut,
        emailVerifie: utilisateur.emailVerifie,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /auth/login - Connexion (tous types d'utilisateurs)
// ============================================================================
export const login = async (
  req: Request<unknown, unknown, LoginSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur avec ses profils
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      include: {
        profilEtablissement: true,
        profilRenford: true,
      },
    });

    if (!utilisateur) {
      return res.status(401).json({
        message: 'Email ou mot de passe invalide',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, utilisateur.motDePasse || '');

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email ou mot de passe invalide',
      });
    }

    // Vérifier le statut du compte
    if (utilisateur.statut === 'suspendu') {
      return res.status(403).json({
        message: 'Votre compte est suspendu. Veuillez contacter le support.',
      });
    }

    // Mettre à jour la dernière connexion
    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { derniereConnexion: new Date() },
    });

    // Générer le token JWT
    const token = jwt.sign({ userId: utilisateur.id, email: utilisateur.email }, env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Préparer la réponse selon le type d'utilisateur
    const response: Record<string, unknown> = {
      token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        typeUtilisateur: utilisateur.typeUtilisateur,
        statut: utilisateur.statut,
        emailVerifie: utilisateur.emailVerifie,
      },
    };

    if (utilisateur.typeUtilisateur === 'etablissement' && utilisateur.profilEtablissement) {
      response.profilEtablissement = utilisateur.profilEtablissement;
    }

    if (utilisateur.typeUtilisateur === 'renford' && utilisateur.profilRenford) {
      response.profilRenford = utilisateur.profilRenford;
    }

    return res.json(response);
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /password-reset/send-code - Envoyer code de réinitialisation
// ============================================================================
export const sendPasswordResetCode = async (
  req: Request<unknown, unknown, PasswordResetSendCodeSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    // Ne pas révéler si l'email existe
    if (!utilisateur) {
      return res.json({ message: 'Si cet email existe, un code a été envoyé' });
    }

    // Générer code de réinitialisation
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        codeReinitialisationMdp: code,
        dateCreationCodeReinit: new Date(),
      },
    });

    // Envoyer l'email
    const mailOptions = {
      from: env.EMAIL_HOST_USER,
      to: utilisateur.email,
      subject: 'RENFORD: Réinitialisation de mot de passe',
      html: `
        <div style="margin:0;padding:24px;background:#f5f6f8;font-family:Arial,sans-serif;color:#1f2937;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e7eb;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
              <div style="width:36px;height:36px;border-radius:10px;background:#3b82f6;"></div>
              <h2 style="margin:0;font-size:24px;line-height:1.2;color:#111827;">Renford</h2>
            </div>
            <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;">Réinitialisation de mot de passe</p>
            <p style="margin:0 0 18px 0;font-size:16px;line-height:1.6;">
              Utilisez ce code pour définir un nouveau mot de passe :
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
      logger.error(e, 'Échec envoi email réinitialisation');
    }

    return res.json({ message: 'Si cet email existe, un code a été envoyé' });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /password-reset/validate-code - Valider le code de réinitialisation
// ============================================================================
export const validatePasswordResetCode = async (
  req: Request<unknown, unknown, PasswordResetValidateCodeSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, code } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    if (utilisateur.codeReinitialisationMdp !== code) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    // Vérifier l'expiration (15 minutes)
    const codeCreation = utilisateur.dateCreationCodeReinit;
    if (!codeCreation || Date.now() - codeCreation.getTime() > EMAIL_CODE_TTL) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    return res.json({ valid: true });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /password-reset/update-password - Mettre à jour le mot de passe
// ============================================================================
export const updatePasswordWithCode = async (
  req: Request<unknown, unknown, PasswordResetUpdatePasswordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, code, password } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    if (utilisateur.codeReinitialisationMdp !== code) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    // Vérifier l'expiration (15 minutes)
    const codeCreation = utilisateur.dateCreationCodeReinit;
    if (!codeCreation || Date.now() - codeCreation.getTime() > EMAIL_CODE_TTL) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    // Hasher et mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        motDePasse: hashedPassword,
        codeReinitialisationMdp: null,
        dateCreationCodeReinit: null,
      },
    });

    return res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    return next(err);
  }
};
