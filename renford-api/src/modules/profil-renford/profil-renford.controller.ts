import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type {
  ProfilRenfordIdParamsSchema,
  UpdateAvatarSchema,
  UpdateCouvertureSchema,
  UpdateDiplomesProfilSchema,
  UpdateDisponibilitesProfilSchema,
  UpdateDescriptionProfilSchema,
  UpdateExperiencesProfilSchema,
  UpdateIdentiteProfilSchema,
  UpdatePortfolioProfilSchema,
  UpdateProfilRenfordSchema,
  UpdateQualificationsProfilSchema,
} from './profil-renford.schema';

export const getPublicProfilRenford = async (
  req: Request<ProfilRenfordIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    if (req.utilisateur?.typeUtilisateur !== 'etablissement') {
      return res.status(403).json({
        message: 'Seuls les établissements peuvent consulter ce profil Renford',
      });
    }

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { id: req.params.profilRenfordId },
      include: {
        utilisateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },
        renfordDiplomes: {
          orderBy: [{ anneeObtention: 'desc' }, { dateCreation: 'desc' }],
        },
        experiencesProfessionnelles: {
          orderBy: [{ dateDebut: 'desc' }, { dateCreation: 'desc' }],
        },
      },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateCouverture = async (
  req: Request<unknown, unknown, UpdateCouvertureSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { imageCouvertureChemin } = req.body;

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: { imageCouvertureChemin },
      create: {
        utilisateurId: userId,
        imageCouvertureChemin,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateAvatar = async (
  req: Request<unknown, unknown, UpdateAvatarSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { avatarChemin } = req.body;

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: { avatarChemin },
      create: {
        utilisateurId: userId,
        avatarChemin,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateProfilRenford = async (
  req: Request<unknown, unknown, UpdateProfilRenfordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { titreProfil, descriptionProfil, typeMission, assuranceRCPro } = req.body;

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
        titreProfil,
        descriptionProfil,
        typeMission,
        assuranceRCPro,
      },
      create: {
        utilisateurId: userId,
        titreProfil,
        descriptionProfil,
        typeMission,
        assuranceRCPro,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateDescriptionProfil = async (
  req: Request<unknown, unknown, UpdateDescriptionProfilSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { descriptionProfil } = req.body;

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
        descriptionProfil,
      },
      create: {
        utilisateurId: userId,
        descriptionProfil,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateDisponibilitesProfil = async (
  req: Request<unknown, unknown, UpdateDisponibilitesProfilSchema>,
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

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
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
      create: {
        utilisateurId: userId,
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

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateExperiencesProfil = async (
  req: Request<unknown, unknown, UpdateExperiencesProfilSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { experiencesProfessionnelles } = req.body;

    const profil = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {},
      create: { utilisateurId: userId },
      select: { id: true },
    });

    await prisma.$transaction([
      prisma.experienceProfessionnelleRenford.deleteMany({
        where: { profilRenfordId: profil.id },
      }),
      ...(experiencesProfessionnelles.length
        ? [
            prisma.experienceProfessionnelleRenford.createMany({
              data: experiencesProfessionnelles.map((experience) => ({
                profilRenfordId: profil.id,
                nom: experience.nom,
                etablissement: experience.etablissement,
                missions: experience.missions,
                dateDebut: new Date(experience.dateDebut),
                dateFin: experience.dateFin ? new Date(experience.dateFin) : null,
              })),
            }),
          ]
        : []),
    ]);

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { id: profil.id },
      include: { experiencesProfessionnelles: true },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updatePortfolioProfil = async (
  req: Request<unknown, unknown, UpdatePortfolioProfilSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { portfolio } = req.body;

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
        portfolio,
      },
      create: {
        utilisateurId: userId,
        portfolio,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateQualificationsProfil = async (
  req: Request<unknown, unknown, UpdateQualificationsProfilSchema>,
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
      justificatifCarteProfessionnelleChemin,
      tarifHoraire,
      proposeJournee,
      tarifJournee,
      proposeDemiJournee,
      tarifDemiJournee,
    } = req.body;

    const profilRenford = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {
        niveauExperience,
        justificatifCarteProfessionnelleChemin: justificatifCarteProfessionnelleChemin ?? null,
        tarifHoraire,
        proposeJournee,
        tarifJournee: proposeJournee ? tarifJournee : null,
        proposeDemiJournee,
        tarifDemiJournee: proposeDemiJournee ? tarifDemiJournee : null,
      },
      create: {
        utilisateurId: userId,
        niveauExperience,
        justificatifCarteProfessionnelleChemin: justificatifCarteProfessionnelleChemin ?? null,
        tarifHoraire,
        proposeJournee,
        tarifJournee: proposeJournee ? tarifJournee : null,
        proposeDemiJournee,
        tarifDemiJournee: proposeDemiJournee ? tarifDemiJournee : null,
      },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateDiplomesProfil = async (
  req: Request<unknown, unknown, UpdateDiplomesProfilSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { renfordDiplomes } = req.body;

    const profil = await prisma.profilRenford.upsert({
      where: { utilisateurId: userId },
      update: {},
      create: { utilisateurId: userId },
      select: { id: true },
    });

    await prisma.$transaction([
      prisma.renfordDiplome.deleteMany({
        where: { profilRenfordId: profil.id },
      }),
      ...(renfordDiplomes.length
        ? [
            prisma.renfordDiplome.createMany({
              data: renfordDiplomes.map((diplome) => ({
                profilRenfordId: profil.id,
                typeDiplome: diplome.typeDiplome,
                anneeObtention: diplome.anneeObtention,
                mention: diplome.mention,
                etablissementFormation: diplome.etablissementFormation,
                justificatifDiplomeChemin: diplome.justificatifDiplomeChemin,
              })),
            }),
          ]
        : []),
    ]);

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { id: profil.id },
      include: { renfordDiplomes: true },
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};

export const updateIdentiteProfil = async (
  req: Request<unknown, unknown, UpdateIdentiteProfilSchema>,
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
      telephone,
      adresse,
      codePostal,
      ville,
      latitude,
      longitude,
      pays,
      dateNaissance,
      attestationVigilanceChemin,
    } = req.body;

    const profilRenford = await prisma.$transaction(async (tx) => {
      if (telephone !== undefined) {
        await tx.utilisateur.update({
          where: { id: userId },
          data: { telephone },
        });
      }

      return tx.profilRenford.upsert({
        where: { utilisateurId: userId },
        update: {
          siret: siretEnCoursObtention ? null : (siret ?? null),
          siretEnCoursObtention,
          attestationAutoEntrepreneur,
          adresse,
          codePostal,
          ville,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          pays,
          dateNaissance: new Date(dateNaissance),
          attestationVigilanceChemin: attestationVigilanceChemin ?? null,
        },
        create: {
          utilisateurId: userId,
          siret: siretEnCoursObtention ? null : (siret ?? null),
          siretEnCoursObtention,
          attestationAutoEntrepreneur,
          adresse,
          codePostal,
          ville,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          pays,
          dateNaissance: new Date(dateNaissance),
          attestationVigilanceChemin: attestationVigilanceChemin ?? null,
        },
      });
    });

    return res.json(profilRenford);
  } catch (err) {
    return next(err);
  }
};
