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
import {
  getResetPasswordCodeEmail,
  getSignupVerificationCodeEmail,
} from '../../config/email-templates';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// ============================================================================
// POST /auth/signup - Inscription simple (sans type utilisateur)
// ============================================================================
export const signup = async (
  req: Request<unknown, unknown, SignupSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, parrainId } = req.body;
    const email = normalizeEmail(req.body.email);

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
        parrainId: parrainId || null,
      },
    });

    // Envoyer l'email de vérification
    const verificationEmail = getSignupVerificationCodeEmail(verificationCode);

    try {
      await mail.sendMail({
        to: email,
        subject: verificationEmail.subject,
        html: verificationEmail.html,
        text: verificationEmail.text,
      });
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
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

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
    const email = normalizeEmail(req.body.email);

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
    const resetEmail = getResetPasswordCodeEmail(code);

    try {
      await mail.sendMail({
        to: utilisateur.email,
        subject: resetEmail.subject,
        html: resetEmail.html,
        text: resetEmail.text,
      });
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
    const { code } = req.body;
    const email = normalizeEmail(req.body.email);

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
    const { code, password } = req.body;
    const email = normalizeEmail(req.body.email);

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
