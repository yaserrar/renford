import type {
  CreneauDisponibilite,
  NiveauExperience,
  Prisma,
  StatutMissionRenford,
} from '@prisma/client';
import prisma from '../config/prisma';
import { env } from '../config/env';
import {
  getConfirmationMissionRenfordEmail,
  getContratASignerRenfordEmail,
  getNewMissionRenfordEmail,
  getProfilAccepteEtablissementCoachEmail,
  getProfilNonRetenuRenfordEmail,
  getRenfordTrouveCoachEmail,
  getRenfordTrouveFlexEmail,
} from '../config/email-templates';
import { logger } from '../config/logger';
import { mail } from '../config/mail';
import { createNotification, createNotifications } from '../config/notification';
import { getTypeMissionLabel } from '../modules/missions/missions.schema';

const MATCH_QUEUE_LIMIT = 50;

const EXPERIENCE_RANK: Record<NiveauExperience, number> = {
  debutant: 1,
  confirme: 2,
  expert: 3,
  peut_importe: 0,
};

const REMATCH_BLOCKING_STATUSES = new Set<StatutMissionRenford>([
  'refuse_par_renford',
  'annule',
  'mission_terminee',
]);
const LOCKED_ASSIGNMENT_STATUSES = new Set<StatutMissionRenford>([
  'selection_en_cours',
  'attente_de_signature',
  'refuse_par_etablissement',
  'contrat_signe',
  'mission_en_cours',
]);

type MatchMission = Prisma.MissionGetPayload<{
  include: {
    etablissement: true;
    PlageHoraireMission: {
      orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }];
    };
    missionsRenford: true;
  };
}>;

type MatchRenfordProfile = Prisma.ProfilRenfordGetPayload<{
  include: {
    utilisateur: {
      select: {
        id: true;
        nom: true;
        prenom: true;
        statut: true;
        typeUtilisateur: true;
      };
    };
    renfordDiplomes: true;
    experiencesProfessionnelles: true;
  };
}>;

type EvaluatedRenfordMatch = {
  profilRenfordId: string;
  score: number;
};

const decimalToNumber = (value: Prisma.Decimal | number | string | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  const normalized = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
};

const formatDateFr = (value: Date): string =>
  value.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatDateTimeSlots = (
  slots: Array<{ date: Date; heureDebut: string; heureFin: string }>,
): { dateLabel: string; heureLabel: string } => {
  if (slots.length === 0) {
    return { dateLabel: '-', heureLabel: '-' };
  }

  const orderedSlots = slots.slice().sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.heureDebut.localeCompare(b.heureDebut);
  });

  const first = orderedSlots[0]!;
  const last = orderedSlots[orderedSlots.length - 1]!;

  const dateLabel =
    orderedSlots.length === 1
      ? formatDateFr(first.date)
      : `${formatDateFr(first.date)} - ${formatDateFr(last.date)}`;
  const heureLabel = orderedSlots.map((slot) => `${slot.heureDebut}-${slot.heureFin}`).join(' ; ');

  return { dateLabel, heureLabel };
};

const formatMissionRemuneration = (mission: MatchMission): string => {
  const tarif = decimalToNumber(mission.tarif);
  const suffix =
    mission.methodeTarification === 'horaire'
      ? '/heure'
      : mission.methodeTarification === 'journee'
        ? '/journee'
        : '/demi-journee';

  return `${tarif.toLocaleString('fr-FR', {
    minimumFractionDigits: Number.isInteger(tarif) ? 0 : 2,
    maximumFractionDigits: 2,
  })} EUR ${suffix}`;
};

