import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import { mail } from '../../config/mail';
import { env } from '../../config/env';
import {
  getFavoriInvitationEmail,
  getWelcomeEtablissementEmail,
  getWelcomeRenfordEmail,
} from '../../config/email-templates';
import { logger } from '../../config/logger';
import type {
  UpdateContactSchema,
  UpdateTypeSchema,
  UpdateEtablissementSchema,
  UpdateFavorisSchema,
  SkipStepSchema,
  UpdateRenfordIdentiteSchema,
  UpdateRenfordProfilSchema,
  UpdateRenfordQualificationsSchema,
  UpdateRenfordBancaireSchema,
  UpdateRenfordDisponibilitesSchema,
} from './onboarding.schema';

// GET /onboarding/status - Obtenir le statut de l'onboarding
export const getOnboardingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        etapeOnboarding: true,
        typeUtilisateur: true,
        statut: true,
        nom: true,
        prenom: true,
        telephone: true,
        profilEtablissement: {
          select: {
            raisonSociale: true,
            siret: true,
            adresse: true,
            codePostal: true,
            ville: true,
            typeEtablissement: true,
          },
        },
        profilRenford: {
          select: {
            titreProfil: true,
            descriptionProfil: true,
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

// PUT /onboarding/contact - Étape 1: Informations de contact
export const updateContact = async (
  req: Request<unknown, unknown, UpdateContactSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { prenom, nom, telephone } = req.body;

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        prenom,
        nom,
        telephone,
        etapeOnboarding: 1,
        statut: 'onboarding',
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        telephone: true,
        etapeOnboarding: true,
      },
    });

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/type - Étape 2: Type d'utilisateur
export const updateType = async (
  req: Request<unknown, unknown, UpdateTypeSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { typeUtilisateur } = req.body;

    // Mettre à jour le type d'utilisateur
    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        typeUtilisateur,
        etapeOnboarding: 2,
      },
      select: {
        id: true,
        typeUtilisateur: true,
        etapeOnboarding: true,
      },
    });

    // Créer le profil correspondant s'il n'existe pas
    if (typeUtilisateur === 'etablissement') {
      const existingProfil = await prisma.profilEtablissement.findUnique({
        where: { utilisateurId: userId },
      });

      if (!existingProfil) {
        await prisma.profilEtablissement.create({
          data: {
            utilisateurId: userId,
            raisonSociale: '',
            siret: '',
            adresse: '',
            codePostal: '',
            ville: '',
          },
        });
      }
    } else if (typeUtilisateur === 'renford') {
      const existingProfil = await prisma.profilRenford.findUnique({
        where: { utilisateurId: userId },
      });

      if (!existingProfil) {
        await prisma.profilRenford.create({
          data: {
            utilisateurId: userId,
          },
        });
      }
    }

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/etablissement - Étape 3: Profil établissement
export const updateEtablissement = async (
  req: Request<unknown, unknown, UpdateEtablissementSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const {
      raisonSociale,
      siret,
      adresse,
      codePostal,
      ville,
      latitude,
      longitude,
      typeEtablissement,
      adresseSiegeDifferente,
      adresseSiege,
      codePostalSiege,
      villeSiege,
    } = req.body;

    // Si l'adresse du siège n'est pas différente, on nettoie les champs siège
    const siegeData = adresseSiegeDifferente
      ? { adresseSiege, codePostalSiege, villeSiege }
      : { adresseSiege: null, codePostalSiege: null, villeSiege: null };

    // Mettre à jour le profil établissement
    const profilEtablissement = await prisma.profilEtablissement.upsert({
      where: { utilisateurId: userId },
      update: {
        raisonSociale,
        siret,
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        typeEtablissement,
        adresseSiegeDifferente,
        ...siegeData,
      },
      create: {
        utilisateurId: userId,
        raisonSociale,
        siret,
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        typeEtablissement,
        adresseSiegeDifferente,
        ...siegeData,
      },
    });

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 3,
      },
    });

    return res.json(profilEtablissement);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/favoris - Étape 4: Favoris Renfords (établissement uniquement)
