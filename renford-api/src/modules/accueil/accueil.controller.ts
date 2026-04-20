import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';

const getMissionTotalHours = (slots: Array<{ heureDebut: string; heureFin: string }>) => {
  return slots.reduce((acc, slot) => {
    const [sh, sm] = slot.heureDebut.split(':').map(Number);
    const [eh, em] = slot.heureFin.split(':').map(Number);
    if ([sh, sm, eh, em].some((v) => v === undefined || Number.isNaN(v))) return acc;
    const start = sh! * 60 + sm!;
    const end = eh! * 60 + em!;
    return end > start ? acc + (end - start) / 60 : acc;
  }, 0);
};

export const getEtablissementAccueil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, etablissements: { select: { id: true } } },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    const etablissementIds = profilEtablissement.etablissements.map((e) => e.id);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const missionFilter = { etablissementId: { in: etablissementIds } };

    // Mission counts + payment counts
    const [
      missionsEnCours,
      missionsEnAttente,
      missionsRealisees,
      paiementsARegler,
      paiementsEnAttente,
      paiementsReglesCeMois,
    ] = await Promise.all([
      prisma.mission.count({
        where: { ...missionFilter, statut: { in: ['mission_en_cours', 'remplacement_en_cours'] } },
      }),
      prisma.mission.count({
        where: {
          ...missionFilter,
          statut: { in: ['en_recherche', 'candidatures_disponibles', 'attente_de_signature'] },
        },
      }),
      prisma.mission.count({
        where: {
          ...missionFilter,
          statut: 'mission_terminee',
          dateMiseAJour: { gte: startOfYear },
        },
      }),
      prisma.paiement.count({
        where: { mission: missionFilter, statut: 'en_attente' },
      }),
      prisma.paiement.count({
        where: { mission: missionFilter, statut: { in: ['en_cours', 'bloque'] } },
      }),
      prisma.paiement.count({
        where: { mission: missionFilter, statut: 'libere', dateLiberation: { gte: startOfMonth } },
      }),
    ]);

    // Upcoming planning (next 7 days missions with time slots)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingSlots = await prisma.plageHoraireMission.findMany({
      where: {
        date: { gte: today, lt: nextWeek },
        mission: {
          etablissementId: { in: etablissementIds },
          statut: { in: ['mission_en_cours', 'attente_de_signature'] },
        },
      },
      include: {
        mission: {
          include: {
            etablissement: {
              select: {
                id: true,
                nom: true,
                profilEtablissement: { select: { avatarChemin: true } },
              },
            },
            missionsRenford: {
              where: { statut: { in: ['contrat_signe', 'mission_en_cours'] } },
              include: {
                profilRenford: {
                  select: {
                    id: true,
                    avatarChemin: true,
                    titreProfil: true,
                    utilisateur: { select: { nom: true, prenom: true } },
                  },
                },
              },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
    });

    const planning = upcomingSlots.map((slot) => {
      const renford = slot.mission.missionsRenford[0]?.profilRenford;
      const { profilEtablissement: etabProfil, ...etabRest } = slot.mission.etablissement;
      return {
        id: slot.id,
        date: slot.date,
        heureDebut: slot.heureDebut,
        heureFin: slot.heureFin,
        missionId: slot.missionId,
        discipline: slot.mission.discipline,
        tarif: slot.mission.tarif,
        methodeTarification: slot.mission.methodeTarification,
        etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
        renford: renford
          ? {
              id: renford.id,
              avatarChemin: renford.avatarChemin,
              titreProfil: renford.titreProfil,
              nom: renford.utilisateur.nom,
              prenom: renford.utilisateur.prenom,
            }
          : null,
        totalHours: getMissionTotalHours([slot]),
      };
    });

    return res.json({
      indicators: {
        missionsEnCours,
        missionsEnAttente,
        missionsRealisees,
        paiementsARegler,
        paiementsEnAttente,
        paiementsReglesCeMois,
      },
      planning,
    });
  } catch (err) {
    return next(err);
  }
};

export const getRenfordAccueil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const renfordFilter = { profilRenfordId: profilRenford.id };
    const renfordMissionFilter = { mission: { missionsRenford: { some: renfordFilter } } };

    // Mission counts + payment counts
    const [
      missionsEnCours,
      missionsEnAttente,
      missionsRealisees,
      nouvellesOpportunites,
      paiementsEnCours,
      paiementsCeMois,
      paiementsCetteAnnee,
    ] = await Promise.all([
      prisma.missionRenford.count({
        where: { ...renfordFilter, statut: 'mission_en_cours' },
      }),
      prisma.missionRenford.count({
        where: {
          ...renfordFilter,
          statut: { in: ['selection_en_cours', 'attente_de_signature', 'contrat_signe'] },
        },
      }),
      prisma.missionRenford.count({
        where: {
          ...renfordFilter,
          statut: 'mission_terminee',
          dateMiseAJour: { gte: startOfYear },
        },
      }),
      prisma.missionRenford.count({
        where: { ...renfordFilter, statut: { in: ['nouveau', 'vu'] } },
      }),
      prisma.paiement.count({
        where: { ...renfordMissionFilter, statut: { in: ['en_attente', 'en_cours', 'bloque'] } },
      }),
      prisma.paiement.count({
        where: { ...renfordMissionFilter, statut: 'libere', dateLiberation: { gte: startOfMonth } },
      }),
      prisma.paiement.count({
        where: { ...renfordMissionFilter, statut: 'libere', dateLiberation: { gte: startOfYear } },
      }),
    ]);

    // Upcoming planning (next 7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingSlots = await prisma.plageHoraireMission.findMany({
      where: {
        date: { gte: today, lt: nextWeek },
        mission: {
          missionsRenford: {
            some: {
              profilRenfordId: profilRenford.id,
              statut: { in: ['contrat_signe', 'mission_en_cours'] },
            },
          },
        },
      },
      include: {
        mission: {
          include: {
            etablissement: {
              select: {
                id: true,
                nom: true,
                profilEtablissement: { select: { avatarChemin: true } },
                adresse: true,
                codePostal: true,
                ville: true,
              },
            },
          },
        },
      },
      orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
    });

    const planning = upcomingSlots.map((slot) => {
      const { profilEtablissement: etabProfil, ...etabRest } = slot.mission.etablissement;
      return {
        id: slot.id,
        date: slot.date,
        heureDebut: slot.heureDebut,
        heureFin: slot.heureFin,
        missionId: slot.missionId,
        discipline: slot.mission.discipline,
        tarif: slot.mission.tarif,
        methodeTarification: slot.mission.methodeTarification,
        etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
        totalHours: getMissionTotalHours([slot]),
      };
    });

    return res.json({
      indicators: {
        missionsEnCours,
        missionsEnAttente,
        missionsRealisees,
        nouvellesOpportunites,
        paiementsEnCours,
        paiementsCeMois,
        paiementsCetteAnnee,
      },
      planning,
    });
  } catch (err) {
    return next(err);
  }
};