const startOfDay = (value: Date): Date => {
  const normalized = new Date(value);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const endOfDay = (value: Date): Date => {
  const normalized = new Date(value);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
};

const timeToMinutes = (value: string): number | null => {
  const [hours, minutes] = value.split(':').map(Number);

  if (
    hours === undefined ||
    minutes === undefined ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const getMissionBuckets = (heureDebut: string, heureFin: string): CreneauDisponibilite[] => {
  const startMinutes = timeToMinutes(heureDebut);
  const endMinutes = timeToMinutes(heureFin);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return [];
  }

  const buckets = new Set<CreneauDisponibilite>();

  if (startMinutes < 12 * 60 && endMinutes > 6 * 60) {
    buckets.add('matin');
  }

  if (startMinutes < 14 * 60 && endMinutes > 11 * 60) {
    buckets.add('midi');
  }

  if (startMinutes < 18 * 60 && endMinutes > 13 * 60) {
    buckets.add('apres_midi');
  }

  if (endMinutes > 18 * 60) {
    buckets.add('soir');
  }

  return Array.from(buckets);
};

const getRenfordAvailabilityForDate = (
  profilRenford: MatchRenfordProfile,
  date: Date,
): CreneauDisponibilite[] => {
  switch (date.getDay()) {
    case 0:
      return profilRenford.disponibilitesDimanche;
    case 1:
      return profilRenford.disponibilitesLundi;
    case 2:
      return profilRenford.disponibilitesMardi;
    case 3:
      return profilRenford.disponibilitesMercredi;
    case 4:
      return profilRenford.disponibilitesJeudi;
    case 5:
      return profilRenford.disponibilitesVendredi;
    case 6:
      return profilRenford.disponibilitesSamedi;
    default:
      return [];
  }
};

const isRenfordAvailableForMission = (
  mission: MatchMission,
  profilRenford: MatchRenfordProfile,
): boolean => {
  if (!profilRenford.dureeIllimitee) {
    if (
      profilRenford.dateDebut &&
      startOfDay(mission.dateDebut) < startOfDay(profilRenford.dateDebut)
    ) {
      return false;
    }

    if (
      profilRenford.dateFin &&
      endOfDay(mission.dateFin ?? mission.dateDebut) > endOfDay(profilRenford.dateFin)
    ) {
      return false;
    }
  }

  return mission.PlageHoraireMission.every((plage) => {
    const requiredBuckets = getMissionBuckets(plage.heureDebut, plage.heureFin);
    const availableBuckets = new Set(getRenfordAvailabilityForDate(profilRenford, plage.date));

    return requiredBuckets.every((bucket) => availableBuckets.has(bucket));
  });
};

const degreesToRadians = (value: number): number => (value * Math.PI) / 180;

const calculateDistanceKm = (
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
): number => {
  const earthRadiusKm = 6371;
  const deltaLatitude = degreesToRadians(destinationLatitude - originLatitude);
  const deltaLongitude = degreesToRadians(destinationLongitude - originLongitude);

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(degreesToRadians(originLatitude)) *
      Math.cos(degreesToRadians(destinationLatitude)) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getLocationScore = (
  mission: MatchMission,
  profilRenford: MatchRenfordProfile,
): number | null => {
  const missionLatitude = mission.etablissement.latitude;
  const missionLongitude = mission.etablissement.longitude;
  const renfordLatitude = profilRenford.latitude;
  const renfordLongitude = profilRenford.longitude;

  if (
    missionLatitude !== null &&
    missionLatitude !== undefined &&
    missionLongitude !== null &&
    missionLongitude !== undefined &&
    renfordLatitude !== null &&
    renfordLatitude !== undefined &&
    renfordLongitude !== null &&
    renfordLongitude !== undefined
  ) {
    const distance = calculateDistanceKm(
      missionLatitude,
      missionLongitude,
      renfordLatitude,
      renfordLongitude,
    );

    if (profilRenford.zoneDeplacement && distance > profilRenford.zoneDeplacement) {
      return null;
    }

    return Math.max(0, 30 - distance / 2);
  }

  const missionCity = mission.etablissement.ville.trim().toLowerCase();
  const renfordCity = profilRenford.ville?.trim().toLowerCase();

  if (missionCity && renfordCity && missionCity === renfordCity) {
    return 22;
  }

  const missionDepartment = mission.etablissement.codePostal.slice(0, 2);
  const renfordDepartment = profilRenford.codePostal?.slice(0, 2);

  if (missionDepartment && renfordDepartment && missionDepartment === renfordDepartment) {
    return 12;
  }

  return 0;
};

const getRenfordTarifForMission = (
  profilRenford: MatchRenfordProfile,
  methodeTarification: MatchMission['methodeTarification'],
): number | null => {
  switch (methodeTarification) {
    case 'horaire': {
      const tarif = decimalToNumber(profilRenford.tarifHoraire);
      return tarif > 0 ? tarif : null;
    }
    case 'journee': {
      if (!profilRenford.proposeJournee) {
        return null;
      }

      const tarif = decimalToNumber(profilRenford.tarifJournee);
      return tarif > 0 ? tarif : null;
    }
    case 'demi_journee': {
      if (!profilRenford.proposeDemiJournee) {
        return null;
      }

      const tarif = decimalToNumber(profilRenford.tarifDemiJournee);
      return tarif > 0 ? tarif : null;
    }
    default:
      return null;
  }
};

const getFavoriteRenfordIdsForMission = async (mission: MatchMission): Promise<Set<string>> => {
  const profilEtablissementId = mission.etablissement.profilEtablissementId;
  if (!profilEtablissementId) {
    return new Set();
  }

  const favoris = await prisma.favorisRenford.findMany({
    where: { profilEtablissementId },
    select: { profilRenfordId: true },
  });

  return new Set(favoris.map((favori) => favori.profilRenfordId));
};

const evaluateRenfordMatch = async (
  mission: MatchMission,
  profilRenford: MatchRenfordProfile,
  favoriteRenfordIds: Set<string>,
  existingStatus?: StatutMissionRenford,
): Promise<EvaluatedRenfordMatch | null> => {
  const renfordLabel = `${profilRenford.utilisateur.prenom} ${profilRenford.utilisateur.nom} (${profilRenford.id})`;

  if (existingStatus && REMATCH_BLOCKING_STATUSES.has(existingStatus)) {
    logger.info(
      { missionId: mission.id, renford: renfordLabel, existingStatus },
      '[🤝 matching] SKIP: blocked by existing status',
    );
    return null;
  }

  if (
    profilRenford.utilisateur.typeUtilisateur !== 'renford' ||
    profilRenford.utilisateur.statut !== 'actif'
  ) {
    logger.info(
      {
        missionId: mission.id,
        renford: renfordLabel,
        typeUtilisateur: profilRenford.utilisateur.typeUtilisateur,
        statut: profilRenford.utilisateur.statut,
      },
      '[🤝 matching] SKIP: user not active renford',
    );
    return null;
  }

  if (!profilRenford.typeMission.includes(mission.specialitePrincipale)) {
    logger.info(
      {
        missionId: mission.id,
        renford: renfordLabel,
        renfordTypeMission: profilRenford.typeMission,
        missionSpecialite: mission.specialitePrincipale,
      },
      '[🤝 matching] SKIP: specialite mismatch',
    );
    return null;
  }

  if (mission.assuranceObligatoire && !profilRenford.assuranceRCPro) {
    logger.info(
      { missionId: mission.id, renford: renfordLabel },
      '[🤝 matching] SKIP: assurance RCPro required but missing',
    );
    return null;
  }

  const requiredExperience = mission.niveauExperienceRequis ?? 'peut_importe';
  const renfordExperience = profilRenford.niveauExperience ?? 'debutant';

  if (
    requiredExperience !== 'peut_importe' &&
    EXPERIENCE_RANK[renfordExperience] < EXPERIENCE_RANK[requiredExperience]
  ) {
    logger.info(
      { missionId: mission.id, renford: renfordLabel, requiredExperience, renfordExperience },
      '[🤝 matching] SKIP: insufficient experience',
    );
    return null;
  }

  if (!isRenfordAvailableForMission(mission, profilRenford)) {
    logger.info(
      {
        missionId: mission.id,
        renford: renfordLabel,
        missionDateDebut: mission.dateDebut,
        missionDateFin: mission.dateFin,
        renfordDateDebut: profilRenford.dateDebut,
        renfordDateFin: profilRenford.dateFin,
        dureeIllimitee: profilRenford.dureeIllimitee,
      },
      '[🤝 matching] SKIP: renford not available for mission schedule',
    );
    return null;
  }

  const locationScore = getLocationScore(mission, profilRenford);
  if (locationScore === null) {
    logger.info(
      {
        missionId: mission.id,
        renford: renfordLabel,
        renfordZoneDeplacement: profilRenford.zoneDeplacement,
        etablissementVille: mission.etablissement.ville,
        renfordVille: profilRenford.ville,
      },
      '[🤝 matching] SKIP: outside zone de deplacement',
    );
    return null;
  }

  const missionTarif = decimalToNumber(mission.tarif);
  const variation = decimalToNumber(mission.pourcentageVariationTarif);
  const maxSupportedTarif = missionTarif * (1 + variation / 100);
  const renfordTarif = getRenfordTarifForMission(profilRenford, mission.methodeTarification);

  if (renfordTarif === null || renfordTarif > maxSupportedTarif) {
    logger.info(
      {
        missionId: mission.id,
        renford: renfordLabel,
        missionTarif,
        maxSupportedTarif,
        renfordTarif,
        methodeTarification: mission.methodeTarification,
      },
      '[🤝 matching] SKIP: tarif incompatible',
    );
    return null;
  }

  let score = 100;

  if (favoriteRenfordIds.has(profilRenford.id)) {
    score += 80;
  }

  if (
    mission.specialitesSecondaires.some((specialite) =>
      profilRenford.typeMission.includes(specialite),
    )
  ) {
    score += 12;
  }

  score += locationScore;
  score += EXPERIENCE_RANK[renfordExperience] * 8;
  score += Math.min(12, profilRenford.nombreMissionsCompletees * 0.4);
  score += Math.min(10, profilRenford.experiencesProfessionnelles.length * 2);
  score += Math.min(6, profilRenford.renfordDiplomes.length * 2);

  if (profilRenford.justificatifCarteProfessionnelleChemin) {
    score += 3;
  }

  const priceGapRatio = missionTarif > 0 ? Math.abs(renfordTarif - missionTarif) / missionTarif : 0;
  score += Math.max(0, 25 - priceGapRatio * 40);

  return {
    profilRenfordId: profilRenford.id,
    score,
  };
};

const getEligibleRenfordProfiles = async (
  mission: MatchMission,
): Promise<MatchRenfordProfile[]> => {
  return prisma.profilRenford.findMany({
    where: {
      typeMission: {
        has: mission.specialitePrincipale,
      },
      utilisateur: {
        typeUtilisateur: 'renford',
        statut: 'actif',
      },
    },
    include: {
      utilisateur: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          statut: true,
          typeUtilisateur: true,
        },
      },
      renfordDiplomes: true,
      experiencesProfessionnelles: true,
    },
  });
};

const normalizeSelectionOrdering = async (missionId: string): Promise<void> => {
  const selections = await prisma.missionRenford.findMany({
    where: {
      missionId,
      statut: 'selection_en_cours',
    },
    orderBy: [{ ordreShortlist: 'asc' }, { dateCreation: 'asc' }],
    select: { id: true },
  });

  if (selections.length === 0) {
    return;
  }

  await prisma.$transaction(
    selections.map((assignment, index) =>
      prisma.missionRenford.update({
        where: { id: assignment.id },
        data: { ordreShortlist: index + 1 },
      }),
    ),
  );
};

export const syncMissionMatches = async (
  missionId: string,
): Promise<{
  missionId: string;
  totalEligible: number;
  queued: number;
  proposed: number;
}> => {
  logger.info({ missionId }, '[🤝 matching] syncMissionMatches START');

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      etablissement: true,
      PlageHoraireMission: {
        orderBy: [{ date: 'asc' }, { heureDebut: 'asc' }],
      },
      missionsRenford: true,
    },
  });

  const matchableStatuses = ['en_recherche', 'remplacement_en_cours'];
  if (!mission || !matchableStatuses.includes(mission.statut)) {
    logger.warn(
      { missionId, statut: mission?.statut },
      '[🤝 matching] SKIP: mission not found or not matchable',
    );
    return {
      missionId,
      totalEligible: 0,
      queued: 0,
      proposed: 0,
    };
  }

  logger.info(
    {
      missionId,
      specialite: mission.specialitePrincipale,
      methodeTarification: mission.methodeTarification,
      tarif: mission.tarif,
      assuranceObligatoire: mission.assuranceObligatoire,
      niveauExperienceRequis: mission.niveauExperienceRequis,
      existingAssignmentsCount: mission.missionsRenford.length,
    },
    '[🤝 matching] mission details',
  );

  await prisma.mission.update({
    where: { id: mission.id },
    data: { dateDerniereRechercheRenford: new Date() },
  });

  const favoriteRenfordIds = await getFavoriteRenfordIdsForMission(mission);
  const existingAssignments = new Map(
    mission.missionsRenford.map((missionRenford) => [
      missionRenford.profilRenfordId,
      missionRenford,
    ]),
  );

  const renfordProfiles = await getEligibleRenfordProfiles(mission);
  logger.info(
    { missionId, eligibleProfilesCount: renfordProfiles.length },
    '[🤝 matching] eligible profiles fetched',
  );
  const evaluatedMatches = await Promise.all(
    renfordProfiles.map((profilRenford) =>
      evaluateRenfordMatch(
        mission,
        profilRenford,
        favoriteRenfordIds,
        existingAssignments.get(profilRenford.id)?.statut,
      ),
    ),
  );

  const rankedMatches = evaluatedMatches
    .filter((match): match is EvaluatedRenfordMatch => Boolean(match))
    .sort((left, right) => right.score - left.score)
    .slice(0, MATCH_QUEUE_LIMIT);

  logger.info(
    {
      missionId,
      totalEvaluated: renfordProfiles.length,
      matchedCount: rankedMatches.length,
      topScores: rankedMatches.map((m) => ({ id: m.profilRenfordId, score: m.score })),
    },
    rankedMatches.length > 0
      ? '[🤝 matching] 🎯 ranking complete'
      : '[🤝 matching] ranking complete',
  );

  const desiredMatchIds = new Set(rankedMatches.map((match) => match.profilRenfordId));
  const newlyMatchedProfilRenfordIds = rankedMatches
    .filter((match) => !existingAssignments.has(match.profilRenfordId))
    .map((match) => match.profilRenfordId);

  const writes: Prisma.PrismaPromise<unknown>[] = [];

  mission.missionsRenford.forEach((assignment) => {
    if (
      LOCKED_ASSIGNMENT_STATUSES.has(assignment.statut) ||
      REMATCH_BLOCKING_STATUSES.has(assignment.statut)
    ) {
      return;
    }

    if (desiredMatchIds.has(assignment.profilRenfordId)) {
      // Keep existing 'nouveau' or 'vu' entries as-is — don't reset 'vu' back to 'nouveau'
      return;
    }

    if (
      (assignment.statut === 'nouveau' || assignment.statut === 'vu') &&
      favoriteRenfordIds.has(assignment.profilRenfordId)
    ) {
      // Preserve manually proposed favorite opportunities even when they are
      // outside the latest ranked top-N.
      return;
    }

    // Only delete unconfirmed proposals ('nouveau' or 'vu') that are no longer matched
    if (assignment.statut === 'nouveau' || assignment.statut === 'vu') {
      writes.push(
        prisma.missionRenford.delete({
          where: { id: assignment.id },
        }),
      );
    }
  });

  rankedMatches.forEach((match) => {
    if (existingAssignments.has(match.profilRenfordId)) {
      return;
    }

    writes.push(
      prisma.missionRenford.create({
        data: {
          missionId: mission.id,
          profilRenfordId: match.profilRenfordId,
          statut: 'nouveau',
        },
      }),
    );
  });

  if (writes.length > 0) {
    await prisma.$transaction(writes);
  }

  if (newlyMatchedProfilRenfordIds.length > 0) {
    const createdAssignments = await prisma.missionRenford.findMany({
      where: {
        missionId: mission.id,
        profilRenfordId: { in: newlyMatchedProfilRenfordIds },
      },
      select: {
        id: true,
        missionId: true,
        profilRenford: {
          select: {
            utilisateur: {
              select: {
                email: true,
                prenom: true,
              },
            },
            utilisateurId: true,
          },
        },
      },
    });

    await createNotifications(
      createdAssignments.map((assignment) => ({
        utilisateurId: assignment.profilRenford.utilisateurId,
        source: 'mission_renfords',
        sourceId: assignment.id,
        titre: 'Nouvelle mission disponible',
        description: `Une mission ${getTypeMissionLabel(mission.specialitePrincipale)} chez ${mission.etablissement.nom} correspond à votre profil.`,
      })),
    );

    const { dateLabel, heureLabel } = formatDateTimeSlots(mission.PlageHoraireMission);
    const missionType = getTypeMissionLabel(mission.specialitePrincipale);
    const missionUrlBase = env.PLATFORM_URL.replace(/\/$/, '');

    await Promise.all(
      createdAssignments.map(async (assignment) => {
        const recipient = assignment.profilRenford.utilisateur;
        if (!recipient.email) {
          return;
        }

        const payload = getNewMissionRenfordEmail({
          prenomRenford: recipient.prenom,
          typeMission: missionType,
          lieu: `${mission.etablissement.ville}`,
          dateMission: dateLabel,
          heureMission: heureLabel,
          remuneration: formatMissionRemuneration(mission),
          missionUrl: `${missionUrlBase}/dashboard/renford/missions/${assignment.missionId}`,
        });

        try {
          await mail.sendMail({
            to: recipient.email,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
          });
        } catch (error) {
          logger.error(
            { err: error, missionId: mission.id, missionRenfordId: assignment.id },
            "Échec d'envoi de l'email de nouvelle mission au Renford",
          );
        }
      }),
    );
  }

  const result = {
    missionId: mission.id,
    totalEligible: rankedMatches.length,
    queued: rankedMatches.length,
    proposed: rankedMatches.length,
  };

  logger.info(
    result,
    result.proposed > 0
      ? '[🤝 matching] 🎯 syncMissionMatches DONE'
      : '[🤝 matching] syncMissionMatches DONE',
  );
  return result;
};

