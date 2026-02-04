// Type d'évaluation
export const TYPE_EVALUATION = [
  "etablissement_vers_renford",
  "renford_vers_etablissement",
] as const;

// Labels pour les types d'évaluation
export const TYPE_EVALUATION_LABELS: Record<
  (typeof TYPE_EVALUATION)[number],
  string
> = {
  etablissement_vers_renford: "Évaluation de l'établissement vers le Renford",
  renford_vers_etablissement: "Évaluation du Renford vers l'établissement",
};

// Qualité de service
export const QUALITE_SERVICE = [
  "excellent",
  "tres_bien",
  "bien",
  "moyen",
  "mediocre",
] as const;

// Labels pour la qualité de service
export const QUALITE_SERVICE_LABELS: Record<
  (typeof QUALITE_SERVICE)[number],
  string
> = {
  excellent: "Excellent",
  tres_bien: "Très bien",
  bien: "Bien",
  moyen: "Moyen",
  mediocre: "Médiocre",
};
