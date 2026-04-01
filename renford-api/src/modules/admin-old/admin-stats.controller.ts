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
      // Évolution mensuelle (6 derniers mois)
      evolutionUtilisateurs,
      evolutionMissions,
    ] = await Promise.all([
      // Utilisateurs
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

      // Missions
      prisma.mission.count(),
      prisma.mission.count({ where: { statut: 'en_recherche' } }),
      prisma.mission.count({ where: { statut: 'mission_en_cours' } }),
      prisma.mission.count({ where: { statut: 'mission_terminee' } }),
      prisma.mission.count({ where: { statut: 'annulee' } }),
      prisma.mission.count({ where: { dateCreation: { gte: thirtyDaysAgo } } }),

      // Candidatures (MissionRenford)
      prisma.missionRenford.count(),
      prisma.missionRenford.count({
        where: { statut: { in: ['contrat_signe', 'mission_en_cours', 'mission_terminee'] } },
      }),

      // Messages contact non traités
      prisma.messageContact.count({ where: { traite: false } }),

      // Évolution mensuelle utilisateurs (6 derniers mois)
      prisma.$queryRaw<Array<{ mois: string; total: bigint }>>`
        SELECT TO_CHAR(date_trunc('month', "dateCreation"), 'YYYY-MM') as mois,
               COUNT(*)::bigint as total
        FROM utilisateurs
        WHERE "typeUtilisateur" != 'administrateur'
          AND "dateCreation" >= NOW() - INTERVAL '6 months'
        GROUP BY date_trunc('month', "dateCreation")
        ORDER BY mois ASC
      `,

      // Évolution mensuelle missions (6 derniers mois)
      prisma.$queryRaw<Array<{ mois: string; total: bigint }>>`
        SELECT TO_CHAR(date_trunc('month', "dateCreation"), 'YYYY-MM') as mois,
               COUNT(*)::bigint as total
        FROM missions
        WHERE "dateCreation" >= NOW() - INTERVAL '6 months'
        GROUP BY date_trunc('month', "dateCreation")
        ORDER BY mois ASC
      `,
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
      evolution: {
        utilisateurs: evolutionUtilisateurs.map((r) => ({
          mois: r.mois,
          total: Number(r.total),
        })),
        missions: evolutionMissions.map((r) => ({
          mois: r.mois,
          total: Number(r.total),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
