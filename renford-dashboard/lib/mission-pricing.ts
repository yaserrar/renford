import { PLATFORM_COMMISSION_PERCENT } from "@/lib/env";

type PricingSlot = {
  date: Date | string;
  heureDebut: string;
  heureFin: string;
};

type ComputeMissionPricingInput = {
  plagesHoraires: PricingSlot[];
  methodeTarification: "horaire" | "journee" | "demi_journee";
  tarif?: number | null;
  commissionPercent?: number;
};

export type MissionPricingBreakdown = {
  totalUnites: number;
  montantHT: number;
  montantFraisService: number;
  montantTTC: number;
};

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const timeToMinutes = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);

  if (
    hour === undefined ||
    minute === undefined ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  return hour * 60 + minute;
};

const getHoraireUnits = (plagesHoraires: PricingSlot[]) => {
  const totalHours = plagesHoraires.reduce((acc, slot) => {
    const start = timeToMinutes(slot.heureDebut);
    const end = timeToMinutes(slot.heureFin);

    if (start === null || end === null || end <= start) {
      return acc;
    }

    return acc + (end - start) / 60;
  }, 0);

  return Math.max(totalHours, 1);
};

const getJourneeUnits = (plagesHoraires: PricingSlot[]) => {
  const uniqueDates = new Set(
    plagesHoraires
      .map((slot) => {
        const parsed = new Date(slot.date);
        return Number.isNaN(parsed.getTime()) ? null : parsed.toDateString();
      })
      .filter((value): value is string => Boolean(value)),
  );

  return Math.max(uniqueDates.size, 1);
};

const getDemiJourneeUnits = (plagesHoraires: PricingSlot[]) => {
  return Math.max(plagesHoraires.length, 1);
};

export const computeMissionPricing = ({
  plagesHoraires,
  methodeTarification,
  tarif,
  commissionPercent = PLATFORM_COMMISSION_PERCENT,
}: ComputeMissionPricingInput): MissionPricingBreakdown => {
  const normalizedTarif = Number(tarif ?? 0);
  const normalizedCommissionPercent = Number(commissionPercent);

  const safeTarif =
    Number.isFinite(normalizedTarif) && normalizedTarif > 0
      ? normalizedTarif
      : 0;
  const safeCommissionPercent =
    Number.isFinite(normalizedCommissionPercent) &&
    normalizedCommissionPercent >= 0
      ? normalizedCommissionPercent
      : 0;

  let totalUnites = 1;

  if (methodeTarification === "horaire") {
    totalUnites = getHoraireUnits(plagesHoraires);
  } else if (methodeTarification === "journee") {
    totalUnites = getJourneeUnits(plagesHoraires);
  } else {
    totalUnites = getDemiJourneeUnits(plagesHoraires);
  }

  const montantHT = roundCurrency(safeTarif * totalUnites);
  const montantFraisService = roundCurrency(
    montantHT * (safeCommissionPercent / 100),
  );
  const montantTTC = roundCurrency(montantHT * 1.2);

  return {
    totalUnites,
    montantHT,
    montantFraisService,
    montantTTC,
  };
};
