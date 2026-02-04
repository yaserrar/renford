import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
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
      typeEtablissement,
      adresseSiege,
      codePostalSiege,
      villeSiege,
    } = req.body;

    // Mettre à jour le profil établissement
    const profilEtablissement = await prisma.profilEtablissement.upsert({
      where: { utilisateurId: userId },
      update: {
        raisonSociale,
        siret,
        adresse,
        codePostal,
        ville,
        typeEtablissement,
        adresseSiege,
        codePostalSiege,
        villeSiege,
      },
      create: {
        utilisateurId: userId,
        raisonSociale,
        siret,
        adresse,
        codePostal,
        ville,
        typeEtablissement,
        adresseSiege,
        codePostalSiege,
        villeSiege,
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

    // Créer les invitations pour les favoris (stockage temporaire ou envoi d'email)
    // Pour l'instant, on stocke les invitations dans un log ou on envoie des emails
    // Cette logique peut être étendue selon les besoins

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
      attestationAutoEntrepreneur,
      adresse,
      codePostal,
      ville,
      pays,
      dateNaissance,
      attestationVigilanceChemin,
    } = req.body;

    // Mettre à jour le profil Renford
    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
        siret,
        attestationAutoEntrepreneur,
        adresse,
        codePostal,
        ville,
        pays,
        dateNaissance: new Date(dateNaissance),
        attestationVigilanceChemin,
      },
      create: {
        utilisateurId: userId,
        siret,
        attestationAutoEntrepreneur,
        adresse,
        codePostal,
        ville,
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

    const { photoProfil, titreProfil, descriptionProfil, typeMission, assuranceRCPro } = req.body;

    // Mettre à jour le profil Renford
    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        photoProfil,
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
      justificatifDiplomeChemin,
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
        diplomes,
        justificatifDiplomeChemin,
        justificatifCarteProfessionnelleChemin,
        tarifHoraire,
        proposeJournee,
        tarifJournee: proposeJournee ? tarifJournee : null,
        proposeDemiJournee,
        tarifDemiJournee: proposeDemiJournee ? tarifDemiJournee : null,
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

    const { iban, carteIdentiteChemin } = req.body;

    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        iban,
        carteIdentiteChemin,
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

    const { joursDisponibles, creneaux, dureeIllimitee, dateDebut, dateFin, zoneDeplacement } =
      req.body;

    const profilRenford = await prisma.profilRenford.update({
      where: { utilisateurId: userId },
      data: {
        joursDisponibles: joursDisponibles as any,
        creneaux: creneaux as any,
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

    return res.json({
      message: 'Onboarding terminé avec succès',
      utilisateur,
    });
  } catch (err) {
    return next(err);
  }
};
