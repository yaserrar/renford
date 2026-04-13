import type { NextFunction, Request, Response } from 'express';
import prisma from '../../config/prisma';

// GET /admin/stats - Statistiques du dashboard admin
export const getAdminStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUtilisateurs,
      totalEtablissements,
      totalRenfords,
      utilisateursActifs,
      utilisateursSuspendus,
      nouveauxUtilisateurs30j,
      totalMissions,
      missionsEnRecherche,
      missionsEnCours,
      missionsTerminees,
      missionsAnnulees,
      nouvellesmissions30j,
      totalCandidatures,
      candidaturesAcceptees,
      messagesContactNonTraites,
    ] = await Promise.all([
      prisma.utilisateur.count({ where: { typeUtilisateur: { not: 'administrateur' } } }),
      prisma.utilisateur.count({ where: { typeUtilisateur: 'etablissement' } }),
      prisma.utilisateur.count({ where: { typeUtilisateur: 'renford' } }),
      prisma.utilisateur.count({
        where: { statut: 'actif', typeUtilisateur: { not: 'administrateur' } },
      }),
      prisma.utilisateur.count({
        where: { statut: 'suspendu', typeUtilisateur: { not: 'administrateur' } },
      }),
      prisma.utilisateur.count({
        where: { dateCreation: { gte: thirtyDaysAgo }, typeUtilisateur: { not: 'administrateur' } },
      }),
      prisma.mission.count(),
      prisma.mission.count({ where: { statut: 'en_recherche' } }),
      prisma.mission.count({ where: { statut: 'mission_en_cours' } }),
      prisma.mission.count({ where: { statut: 'mission_terminee' } }),
      prisma.mission.count({ where: { statut: 'annulee' } }),
      prisma.mission.count({ where: { dateCreation: { gte: thirtyDaysAgo } } }),
      prisma.missionRenford.count(),
      prisma.missionRenford.count({
        where: { statut: { in: ['contrat_signe', 'mission_en_cours', 'mission_terminee'] } },
      }),
      prisma.messageContact.count({ where: { traite: false } }),
    ]);

    const tauxAcceptation =
      totalCandidatures > 0 ? Math.round((candidaturesAcceptees / totalCandidatures) * 100) : 0;

    res.json({
      utilisateurs: {
        total: totalUtilisateurs,
        etablissements: totalEtablissements,
        renfords: totalRenfords,
        actifs: utilisateursActifs,
        suspendus: utilisateursSuspendus,
        nouveaux30j: nouveauxUtilisateurs30j,
      },
      missions: {
        total: totalMissions,
        enRecherche: missionsEnRecherche,
        enCours: missionsEnCours,
        terminees: missionsTerminees,
        annulees: missionsAnnulees,
        nouvelles30j: nouvellesmissions30j,
        tauxAcceptation,
      },
      messagesContactNonTraites,
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/stats/missions-by-status - Pie chart data
export const getMissionsByStatus = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await prisma.mission.groupBy({
      by: ['statut'],
      _count: { id: true },
    });

    const data: Record<string, number> = {};
    for (const r of results) {
      data[r.statut] = r._count.id;
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GET /admin/stats/users-by-status - Stacked pie chart data
export const getUsersByStatus = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [byType, byStatut] = await Promise.all([
      prisma.utilisateur.groupBy({
        by: ['typeUtilisateur'],
        _count: { id: true },
        where: { typeUtilisateur: { not: 'administrateur' } },
      }),
      prisma.utilisateur.groupBy({
        by: ['statut'],
        _count: { id: true },
        where: { typeUtilisateur: { not: 'administrateur' } },
      }),
    ]);

    res.json({
      byType: byType.map((r) => ({ type: r.typeUtilisateur, count: r._count.id })),
      byStatut: byStatut.map((r) => ({ statut: r.statut, count: r._count.id })),
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/stats/daily-inscriptions?from=YYYY-MM-DD&to=YYYY-MM-DD
export const getDailyInscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: 'Les paramètres from et to sont requis (YYYY-MM-DD)' });
    }

    const items = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT TO_CHAR("dateCreation"::date, 'YYYY-MM-DD') as date,
             COUNT(*)::bigint as count
      FROM utilisateurs
      WHERE "typeUtilisateur" != 'administrateur'
        AND "dateCreation"::date >= ${from}::date
        AND "dateCreation"::date <= ${to}::date
      GROUP BY "dateCreation"::date
      ORDER BY date ASC
    `;

    res.json({
      items: items.map((r) => ({ date: r.date, count: Number(r.count) })),
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/stats/daily-missions?from=YYYY-MM-DD&to=YYYY-MM-DD
export const getDailyMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: 'Les paramètres from et to sont requis (YYYY-MM-DD)' });
    }

    const items = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT TO_CHAR("dateCreation"::date, 'YYYY-MM-DD') as date,
             COUNT(*)::bigint as count
      FROM missions
      WHERE "dateCreation"::date >= ${from}::date
        AND "dateCreation"::date <= ${to}::date
      GROUP BY "dateCreation"::date
      ORDER BY date ASC
    `;

    res.json({
      items: items.map((r) => ({ date: r.date, count: Number(r.count) })),
    });
  } catch (error) {
    next(error);
  }
};
