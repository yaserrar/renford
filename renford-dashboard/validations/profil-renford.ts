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

export const DIPLOME_KEYS = [
  "licence_sciences_et_techniques_des_activites_physiques_et_sportives",
  "master_sciences_et_techniques_des_activites_physiques_et_sportives",
  "doctorat_en_sciences_du_sport",
  "brevet_professionnel_de_la_jeunesse_de_l_education_populaire_et_du_sport",
  "diplome_d_etat_de_la_jeunesse_de_l_education_populaire_et_du_sport",
  "diplome_d_etat_superieur_de_la_jeunesse_de_l_education_populaire_et_du_sport",
  "certificat_de_qualification_professionnelle",
  "brevet_federal",
  "brevet_d_etat_d_educateur_sportif",
  "certificat_d_aptitude_a_l_enseignement_de_la_danse",
  "diplome_d_etat_de_masseur_kinesitherapeute",
  "diplome_de_preparateur_physique",
] as const;

export type DiplomeKey = (typeof DIPLOME_KEYS)[number];

export const DIPLOME_LABELS: Record<DiplomeKey, string> = {
  licence_sciences_et_techniques_des_activites_physiques_et_sportives:
    "Licence Sciences et Techniques des Activités Physiques et Sportives",
  master_sciences_et_techniques_des_activites_physiques_et_sportives:
    "Master Sciences et Techniques des Activités Physiques et Sportives",
  doctorat_en_sciences_du_sport: "Doctorat en Sciences du Sport",
  brevet_professionnel_de_la_jeunesse_de_l_education_populaire_et_du_sport:
    "Brevet Professionnel de la Jeunesse, de l’Éducation Populaire et du Sport",
  diplome_d_etat_de_la_jeunesse_de_l_education_populaire_et_du_sport:
    "Diplôme d’État de la Jeunesse, de l’Éducation Populaire et du Sport",
  diplome_d_etat_superieur_de_la_jeunesse_de_l_education_populaire_et_du_sport:
    "Diplôme d’État Supérieur de la Jeunesse, de l’Éducation Populaire et du Sport",
  certificat_de_qualification_professionnelle:
    "Certificat de Qualification Professionnelle",
  brevet_federal: "Brevet Fédéral",
  brevet_d_etat_d_educateur_sportif: "Brevet d’État d’Éducateur Sportif",
  certificat_d_aptitude_a_l_enseignement_de_la_danse:
    "Certificat d’Aptitude à l’Enseignement de la Danse",
  diplome_d_etat_de_masseur_kinesitherapeute:
    "Diplôme d’État de Masseur-Kinésithérapeute",
  diplome_de_preparateur_physique: "Diplôme de Préparateur Physique",
};

// Créneaux horaires pour les disponibilités
export const CRENEAUX_HORAIRES = [
  { debut: "06:00", fin: "09:00" },
  { debut: "09:00", fin: "12:00" },
  { debut: "12:00", fin: "14:00" },
  { debut: "14:00", fin: "18:00" },
  { debut: "18:00", fin: "21:00" },
] as const;
