export const MES_RENFORDS_TAB = ["favoris", "derniers", "filleuls"] as const;

export const MES_RENFORDS_TAB_LABELS: Record<
  (typeof MES_RENFORDS_TAB)[number],
  string
> = {
  favoris: "Mes favoris",
  derniers: "Mes derniers Renfords",
  filleuls: "Mes filleuls",
};
