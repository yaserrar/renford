import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import {
  LoginSchema,
  VerifyEmailSchema,
  ResendVerificationSchema,
  PasswordResetSendCodeSchema,
  PasswordResetValidateCodeSchema,
  PasswordResetUpdatePasswordSchema,
  SignupEtablissementSchema,
  SignupRenfordSchema,
  SignupAdminSchema,
} from './auth.schema';
import { env } from '../../config/env';
import { JWT_EXPIRES_IN, EMAIL_CODE_TTL } from '../../config/consts';
import { mail } from '../../config/mail';
import { logger } from '../../config/logger';

// ============================================================================
// POST /auth/signup/etablissement - Inscription établissement
// ============================================================================
export const signupEtablissement = async (
  req: Request<unknown, unknown, SignupEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      nom,
      prenom,
      telephone,
      // Informations légales (obligatoires)
      raisonSociale,
      siret,
      // Adresse (obligatoire)
      adresse,
      codePostal,
      ville,
      // Type d'établissement (optionnel)
      typeEtablissement,
      // Adresse du siège (optionnel)
      adresseSiege,
      codePostalSiege,
      villeSiege,
      // Contact (optionnel)
      emailPrincipal,
      telephonePrincipal,
      nomContactPrincipal,
    } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un compte avec cet email existe déjà',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Générer le code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer l'utilisateur et le profil établissement
    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        motDePasse: hashedPassword,
        typeUtilisateur: 'etablissement',
        nom,
        prenom,
        telephone,
        statut: 'en_attente_verification',
        codeVerificationEmail: verificationCode,
        dateCreationCodeVerif: new Date(),
        profilEtablissement: {
          create: {
            // Informations légales (obligatoires)
            raisonSociale,
            siret,
            // Adresse (obligatoire)
            adresse,
            codePostal,
            ville,
            // Type d'établissement (optionnel)
            typeEtablissement,
            // Adresse du siège (optionnel)
            adresseSiege,
            codePostalSiege,
            villeSiege,
            // Contact (optionnel)
            emailPrincipal: emailPrincipal || email,
            telephonePrincipal: telephonePrincipal || telephone,
            nomContactPrincipal: nomContactPrincipal || `${prenom} ${nom}`,
          },
        },
      },
      include: {
        profilEtablissement: true,
      },
    });

    // Envoyer l'email de vérification
    const mailOptions = {
      from: env.EMAIL_HOST_USER,
      to: email,
      subject: 'RENFORD: Vérification de votre compte établissement',
      html: `
        <h3>Bienvenue sur RENFORD !</h3>
        <p>Votre code de vérification est: <strong>${verificationCode}</strong></p>
        <p>Ce code expire dans 15 minutes.</p>
      `,
    };

    try {
      await mail.sendMail(mailOptions);
    } catch (e) {
      logger.error(e, 'Échec envoi email de vérification établissement');
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: utilisateur.id, email: utilisateur.email }, env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      message: 'Compte établissement créé avec succès. Veuillez vérifier votre email.',
      token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        typeUtilisateur: utilisateur.typeUtilisateur,
        profilEtablissement: utilisateur.profilEtablissement,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /auth/signup/renford - Inscription Renford (Freelancer)
// ============================================================================
export const signupRenford = async (
  req: Request<unknown, unknown, SignupRenfordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      nom,
      prenom,
      telephone,
      // Profil public
      titreProfil,
      descriptionProfil,
      // Informations légales
      siret,
      siretEnCoursObtention,
      attestationStatut,
      // Informations personnelles
      dateNaissance,
      // Localisation
      adresse,
      codePostal,
      ville,
      pays,
      // Zone de déplacement
      zoneDeplacement,
      // Niveau d'expérience
      niveauExperience,
      // Tarification
      tarifHoraire,
      tarifJournee,
      tarifDemiJournee,
      // Informations bancaires
      iban,
      // Disponibilité
      joursDisponibles,
      disponibiliteIllimitee,
      dateDebutDispo,
      dateFinDispo,
    } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un compte avec cet email existe déjà',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Générer le code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer l'utilisateur et le profil renford
    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        motDePasse: hashedPassword,
        typeUtilisateur: 'renford',
        nom,
        prenom,
        telephone,
        statut: 'en_attente_verification',
        codeVerificationEmail: verificationCode,
        dateCreationCodeVerif: new Date(),
        profilRenford: {
          create: {
            // Profil public
            titreProfil,
            descriptionProfil,
            // Informations légales
            siret,
            siretEnCoursObtention,
            attestationStatut,
            // Informations personnelles
            dateNaissance,
            // Localisation
            adresse,
            codePostal,
            ville,
            pays,
            // Zone de déplacement
            zoneDeplacement,
            // Niveau d'expérience
            niveauExperience,
            // Tarification
            tarifHoraire,
            tarifJournee,
            tarifDemiJournee,
            // Informations bancaires
            iban,
            // Disponibilité
            joursDisponibles,
            disponibiliteIllimitee,
            dateDebutDispo,
            dateFinDispo,
          },
        },
      },
      include: {
        profilRenford: true,
      },
    });

    // Envoyer l'email de vérification
    const mailOptions = {
      from: env.EMAIL_HOST_USER,
      to: email,
      subject: 'RENFORD: Vérification de votre compte Renford',
      html: `
        <h3>Bienvenue sur RENFORD !</h3>
        <p>Votre code de vérification est: <strong>${verificationCode}</strong></p>
        <p>Ce code expire dans 15 minutes.</p>
      `,
    };

    try {
      await mail.sendMail(mailOptions);
    } catch (e) {
      logger.error(e, 'Échec envoi email de vérification renford');
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: utilisateur.id, email: utilisateur.email }, env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      message: 'Compte Renford créé avec succès. Veuillez vérifier votre email.',
      token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        typeUtilisateur: utilisateur.typeUtilisateur,
        profilRenford: utilisateur.profilRenford,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /auth/signup/admin - Inscription administrateur (réservé aux admins)
// ============================================================================
export const signupAdmin = async (
  req: Request<unknown, unknown, SignupAdminSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, nom, prenom, telephone } = req.body;

    // Vérifier que l'utilisateur connecté est un administrateur
    if (req.utilisateur?.typeUtilisateur !== 'administrateur') {
      return res.status(403).json({
        message: 'Seul un administrateur peut créer un autre administrateur',
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un compte avec cet email existe déjà',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur administrateur (pas besoin de vérification email)
    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        motDePasse: hashedPassword,
        typeUtilisateur: 'administrateur',
        nom,
        prenom,
        telephone,
        statut: 'actif',
        emailVerifie: true,
        emailVerifieA: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Compte administrateur créé avec succès.',
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        typeUtilisateur: utilisateur.typeUtilisateur,
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
// POST /auth/verify-email - Vérification email
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

    // Valider l'email et activer le compte
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        emailVerifie: true,
        emailVerifieA: new Date(),
        codeVerificationEmail: null,
        dateCreationCodeVerif: null,
        statut: 'actif',
      },
    });

    return res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// POST /auth/resend-verification - Renvoyer le code de vérification
// ============================================================================
export const resendVerification = async (
  req: Request<unknown, unknown, ResendVerificationSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      // Ne pas révéler si l'email existe
      return res.json({ message: 'Si cet email existe, un code a été envoyé' });
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

    return res.json({ message: 'Si cet email existe, un code a été envoyé' });
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
        <h3>Réinitialisation de mot de passe</h3>
        <p>Votre code de réinitialisation est: <strong>${code}</strong></p>
        <p>Ce code expire dans 15 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
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
