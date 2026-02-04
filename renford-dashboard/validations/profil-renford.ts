// Statut de certification
export const STATUT_CERTIFICATION = [
  "en_attente",
  "certifie",
  "rejete",
] as const;

// Niveau d'expérience
export const NIVEAU_EXPERIENCE = ["debutant", "confirme", "expert"] as const;

// Labels pour le niveau d'expérience
export const NIVEAU_EXPERIENCE_LABELS: Record<
  (typeof NIVEAU_EXPERIENCE)[number],
  string
> = {
  debutant: "Débutant (moins de 2 ans)",
  confirme: "Confirmé (5 à 10 ans)",
  expert: "Expert (plus de 10 ans)",
};

// Jours de la semaine
export const JOUR_SEMAINE = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

// Labels pour les jours
export const JOUR_SEMAINE_LABELS: Record<
  (typeof JOUR_SEMAINE)[number],
  string
> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  dimanche: "Dimanche",
};

// Types de poste
export const TYPE_POSTE = [
  "pilates",
  "yoga",
  "fitness_musculation",
  "escalade",
  "boxe",
  "danse",
  "gymnastique",
  "tennis",
  "apa",
] as const;

// Labels pour les types de poste
export const TYPE_POSTE_LABELS: Record<(typeof TYPE_POSTE)[number], string> = {
  pilates: "Pilates",
  yoga: "Yoga",
  fitness_musculation: "Fitness / Musculation",
  escalade: "Escalade",
  boxe: "Boxe",
  danse: "Danse",
  gymnastique: "Gymnastique",
  tennis: "Tennis",
  apa: "Activité Physique Adaptée (APA)",
};
