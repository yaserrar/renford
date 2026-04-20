import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import {
  ChangePasswordSchema,
  UpdateNotificationSettingsSchema,
  UpdateProfileSchema,
} from './utilisateur.schema';

// GET /user/me - Obtenir l'utilisateur connecté
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        typeUtilisateur: true,
        statut: true,
        etapeOnboarding: true,
        emailVerifie: true,
        notificationsEmail: true,
        typeNotificationsEmail: true,
        notificationsMobile: true,
        typeNotificationsMobile: true,
        dateCreation: true,
        derniereConnexion: true,
        // Relations selon le type d'utilisateur
        profilEtablissement: {
          include: {
            etablissements: true,
          },
        },
        profilRenford: {
          include: {
            renfordDiplomes: true,
            experiencesProfessionnelles: true,
          },
        },
      },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// PUT /user/profile - Mettre à jour le profil
export const updateProfile = async (
  req: Request<unknown, unknown, UpdateProfileSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const {
      nom,
      prenom,
      telephone,
      notificationsEmail,
      typeNotificationsEmail,
      notificationsMobile,
      typeNotificationsMobile,
    } = req.body;

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        ...(nom && { nom }),
        ...(prenom && { prenom }),
        ...(telephone !== undefined && { telephone }),
        ...(notificationsEmail !== undefined && { notificationsEmail }),
        ...(typeNotificationsEmail !== undefined && { typeNotificationsEmail }),
        ...(notificationsMobile !== undefined && { notificationsMobile }),
        ...(typeNotificationsMobile !== undefined && { typeNotificationsMobile }),
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        notificationsEmail: true,
        typeNotificationsEmail: true,
        notificationsMobile: true,
        typeNotificationsMobile: true,
        typeUtilisateur: true,
      },
    });

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// PUT /user/password - Changer le mot de passe
export const changePassword = async (
  req: Request<unknown, unknown, ChangePasswordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!utilisateur.motDePasse) {
      return res.status(400).json({
        message: 'Impossible de changer le mot de passe pour ce type de compte',
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, utilisateur.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Le mot de passe actuel est incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.utilisateur.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword },
    });

    return res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    return next(err);
  }
};

export const updateNotificationSettings = async (
  req: Request<unknown, unknown, UpdateNotificationSettingsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const {
      notificationsEmail,
      typeNotificationsEmail,
      notificationsMobile,
      typeNotificationsMobile,
    } = req.body;

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        notificationsEmail,
        typeNotificationsEmail,
        notificationsMobile,
        typeNotificationsMobile,
      },
      select: {
        id: true,
        notificationsEmail: true,
        typeNotificationsEmail: true,
        notificationsMobile: true,
        typeNotificationsMobile: true,
      },
    });

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// DELETE /user/account - Suppression du compte (RGPD – droit à l'effacement)
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
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

    if (utilisateur.statut === 'supprime') {
      return res.status(400).json({ message: 'Ce compte est déjà supprimé' });
    }

    const anonymised = 'Compte supprimé';

    await prisma.$transaction(async (tx) => {
      // Anonymise utilisateur fields
      await tx.utilisateur.update({
        where: { id: userId },
        data: {
          email: `supprime_${userId}@deleted.renford.fr`,
          nom: anonymised,
          prenom: anonymised,
          telephone: null,
          motDePasse: null,
          statut: 'supprime',
          emailVerifie: false,
          notificationsEmail: false,
          notificationsMobile: false,
          codeVerificationEmail: null,
          codeReinitialisationMdp: null,
        },
      });

      // Anonymise profil renford if exists
      await tx.profilRenford.updateMany({
        where: { utilisateurId: userId },
        data: {
          adresse: null,
          ville: null,
          codePostal: null,
          dateNaissance: null,
          siret: null,
          avatarChemin: null,
          imageCouvertureChemin: null,
          titreProfil: null,
          descriptionProfil: null,
          justificatifCarteProfessionnelleChemin: null,
          attestationVigilanceChemin: null,
        },
      });

      // Anonymise profil etablissement if exists
      await tx.profilEtablissement.updateMany({
        where: { utilisateurId: userId },
        data: {
          raisonSociale: anonymised,
          siret: anonymised,
          adresse: anonymised,
          codePostal: '00000',
          ville: anonymised,
          aPropos: null,
          avatarChemin: null,
          imageCouvertureChemin: null,
        },
      });

      // Delete firebase auth link
      await tx.firebaseAuthInfo.deleteMany({
        where: { utilisateurId: userId },
      });
    });

    return res.json({ message: 'Votre compte a été supprimé avec succès' });
  } catch (err) {
    return next(err);
  }
};