export const syncMissionMatchesForOpenMissions = async (): Promise<{
  processedMissions: number;
  matchedMissions: number;
  failedMissionIds: string[];
}> => {
  const missions = await prisma.mission.findMany({
    where: {
      statut: { in: ['en_recherche', 'remplacement_en_cours'] },
    },
    select: {
      id: true,
    },
  });

  let matchedMissions = 0;
  const failedMissionIds: string[] = [];

  for (const mission of missions) {
    try {
      const result = await syncMissionMatches(mission.id);
      if (result.totalEligible > 0) {
        matchedMissions += 1;
      }
    } catch (error) {
      failedMissionIds.push(mission.id);
      logger.error(
        { err: error, missionId: mission.id },
        'Mission matching failed during scheduler run',
      );
    }
  }

  return {
    processedMissions: missions.length,
    matchedMissions,
    failedMissionIds,
  };
};

export const registerMissionRenfordResponse = async (params: {
  missionId: string;
  profilRenfordId: string;
  response: 'selection_en_cours' | 'refuse_par_renford';
}): Promise<{
  missionRenfordId: string;
  statut: StatutMissionRenford;
}> => {
  const missionRenford = await prisma.missionRenford.findFirst({
    where: {
      missionId: params.missionId,
      profilRenfordId: params.profilRenfordId,
    },
    select: {
      id: true,
      statut: true,
      missionId: true,
    },
  });

  if (!missionRenford) {
    throw new Error('MISSION_RENFORD_NOT_FOUND');
  }

  if (missionRenford.statut !== 'nouveau' && missionRenford.statut !== 'vu') {
    throw new Error('MISSION_RENFORD_NOT_PROPOSED');
  }

  const nextStatus: StatutMissionRenford =
    params.response === 'selection_en_cours' ? 'selection_en_cours' : 'refuse_par_renford';
  const now = new Date();

  if (params.response === 'selection_en_cours') {
    const currentMaxOrder = await prisma.missionRenford.aggregate({
      where: {
        missionId: missionRenford.missionId,
        statut: 'selection_en_cours',
      },
      _max: { ordreShortlist: true },
    });

    const nextOrder = (currentMaxOrder._max.ordreShortlist ?? 0) + 1;

    await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: {
        statut: nextStatus,
        dateReponse: now,
        ordreShortlist: nextOrder,
      },
    });

    await prisma.mission.update({
      where: { id: missionRenford.missionId },
      data: {
        statut: 'candidatures_disponibles',
      },
    });

    const missionOwner = await prisma.mission.findUnique({
      where: { id: missionRenford.missionId },
      select: {
        id: true,
        modeMission: true,
        specialitePrincipale: true,
        missionsRenford: {
          where: { id: missionRenford.id },
          select: {
            profilRenford: {
              select: {
                titreProfil: true,
                utilisateur: {
                  select: {
                    prenom: true,
                  },
                },
              },
            },
          },
        },
        etablissement: {
          select: {
            nom: true,
            profilEtablissement: {
              select: {
                raisonSociale: true,
                utilisateurId: true,
                utilisateur: {
                  select: {
                    email: true,
                    prenom: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (missionOwner?.etablissement.profilEtablissement.utilisateurId) {
      await createNotification({
        utilisateurId: missionOwner.etablissement.profilEtablissement.utilisateurId,
        source: 'missions',
        sourceId: missionOwner.id,
        titre: 'Un Renford a accepté votre mission',
        description: `Un candidat a accepté votre mission ${getTypeMissionLabel(missionOwner.specialitePrincipale)}.`,
      });

      const etablissementUser = missionOwner.etablissement.profilEtablissement.utilisateur;
      const renfordSummary = missionOwner.missionsRenford[0]?.profilRenford;
      const renfordFirstName = renfordSummary?.utilisateur.prenom || 'Un Renford';
      const renfordProfileResume = renfordSummary?.titreProfil
        ? `${renfordSummary.titreProfil}.`
        : 'Son profil est aligné avec vos attentes.';

      if (etablissementUser.email) {
        const missionUrlBase = env.PLATFORM_URL.replace(/\/$/, '');

        const emailPayload =
          missionOwner.modeMission === 'coach'
            ? getRenfordTrouveCoachEmail({
                prenomEtablissement: etablissementUser.prenom,
                typeMission: getTypeMissionLabel(missionOwner.specialitePrincipale),
                nombreProfilsProposes: 1,
                profilsSummary: [`${renfordFirstName} — ${renfordProfileResume}`],
                espaceRenfordUrl: `${missionUrlBase}/dashboard/etablissement/missions/${missionOwner.id}`,
                lienPaiementUrl: `${missionUrlBase}/dashboard/etablissement/paiement`,
              })
            : getRenfordTrouveFlexEmail({
                prenomEtablissement: etablissementUser.prenom,
                prenomRenford: renfordFirstName,
                profilRenfordResume: renfordProfileResume,
                espaceCompteUrl: `${missionUrlBase}/dashboard/etablissement/missions/${missionOwner.id}`,
                paiementUrl: `${missionUrlBase}/dashboard/etablissement/paiement`,
              });

        try {
          await mail.sendMail({
            to: etablissementUser.email,
            subject: emailPayload.subject,
            html: emailPayload.html,
            text: emailPayload.text,
          });
        } catch (error) {
          logger.error(
            { err: error, missionId: missionOwner.id, missionRenfordId: missionRenford.id },
            "Échec d'envoi de l'email 'Renford trouvé' à l'établissement",
          );
        }
      }
    }
  } else {
    await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: {
        statut: nextStatus,
        dateReponse: now,
        ordreShortlist: null,
      },
    });

    const refreshResult = await syncMissionMatches(missionRenford.missionId);
    if (refreshResult.proposed === 0) {
      logger.info({ missionId: missionRenford.missionId }, 'No new matches found after refusal');
    }
  }

  return {
    missionRenfordId: missionRenford.id,
    statut: nextStatus,
  };
};

export const registerEtablissementMissionRenfordResponse = async (params: {
  missionId: string;
  missionRenfordId: string;
  response: 'attente_de_signature' | 'refuse_par_etablissement';
}): Promise<{
  missionRenfordId: string;
  statut: StatutMissionRenford;
}> => {
  const missionRenford = await prisma.missionRenford.findFirst({
    where: {
      id: params.missionRenfordId,
      missionId: params.missionId,
    },
    select: {
      id: true,
      missionId: true,
      statut: true,
    },
  });

  if (!missionRenford) {
    throw new Error('MISSION_RENFORD_NOT_FOUND');
  }

  const mission = await prisma.mission.findUnique({
    where: { id: missionRenford.missionId },
    select: { statut: true },
  });

  if (!mission) {
    throw new Error('MISSION_NOT_FOUND');
  }

  if (params.response === 'attente_de_signature') {
    if (missionRenford.statut !== 'selection_en_cours') {
      throw new Error('MISSION_RENFORD_NOT_FOUND');
    }

    const selectedAssignment = await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: {
        statut: 'attente_de_signature',
        ordreShortlist: null,
      },
      select: {
        missionId: true,
        mission: {
          select: {
            modeMission: true,
            specialitePrincipale: true,
            etablissement: {
              select: {
                profilEtablissement: {
                  select: {
                    raisonSociale: true,
                    utilisateur: { select: { email: true, prenom: true } },
                  },
                },
              },
            },
          },
        },
        profilRenford: {
          select: {
            utilisateur: {
              select: {
                email: true,
                prenom: true,
              },
            },
            utilisateurId: true,
          },
        },
      },
    });

    await prisma.mission.update({
      where: { id: missionRenford.missionId },
      data: {
        statut: 'attente_de_signature',
      },
    });

    await createNotification({
      utilisateurId: selectedAssignment.profilRenford.utilisateurId,
      source: 'missions',
      sourceId: selectedAssignment.missionId,
      titre: 'Votre candidature est retenue',
      description: "L'établissement a retenu votre candidature. Signature du contrat requise.",
    });

    const renfordUser = selectedAssignment.profilRenford.utilisateur;
    const missionUrlBase = env.PLATFORM_URL.replace(/\/$/, '');
    const etabProfile = selectedAssignment.mission.etablissement?.profilEtablissement;

    if (renfordUser.email) {
      // Send "contrat à signer" email to renford
      const contratPayload = getContratASignerRenfordEmail({
        prenomRenford: renfordUser.prenom,
        raisonSociale: etabProfile?.raisonSociale ?? '',
        modeMission: selectedAssignment.mission.modeMission,
        espaceUrl: `${missionUrlBase}/dashboard/renford/missions/${selectedAssignment.missionId}`,
      });

      try {
        await mail.sendMail({
          to: renfordUser.email,
          subject: contratPayload.subject,
          html: contratPayload.html,
          text: contratPayload.text,
        });
      } catch (error) {
        logger.error(
          {
            err: error,
            missionId: selectedAssignment.missionId,
            missionRenfordId: missionRenford.id,
          },
          "Échec d'envoi de l'email contrat à signer au Renford",
        );
      }
    }

    // Send "profil accepté" email to établissement (coach mode only)
    if (selectedAssignment.mission.modeMission === 'coach' && etabProfile?.utilisateur?.email) {
      const profilPayload = getProfilAccepteEtablissementCoachEmail({
        prenomEtablissement: etabProfile.utilisateur.prenom,
        prenomRenford: renfordUser.prenom,
        espaceUrl: `${missionUrlBase}/dashboard/etablissement/missions/${selectedAssignment.missionId}`,
      });

      try {
        await mail.sendMail({
          to: etabProfile.utilisateur.email,
          subject: profilPayload.subject,
          html: profilPayload.html,
          text: profilPayload.text,
        });
      } catch (error) {
        logger.error(
          {
            err: error,
            missionId: selectedAssignment.missionId,
          },
          "Échec d'envoi de l'email profil accepté à l'établissement",
        );
      }
    }
  } else {
    if (!['selection_en_cours', 'attente_de_signature'].includes(missionRenford.statut)) {
      throw new Error('MISSION_RENFORD_NOT_FOUND');
    }

    if (
      [
        'mission_en_cours',
        'remplacement_en_cours',
        'en_litige',
        'mission_terminee',
        'archivee',
      ].includes(mission.statut)
    ) {
      throw new Error('MISSION_ALREADY_STARTED');
    }

    await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: {
        statut: 'refuse_par_etablissement',
        ordreShortlist: null,
      },
    });

    await normalizeSelectionOrdering(missionRenford.missionId);

    const remainingInQueue = await prisma.missionRenford.count({
      where: {
        missionId: missionRenford.missionId,
        statut: 'selection_en_cours',
      },
    });

    if (remainingInQueue === 0) {
      await prisma.mission.update({
        where: { id: missionRenford.missionId },
        data: {
          statut: 'en_recherche',
        },
      });
    } else {
      await prisma.mission.update({
        where: { id: missionRenford.missionId },
        data: {
          statut: 'candidatures_disponibles',
        },
      });
    }

    // Send rejection email to the renford
    const rejectedRenford = await prisma.missionRenford.findUnique({
      where: { id: missionRenford.id },
      select: {
        mission: {
          select: {
            specialitePrincipale: true,
            etablissement: {
              select: {
                nom: true,
                ville: true,
                profilEtablissement: { select: { raisonSociale: true } },
              },
            },
          },
        },
        profilRenford: {
          select: {
            utilisateur: { select: { email: true, prenom: true } },
          },
        },
      },
    });

    if (rejectedRenford) {
      const renfordUser = rejectedRenford.profilRenford.utilisateur;
      if (renfordUser.email) {
        const etab = rejectedRenford.mission.etablissement;
        const villeRaisonSociale =
          etab.profilEtablissement.raisonSociale || etab.nom || etab.ville || '';

        const payload = getProfilNonRetenuRenfordEmail({
          prenomRenford: renfordUser.prenom,
          typeMission: getTypeMissionLabel(rejectedRenford.mission.specialitePrincipale),
          villeRaisonSociale,
        });

        mail
          .sendMail({
            to: renfordUser.email,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
          })
          .catch((err) =>
            logger.error(
              { err, missionRenfordId: missionRenford.id },
              "Échec d'envoi de l'email de refus au Renford",
            ),
          );
      }
    }
  }

  return {
    missionRenfordId: missionRenford.id,
    statut: params.response,
  };
};