export const updateFavoris = async (
  req: Request<unknown, unknown, UpdateFavorisSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { favoris } = req.body;

    // Récupérer le profil établissement
    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      include: { etablissements: true },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const etablissementId = profilEtablissement.etablissements[0]?.id ?? profilEtablissement.id;
    const invitationLink = `${env.PLATFORM_URL}/inscription?referred_by=${encodeURIComponent(etablissementId)}`;

    const sendResults = await Promise.allSettled(
      favoris.map((favori) => {
        const destinataire = favori.email;
        const nomFavori = favori.nomComplet?.trim();
        const invitationEmail = getFavoriInvitationEmail({
          nomFavori,
          invitationUrl: invitationLink,
        });

        return mail.sendMail({
          to: destinataire,
          subject: invitationEmail.subject,
          html: invitationEmail.html,
          text: invitationEmail.text,
        });
      }),
    );

    const sentCount = sendResults.filter((result) => result.status === 'fulfilled').length;
    const failedCount = sendResults.length - sentCount;

    if (failedCount > 0) {
      logger.warn(
        {
          userId,
          failedCount,
        },
        "Certaines invitations favoris n'ont pas pu être envoyées",
      );
    }

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 4,
      },
    });

    return res.json({
      message: 'Favoris enregistrés avec succès',
      count: favoris.length,
      invitationsEnvoyees: sentCount,
      invitationsEchouees: failedCount,
    });
  } catch (err) {
    return next(err);
  }
};

// POST /onboarding/skip - Passer une étape
export const skipStep = async (
  req: Request<unknown, unknown, SkipStepSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { etape } = req.body;

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: etape,
      },
      select: {
        id: true,
        etapeOnboarding: true,
      },
    });

    return res.json(utilisateur);
  } catch (err) {
    return next(err);
  }
};

// POST /onboarding/complete - Terminer l'onboarding
export const completeOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      include: {
        etablissements: {
          where: { roleEtablissement: 'principal' },
          orderBy: { dateCreation: 'asc' },
          take: 1,
        },
      },
    });

    if (!profilEtablissement) {
      return res.status(400).json({
        message: "Profil établissement incomplet. Veuillez compléter l'étape établissement.",
      });
    }

    const utilisateurContact = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        email: true,
        telephone: true,
        nom: true,
        prenom: true,
      },
    });

    if (!utilisateurContact) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (!profilEtablissement.etablissements[0]) {
      if (!profilEtablissement.typeEtablissement) {
        return res.status(400).json({
          message:
            "Informations établissement insuffisantes pour créer l'établissement par défaut.",
        });
      }

      await prisma.etablissement.create({
        data: {
          profilEtablissementId: profilEtablissement.id,
          siret: profilEtablissement.siret,
          nom: profilEtablissement.raisonSociale,
          typeEtablissement: profilEtablissement.typeEtablissement,
          roleEtablissement: 'principal',
          adresse: profilEtablissement.adresse,
          codePostal: profilEtablissement.codePostal,
          ville: profilEtablissement.ville,
          latitude: profilEtablissement.latitude,
          longitude: profilEtablissement.longitude,
          emailPrincipal: utilisateurContact.email,
          telephonePrincipal: utilisateurContact.telephone,
          nomContactPrincipal: utilisateurContact.nom,
          prenomContactPrincipal: utilisateurContact.prenom,
          adresseFacturationDifferente: false,
          adresseFacturation: profilEtablissement.adresse,
          codePostalFacturation: profilEtablissement.codePostal,
          villeFacturation: profilEtablissement.ville,
        },
      });
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 5,
        statut: 'actif',
      },
      select: {
        id: true,
        etapeOnboarding: true,
        statut: true,
      },
    });

    const utilisateurInfos = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        email: true,
        prenom: true,
        nom: true,
        profilEtablissement: {
          select: {
            raisonSociale: true,
          },
        },
      },
    });

    if (utilisateurInfos?.email) {
      const prenomNom = `${utilisateurInfos.prenom ?? ''} ${utilisateurInfos.nom ?? ''}`.trim();
      const raisonSociale =
        utilisateurInfos.profilEtablissement?.raisonSociale ?? 'votre établissement';
      const welcomeEmail = getWelcomeEtablissementEmail({
        prenomNom,
        raisonSociale,
        dashboardUrl: `${env.PLATFORM_URL}/dashboard/etablissement/accueil`,
      });

      try {
        await mail.sendMail({
          to: utilisateurInfos.email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
          text: welcomeEmail.text,
        });
      } catch (emailError) {
        logger.error({ err: emailError, userId }, "Échec d'envoi de l'email de bienvenue");
      }
    }

    return res.json({
      message: 'Onboarding terminé avec succès',
      utilisateur,
    });
  } catch (err) {
    return next(err);
  }
};

// ============================================================================
// Contrôleurs spécifiques aux Renfords
// ============================================================================

