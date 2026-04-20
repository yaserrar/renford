import prisma from '../config/prisma';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { mail } from '../config/mail';
import {
  getRappelMissionJ1EtablissementEmail,
  getRappelMissionJ1RenfordEmail,
  getRappelMission72hRenfordEmail,
  getRappelMission72hEtablissementEmail,
} from '../config/email-templates';
import { getTypeMissionLabel } from '../modules/missions/missions.schema';

/**
 * Send reminder emails for missions starting in ~24h (J-1).
 * Runs daily at 09:00.
 */
export async function sendMissionJ1Reminders(): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Missions starting tomorrow (same calendar day)
  const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const endOfTomorrow = new Date(startOfTomorrow);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

  const missions = await prisma.mission.findMany({
    where: {
      dateDebut: { gte: startOfTomorrow, lt: endOfTomorrow },
      statut: { in: ['mission_en_cours', 'attente_de_signature', 'candidatures_disponibles'] },
      missionsRenford: {
        some: {
          statut: { in: ['contrat_signe', 'mission_en_cours', 'attente_de_signature'] },
        },
      },
    },
    select: {
      id: true,
      modeMission: true,
      specialitePrincipale: true,
      etablissement: {
        select: {
          nom: true,
          profilEtablissement: {
            select: {
              raisonSociale: true,
              utilisateur: { select: { email: true, prenom: true } },
            },
          },
        },
      },
      missionsRenford: {
        where: {
          statut: { in: ['contrat_signe', 'mission_en_cours', 'attente_de_signature'] },
        },
        select: {
          profilRenford: {
            select: {
              utilisateur: { select: { email: true, prenom: true } },
            },
          },
        },
      },
    },
  });

  let sent = 0;
  let failed = 0;
  const urlBase = env.PLATFORM_URL.replace(/\/$/, '');

  for (const mission of missions) {
    const etab = mission.etablissement;
    const etabUser = etab.profilEtablissement.utilisateur;
    const raisonSociale = etab.profilEtablissement.raisonSociale || etab.nom;

    // Send to etablissement
    if (etabUser.email) {
      const renfordPrenom = mission.missionsRenford[0]?.profilRenford.utilisateur.prenom || '';
      const payload = getRappelMissionJ1EtablissementEmail({
        prenomEtablissement: etabUser.prenom,
        prenomRenford: renfordPrenom,
        modeMission: mission.modeMission,
        espaceUrl: `${urlBase}/dashboard/etablissement/missions/${mission.id}`,
      });

      try {
        await mail.sendMail({
          to: etabUser.email,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });
        sent++;
      } catch (err) {
        failed++;
        logger.error({ err, missionId: mission.id }, 'Échec envoi rappel J-1 établissement');
      }
    }

    // Send to each renford
    for (const mr of mission.missionsRenford) {
      const renfordUser = mr.profilRenford.utilisateur;
      if (!renfordUser.email) continue;

      const payload = getRappelMissionJ1RenfordEmail({
        prenomRenford: renfordUser.prenom,
        raisonSociale,
        modeMission: mission.modeMission,
        espaceUrl: `${urlBase}/dashboard/renford/missions/${mission.id}`,
      });

      try {
        await mail.sendMail({
          to: renfordUser.email,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });
        sent++;
      } catch (err) {
        failed++;
        logger.error({ err, missionId: mission.id }, 'Échec envoi rappel J-1 renford');
      }
    }
  }

  return { processed: missions.length, sent, failed };
}

/**
 * Send reminder emails for missions starting in ~72h.
 * Runs daily at 09:00.
 */
export async function sendMission72hReminders(): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  const now = new Date();
  const in3Days = new Date(now);
  in3Days.setDate(in3Days.getDate() + 3);

  const startOfDay = new Date(in3Days.getFullYear(), in3Days.getMonth(), in3Days.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const missions = await prisma.mission.findMany({
    where: {
      dateDebut: { gte: startOfDay, lt: endOfDay },
      statut: { in: ['mission_en_cours', 'attente_de_signature', 'candidatures_disponibles'] },
      missionsRenford: {
        some: {
          statut: { in: ['contrat_signe', 'mission_en_cours', 'attente_de_signature'] },
        },
      },
    },
    select: {
      id: true,
      modeMission: true,
      specialitePrincipale: true,
      dateDebut: true,
      etablissement: {
        select: {
          nom: true,
          adresse: true,
          ville: true,
          profilEtablissement: {
            select: {
              raisonSociale: true,
              utilisateur: { select: { email: true, prenom: true } },
            },
          },
        },
      },
      PlageHoraireMission: {
        orderBy: { date: 'asc' },
        take: 1,
        select: { heureDebut: true, heureFin: true, date: true },
      },
      missionsRenford: {
        where: {
          statut: { in: ['contrat_signe', 'mission_en_cours', 'attente_de_signature'] },
        },
        select: {
          profilRenford: {
            select: {
              utilisateur: { select: { email: true, prenom: true } },
            },
          },
        },
      },
    },
  });

  let sent = 0;
  let failed = 0;
  const urlBase = env.PLATFORM_URL.replace(/\/$/, '');

  for (const mission of missions) {
    const etab = mission.etablissement;
    const etabUser = etab.profilEtablissement.utilisateur;
    const raisonSociale = etab.profilEtablissement.raisonSociale || etab.nom;
    const adresseComplete = `${etab.adresse}, ${etab.ville}`;
    const plage = mission.PlageHoraireMission[0];
    const plageMission = plage
      ? new Date(plage.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : new Date(mission.dateDebut).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
    const creneaux = plage ? `${plage.heureDebut} - ${plage.heureFin}` : '';
    const typeMission = getTypeMissionLabel(mission.specialitePrincipale);

    // Send to etablissement
    if (etabUser.email) {
      const renfordPrenom = mission.missionsRenford[0]?.profilRenford.utilisateur.prenom || '';
      const payload = getRappelMission72hEtablissementEmail({
        prenomEtablissement: etabUser.prenom,
        prenomRenford: renfordPrenom,
        modeMission: mission.modeMission,
        typeMission,
        plageMission,
        creneaux,
        espaceUrl: `${urlBase}/dashboard/etablissement/missions/${mission.id}`,
      });

      try {
        await mail.sendMail({
          to: etabUser.email,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });
        sent++;
      } catch (err) {
        failed++;
        logger.error({ err, missionId: mission.id }, 'Échec envoi rappel 72h établissement');
      }
    }

    // Send to each renford
    for (const mr of mission.missionsRenford) {
      const renfordUser = mr.profilRenford.utilisateur;
      if (!renfordUser.email) continue;

      const payload = getRappelMission72hRenfordEmail({
        prenomRenford: renfordUser.prenom,
        typeMission,
        raisonSociale,
        adresse: adresseComplete,
        plageMission,
        creneaux,
        espaceUrl: `${urlBase}/dashboard/renford/missions/${mission.id}`,
      });

      try {
        await mail.sendMail({
          to: renfordUser.email,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });
        sent++;
      } catch (err) {
        failed++;
        logger.error({ err, missionId: mission.id }, 'Échec envoi rappel 72h renford');
      }
    }
  }

  return { processed: missions.length, sent, failed };
}
