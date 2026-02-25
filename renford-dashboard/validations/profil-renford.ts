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

// Type de mission
export const TYPE_MISSION = [
  "coaching_individuel",
  "sessions_en_groupe",
  "ateliers_workshops",
  "evenements_speciaux",
  "remplacement_temporaire",
  "consultation_accompagnement",
  "programmes_specifiques",
  "encadrement_enfants_adolescents",
  "formation_certification",
  "maintenance_gestion_equipements",
  "suivi_evaluation_clients",
  "encadrement_competitions",
  "animation_activites_loisirs",
  "seances_initiation",
  "consulting_amelioration_performances",
] as const;
export type TypeMission = (typeof TYPE_MISSION)[number];

export const TYPE_MISSION_LABELS: Record<TypeMission, string> = {
  coaching_individuel: "Coaching Individuel",
  sessions_en_groupe: "Sessions en Groupe",
  ateliers_workshops: "Ateliers et Workshops",
  evenements_speciaux: "Événements Spéciaux",
  remplacement_temporaire: "Remplacement Temporaire",
  consultation_accompagnement: "Consultation et Accompagnement",
  programmes_specifiques: "Programmes Spécifiques",
  encadrement_enfants_adolescents: "Encadrement d’Enfants et d’Adolescents",
  formation_certification: "Formation et Certification",
  maintenance_gestion_equipements: "Maintenance et Gestion des Équipements",
  suivi_evaluation_clients: "Suivi et Évaluation des Clients",
  encadrement_competitions: "Encadrement de Compétitions",
  animation_activites_loisirs: "Animation d’activités de loisirs",
  seances_initiation: "Séances d’initiation",
  consulting_amelioration_performances:
    "Consulting en Amélioration des Performances",
};

// Créneaux horaires pour les disponibilités
export const CRENEAUX_HORAIRES = [
  { debut: "06:00", fin: "09:00" },
  { debut: "09:00", fin: "12:00" },
  { debut: "12:00", fin: "14:00" },
  { debut: "14:00", fin: "18:00" },
  { debut: "18:00", fin: "21:00" },
] as const;