// PUT /onboarding/renford/identite - Étape 3: Identité légale Renford
export const updateRenfordIdentite = async (
  req: Request<unknown, unknown, UpdateRenfordIdentiteSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const {
      siret,
      siretEnCoursObtention,
      attestationAutoEntrepreneur,
      adresse,
      codePostal,
      ville,
      latitude,
      longitude,
      pays,
      dateNaissance,
      attestationVigilanceChemin,
    } = req.body;

    const siretValue = siretEnCoursObtention ? null : siret;

    // Mettre à jour le profil Renford
    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
        siret: siretValue,
        siretEnCoursObtention,
        attestationAutoEntrepreneur,
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        pays,
        dateNaissance: new Date(dateNaissance),
        attestationVigilanceChemin,
      },
      create: {
        utilisateurId: userId,
        siret: siretValue,
        siretEnCoursObtention,
        attestationAutoEntrepreneur,
        adresse,
        codePostal,
        ville,
        latitude,
        longitude,
        pays,
        dateNaissance: new Date(dateNaissance),
        attestationVigilanceChemin,
      },
    });

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 3,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/renford/profil - Étape 4: Profil Renford
export const updateRenfordProfil = async (
  req: Request<unknown, unknown, UpdateRenfordProfilSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { avatarChemin, titreProfil, descriptionProfil, typeMission, assuranceRCPro } = req.body;

    // Mettre à jour le profil Renford
    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        avatarChemin,
        titreProfil,
        descriptionProfil,
        typeMission,
        assuranceRCPro,
      },
    });

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 4,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/renford/qualifications - Étape 5: Qualifications Renford
export const updateRenfordQualifications = async (
  req: Request<unknown, unknown, UpdateRenfordQualificationsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const {
      niveauExperience,
      diplomes,
      justificatifDiplomeChemins,
      justificatifCarteProfessionnelleChemin,
      tarifHoraire,
      proposeJournee,
      tarifJournee,
      proposeDemiJournee,
      tarifDemiJournee,
    } = req.body;

    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        niveauExperience,
        justificatifCarteProfessionnelleChemin,
        tarifHoraire,
        proposeJournee,
        tarifJournee: proposeJournee ? tarifJournee : null,
        proposeDemiJournee,
        tarifDemiJournee: proposeDemiJournee ? tarifDemiJournee : null,
        renfordDiplomes: {
          deleteMany: {},
          create: diplomes.map((typeDiplome, index) => ({
            typeDiplome,
            justificatifDiplomeChemin: justificatifDiplomeChemins[index] ?? null,
            mention: null,
            anneeObtention: null,
            etablissementFormation: null,
          })),
        },
      },
      include: {
        renfordDiplomes: true,
      },
    });

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 5,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/renford/bancaire - Étape 6: Infos bancaires Renford
export const updateRenfordBancaire = async (
  req: Request<unknown, unknown, UpdateRenfordBancaireSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { iban } = req.body;

    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        iban,
      },
    });

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 6,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

// PUT /onboarding/renford/disponibilites - Étape 7: Disponibilités Renford
export const updateRenfordDisponibilites = async (
  req: Request<unknown, unknown, UpdateRenfordDisponibilitesSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const {
      disponibilitesLundi,
      disponibilitesMardi,
      disponibilitesMercredi,
      disponibilitesJeudi,
      disponibilitesVendredi,
      disponibilitesSamedi,
      disponibilitesDimanche,
      dureeIllimitee,
      dateDebut,
      dateFin,
      zoneDeplacement,
    } = req.body;

    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        disponibilitesLundi,
        disponibilitesMardi,
        disponibilitesMercredi,
        disponibilitesJeudi,
        disponibilitesVendredi,
        disponibilitesSamedi,
        disponibilitesDimanche,
        dureeIllimitee,
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        dateFin: dateFin ? new Date(dateFin) : null,
        zoneDeplacement,
      },
    });

    // Mettre à jour l'étape d'onboarding
    await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 7,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

// POST /onboarding/renford/complete - Terminer l'onboarding Renford (étape 8)
export const completeRenfordOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 8,
        statut: 'actif',
      },
      select: {
        id: true,
        etapeOnboarding: true,
        statut: true,
      },
    });

    const utilisateurInfos = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        email: true,
        prenom: true,
      },
    });

    if (utilisateurInfos?.email) {
      const prenom = utilisateurInfos.prenom?.trim() || '';
      const welcomeEmail = getWelcomeRenfordEmail({
        prenom,
        dashboardUrl: `${env.PLATFORM_URL}/dashboard/renford/accueil`,
      });

      try {
        await mail.sendMail({
          to: utilisateurInfos.email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
          text: welcomeEmail.text,
        });
      } catch (emailError) {
        logger.error({ err: emailError, userId }, "Échec d'envoi de l'email de bienvenue Renford");
      }
    }

    return res.json({
      message: 'Onboarding terminé avec succès',
      utilisateur,
    });
  } catch (err) {
    return next(err);
  }
};
