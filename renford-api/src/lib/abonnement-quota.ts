import prisma from '../config/prisma';

/**
 * Counts how many missions an établissement (profil) has created
 * during the current billing period of their active subscription.
 *
 * The "month" is defined as the subscription billing period
 * (stripeCurrentPeriodStart → stripeCurrentPeriodEnd), NOT a calendar month.
 * This way a subscriber who starts on the 15th gets a full billing cycle.
 *
 * If no active subscription or no billing period dates are available,
 * falls back to calendar month (1st of current month → now).
 */
export async function getMissionsCreatedInCurrentPeriod(
  profilEtablissementId: string,
): Promise<{ count: number; periodStart: Date; periodEnd: Date }> {
  // 1. Find active subscription with billing period dates
  const abonnement = await prisma.abonnement.findFirst({
    where: {
      profilEtablissementId,
      statut: 'actif',
    },
    select: {
      stripeCurrentPeriodStart: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  // 2. Determine period boundaries
  let periodStart: Date;
  let periodEnd: Date;

  if (abonnement?.stripeCurrentPeriodStart && abonnement?.stripeCurrentPeriodEnd) {
    // Use subscription billing period
    periodStart = abonnement.stripeCurrentPeriodStart;
    periodEnd = abonnement.stripeCurrentPeriodEnd;
  } else {
    // Fallback: calendar month (1st of current month → end of month)
    const now = new Date();
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  // 3. Get all établissement IDs linked to this profil
  const etablissements = await prisma.etablissement.findMany({
    where: { profilEtablissementId },
    select: { id: true },
  });

  const etablissementIds = etablissements.map((e) => e.id);

  if (etablissementIds.length === 0) {
    return { count: 0, periodStart, periodEnd };
  }

  // 4. Count missions created during the billing period
  const count = await prisma.mission.count({
    where: {
      etablissementId: { in: etablissementIds },
      dateCreation: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
  });

  return { count, periodStart, periodEnd };
}

/**
 * Checks whether an établissement has exceeded (or reached) its mission quota
 * for the current billing period.
 *
 * Returns:
 * - `hasSubscription`: whether an active subscription exists
 * - `exceeded`: true if the quota has been reached or exceeded
 * - `remaining`: how many missions are left (0 if exceeded, Infinity if unlimited)
 * - `quotaMissions`: total quota from the plan (0 = unlimited)
 * - `missionsCreated`: actual count this period
 */
export async function checkQuotaExceeded(profilEtablissementId: string): Promise<{
  hasSubscription: boolean;
  exceeded: boolean;
  remaining: number;
  quotaMissions: number;
  missionsCreated: number;
  plan: string | null;
}> {
  // 1. Find active subscription
  const abonnement = await prisma.abonnement.findFirst({
    where: {
      profilEtablissementId,
      statut: 'actif',
    },
    select: {
      plan: true,
      quotaMissions: true,
      stripeCurrentPeriodStart: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!abonnement) {
    return {
      hasSubscription: false,
      exceeded: false,
      remaining: Infinity,
      quotaMissions: 0,
      missionsCreated: 0,
      plan: null,
    };
  }

  // 2. Count actual missions created this period
  const { count } = await getMissionsCreatedInCurrentPeriod(profilEtablissementId);

  // 3. Unlimited plan (competition) — quotaMissions === 0
  if (abonnement.quotaMissions === 0) {
    return {
      hasSubscription: true,
      exceeded: false,
      remaining: Infinity,
      quotaMissions: 0,
      missionsCreated: count,
      plan: abonnement.plan,
    };
  }

  // 4. Check against quota
  const exceeded = count >= abonnement.quotaMissions;
  const remaining = Math.max(0, abonnement.quotaMissions - count);

  return {
    hasSubscription: true,
    exceeded,
    remaining,
    quotaMissions: abonnement.quotaMissions,
    missionsCreated: count,
    plan: abonnement.plan,
  };
}
