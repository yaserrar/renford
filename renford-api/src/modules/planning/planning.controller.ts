import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';

export const getEtablissementPlanning = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { from, to, etablissementId } = req.query as {
      from?: string;
      to?: string;
      etablissementId?: string;
    };

    const profilEtablissement = await prisma.profilEtablissement.findUnique({
      where: { utilisateurId: userId },
      select: { id: true, avatarChemin: true, etablissements: { select: { id: true, nom: true } } },
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
      return res.json({
        etablissements: profilEtablissement.etablissements.map((e) => ({
          ...e,
          avatarChemin: profilEtablissement.avatarChemin,
        })),
        planning: [],
      });
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
            etablissement: { select: { id: true, nom: true } },
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
      etablissements: profilEtablissement.etablissements.map((e) => ({
        ...e,
        avatarChemin: profilEtablissement.avatarChemin,
      })),
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
    const { from, to } = req.query as { from?: string; to?: string };

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

    const planning = slots.map((slot) => {
      const { profilEtablissement: etabProfil, ...etabRest } = slot.mission.etablissement;
      return {
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
        etablissement: { ...etabRest, avatarChemin: etabProfil.avatarChemin },
      };
    });

    return res.json(planning);
  } catch (err) {
    return next(err);
  }
};

// ─── Indisponibilités CRUD ───────────────────────────────────

/** Convert "HH:MM" to minutes since midnight */
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h! * 60 + m!;
};

/** Generate the list of dates to create based on the repetition rule */
const expandDates = (dateDebut: Date, dateFin: Date, repetition: string): Date[] => {
  const dates: Date[] = [];
  const start = new Date(dateDebut);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateFin);
  end.setHours(0, 0, 0, 0);

  if (repetition === 'tous_les_jours') {
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  } else if (repetition === 'toutes_les_semaines') {
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
  } else {
    // "aucune" — one row per day in the range
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  return dates;
};

export const getIndisponibilites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { year, month } = req.query as { year?: string; month?: string };

    const profilRenford = await prisma.profilRenford.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!profilRenford) {
      return res.status(404).json({ message: 'Profil Renford non trouvé' });
    }

    // If year & month are provided, filter to that month only
    const dateFilter: { gte?: Date; lt?: Date } = {};
    if (year && month) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10); // 1-based (1 = January)
      dateFilter.gte = new Date(y, m - 1, 1);
      dateFilter.lt = new Date(y, m, 1); // first day of next month
    }

    const indisponibilites = await prisma.indisponibiliteRenford.findMany({
      where: {
        profilRenfordId: profilRenford.id,
        ...(dateFilter.gte ? { date: dateFilter } : {}),
      },
      orderBy: { date: 'asc' },
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

    const isFullDay = Boolean(journeeEntiere);
    const startMinutes = !isFullDay && heureDebut ? timeToMinutes(heureDebut) : null;
    const endMinutes = !isFullDay && heureFin ? timeToMinutes(heureFin) : null;

    const dates = expandDates(new Date(dateDebut), new Date(dateFin), repetition || 'aucune');

    if (dates.length === 0) {
      return res.status(400).json({ message: 'Plage de dates invalide' });
    }

    // Cap at 365 rows to prevent abuse
    if (dates.length > 365) {
      return res.status(400).json({ message: 'La plage de dates ne peut pas dépasser 365 jours' });
    }

    const created = await prisma.indisponibiliteRenford.createMany({
      data: dates.map((date) => ({
        profilRenfordId: profilRenford.id,
        date,
        heureDebut: startMinutes,
        heureFin: endMinutes,
        journeeEntiere: isFullDay,
      })),
    });

    return res.status(201).json({ count: created.count });
  } catch (err) {
    return next(err);
  }
};

export const deleteIndisponibilite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { indisponibiliteId } = req.params as { indisponibiliteId: string };

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
