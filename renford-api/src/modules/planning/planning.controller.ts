import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';
import type { RepetitionIndisponibilite } from '@prisma/client';

export const getEtablissementPlanning = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { from, to, etablissementId } = req.query;

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, etablissements: { select: { id: true, nom: true, avatarChemin: true } } },
    });

    if (!profilEtablissement) {
      return res.status(404).json({ message: 'Profil établissement non trouvé' });
    }

    // Determine the week range (default to current week: Monday–Sunday)
    let weekStart: Date;
    let weekEnd: Date;

    if (from && to) {
      weekStart = new Date(from as string);
      weekEnd = new Date(to as string);
    } else {
      const now = new Date();
      const day = now.getDay(); // 0=Sun, 1=Mon, ...
      const diffToMonday = day === 0 ? -6 : 1 - day;
      weekStart = new Date(now);
      weekStart.setDate(now.getDate() + diffToMonday);
      weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
    }

    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);

    // Filter by specific etablissement or all
    const etablissementIds = etablissementId
      ? [etablissementId as string]
      : profilEtablissement.etablissements.map((e) => e.id);

    // Validate ownership of the requested etablissement
    const ownedIds = new Set(profilEtablissement.etablissements.map((e) => e.id));
    const filteredIds = etablissementIds.filter((id) => ownedIds.has(id));

    if (filteredIds.length === 0) {
      return res.json({ etablissements: profilEtablissement.etablissements, planning: [] });
    }

    const slots = await prisma.plageHoraireMission.findMany({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        mission: {
          etablissementId: { in: filteredIds },
          statut: { in: ['attente_de_signature', 'mission_en_cours', 'remplacement_en_cours'] },
        },
      },
      include: {
        mission: {
          select: {
            id: true,
            statut: true,
            discipline: true,
            etablissementId: true,
            etablissement: { select: { id: true, nom: true, avatarChemin: true } },
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

    // Group by renford
    const renfordMap = new Map<
      string,
      {
        id: string;
        nom: string;
        prenom: string;
        avatarChemin: string | null;
        titreProfil: string | null;
        slots: Array<{
          id: string;
          missionId: string;
          date: string;
          heureDebut: string;
          heureFin: string;
        }>;
      }
    >();

    for (const slot of slots) {
      const mr = slot.mission.missionsRenford[0];
      if (!mr) continue;

      const renford = mr.profilRenford;
      const key = renford.id;

      if (!renfordMap.has(key)) {
        renfordMap.set(key, {
          id: renford.id,
          nom: renford.utilisateur.nom,
          prenom: renford.utilisateur.prenom,
          avatarChemin: renford.avatarChemin,
          titreProfil: renford.titreProfil,
          slots: [],
        });
      }

      renfordMap.get(key)!.slots.push({
        id: slot.id,
        missionId: slot.missionId,
        date: slot.date.toISOString(),
        heureDebut: slot.heureDebut,
        heureFin: slot.heureFin,
      });
    }

    return res.json({
      etablissements: profilEtablissement.etablissements,
      planning: Array.from(renfordMap.values()),
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Renford planning ────────────────────────────────────────

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

export const getRenfordPlanning = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { from, to } = req.query;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    // If no dates provided, return all upcoming slots from today
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (from && to) {
      const startDate = new Date(from as string);
      const endDate = new Date(to as string);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      dateFilter.gte = startDate;
      dateFilter.lte = endDate;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter.gte = today;
    }

    const slots = await prisma.plageHoraireMission.findMany({
      where: {
        date: dateFilter,
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
          select: {
            id: true,
            statut: true,
            discipline: true,
            tarif: true,
            methodeTarification: true,
            materielsRequis: true,
            etablissement: {
              select: {
                id: true,
                nom: true,
                avatarChemin: true,
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

    const planning = slots.map((slot) => ({
      id: slot.id,
      missionId: slot.missionId,
      date: slot.date.toISOString(),
      heureDebut: slot.heureDebut,
      heureFin: slot.heureFin,
      totalHours: getMissionTotalHours([slot]),
      discipline: slot.mission.discipline,
      tarif: slot.mission.tarif,
      methodeTarification: slot.mission.methodeTarification,
      materielsRequis: slot.mission.materielsRequis,
      etablissement: slot.mission.etablissement,
    }));

    return res.json(planning);
  } catch (err) {
    return next(err);
  }
};

// ─── Indisponibilités CRUD ───────────────────────────────────

export const getIndisponibilites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const indisponibilites = await prisma.indisponibiliteRenford.findMany({
      where: { profilRenfordId: profilRenford.id },
      orderBy: { dateDebut: 'asc' },
    });

    return res.json(indisponibilites);
  } catch (err) {
    return next(err);
  }
};

export const createIndisponibilite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { dateDebut, dateFin, heureDebut, heureFin, journeeEntiere, repetition } = req.body;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const indisponibilite = await prisma.indisponibiliteRenford.create({
      data: {
        profilRenfordId: profilRenford.id,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        heureDebut: journeeEntiere ? null : heureDebut,
        heureFin: journeeEntiere ? null : heureFin,
        journeeEntiere: Boolean(journeeEntiere),
        repetition: (repetition as RepetitionIndisponibilite) || 'aucune',
      },
    });

    return res.status(201).json(indisponibilite);
  } catch (err) {
    return next(err);
  }
};

export const deleteIndisponibilite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { indisponibiliteId } = req.params;

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    const indispo = await prisma.indisponibiliteRenford.findUnique({
      where: { id: indisponibiliteId },
    });

    if (!indispo || indispo.profilRenfordId !== profilRenford.id) {
      return res.status(404).json({ message: 'Indisponibilité non trouvée' });
    }

    await prisma.indisponibiliteRenford.delete({
      where: { id: indisponibiliteId },
    });

    return res.json({ message: 'Indisponibilité supprimée' });
  } catch (err) {
    return next(err);
  }
};
