import { z } from "zod";
import { NIVEAU_EXPERIENCE } from "./profil-renford";

// Mode de mission
export const MODE_MISSION = ["flex", "coach"] as const;

// Labels pour les modes de mission
export const MODE_MISSION_LABELS: Record<
  (typeof MODE_MISSION)[number],
  string
> = {
  flex: "Flex (missions express/ponctuelles)",
  coach: "Coach (missions longue durée)",
};

// Statut de mission
export const STATUT_MISSION = [
  "envoyee",
  "en_cours_de_matching",
  "proposee",
  "acceptee",
  "contrat_signe",
  "payee",
  "en_cours",
  "a_valider",
  "validee",
  "terminee",
  "archivee",
  "annulee",
] as const;

// Labels pour les statuts de mission
export const STATUT_MISSION_LABELS: Record<
  (typeof STATUT_MISSION)[number],
  string
> = {
  envoyee: "Envoyée",
  en_cours_de_matching: "En cours de matching",
  proposee: "Proposée",
  acceptee: "Acceptée",
  contrat_signe: "Contrat signé",
  payee: "Payée",
  en_cours: "En cours",
  a_valider: "À valider",
  validee: "Validée",
  terminee: "Terminée",
  archivee: "Archivée",
  annulee: "Annulée",
};

// Méthode de tarification
export const METHODE_TARIFICATION = [
  "horaire",
  "forfait",
  "degressif",
] as const;

// Labels pour les méthodes de tarification
export const METHODE_TARIFICATION_LABELS: Record<
  (typeof METHODE_TARIFICATION)[number],
  string
> = {
  horaire: "Tarif horaire",
  forfait: "Forfait",
  degressif: "Tarif dégressif",
};

// Tranche de tarif horaire
export const TRANCHE_TARIF_HORAIRE = [
  "moins_de_45",
  "entre_45_et_59",
  "plus_de_60",
] as const;

// Labels pour les tranches de tarif horaire
export const TRANCHE_TARIF_HORAIRE_LABELS: Record<
  (typeof TRANCHE_TARIF_HORAIRE)[number],
  string
> = {
  moins_de_45: "Moins de 45€/h",
  entre_45_et_59: "Entre 45€ et 59€/h",
  plus_de_60: "60€/h et plus",
};

// Statut mission-renford
export const STATUT_MISSION_RENFORD = [
  "propose",
  "accepte",
  "refuse",
  "shortliste",
  "selectionne",
  "contrat_envoye",
  "contrat_signe",
  "en_cours",
  "termine",
  "annule",
] as const;

// Labels pour les statuts mission-renford
export const STATUT_MISSION_RENFORD_LABELS: Record<
  (typeof STATUT_MISSION_RENFORD)[number],
  string
> = {
  propose: "Proposé",
  accepte: "Accepté",
  refuse: "Refusé",
  shortliste: "Shortlisté",
  selectionne: "Sélectionné",
  contrat_envoye: "Contrat envoyé",
  contrat_signe: "Contrat signé",
  en_cours: "En cours",
  termine: "Terminé",
  annule: "Annulé",
};

// Création mission - Étape 1
export const createMissionStep1Schema = z.object({
  modeMission: z.enum(MODE_MISSION, {
    required_error: "Veuillez sélectionner un type de mission",
  }),
});

export type CreateMissionStep1Schema = z.infer<typeof createMissionStep1Schema>;

export const DISCIPLINE_MISSION = [
  "pilates",
  "yoga",
  "fitness_musculation",
  "programmes_les_mills",
  "zumba",
  "animation_sportive_multisport",
  "escalade",
  "boxe_arts_martiaux",
  "danse",
  "bien_etre_sport_sante",
] as const;

export const DISCIPLINE_MISSION_LABELS: Record<
  (typeof DISCIPLINE_MISSION)[number],
  string
> = {
  pilates: "Pilates",
  yoga: "Yoga",
  fitness_musculation: "Fitness & Musculation",
  programmes_les_mills: "Programmes les mills",
  zumba: "Zumba",
  animation_sportive_multisport: "Animation sportive & Multisport",
  escalade: "Escalade",
  boxe_arts_martiaux: "Boxe & Arts martiaux",
  danse: "Danse",
  bien_etre_sport_sante: "Bien-être & Sport santé",
};

export const SPECIALITES_BY_DISCIPLINE: Record<
  (typeof DISCIPLINE_MISSION)[number],
  string[]
> = {
  pilates: [
    "Matwork",
    "Reformer",
    "Hot Pilates",
    "Cadillac",
    "Chair (Wunda Chair)",
    "Petits matériels",
    "Pilates prénatal / postnatal",
    "Lagree Fitness",
  ],
  yoga: [
    "Hatha Yoga",
    "Vinyasa Yoga",
    "Ashtanga Yoga",
    "Yin Yoga",
    "Hot Yoga",
    "Kundalini Yoga",
    "Yoga prénatal / postnatal",
    "Yoga Nidra",
    "Yoga Flow",
    "Qi Gong / Tai Chi",
  ],
  fitness_musculation: [
    "CAF (Cuisses Abdos Fessiers)",
    "LIA (Low Impact Aerobic)",
    "Step",
    "HIIT",
    "Circuit training",
    "Cross Training / CrossFit",
    "TRX",
    "Biking / Spinning",
    "Body barre",
    "Stretching / Mobilité",
    "Cardio Boxing",
    "Bootcamp",
    "Gym posturale / dos",
    "EMS (Électrostimulation)",
    "Préparation Physique Générale",
  ],
  programmes_les_mills: [
    "Body Pump",
    "Body Attack",
    "Body Combat",
    "Body Step",
    "Body Balance",
    "Body Jam",
    "RPM",
  ],
  zumba: [
    "Zumba classique",
    "Zumba® Kids",
    "Strong Toning®",
    "Zumba® Step",
    "Zumba® Gold",
    "Zumba Sentoa",
    "Zumba In The Circuit",
    "Zumba Strong",
    "Aqua Zumba®",
  ],
  animation_sportive_multisport: [
    "Éducateur sportif multisport",
    "Animateur sportif (enfants / ados)",
    "Intervenant scolaire / EPS",
    "Animateur sport santé / seniors / APA",
    "Animateur aquatique",
    "Hôte / Hôtesse d’accueil sportif",
  ],
  escalade: [
    "Encadrement en salle (bloc / voie)",
    "Encadrement en milieu naturel",
    "Ouvreur de voies / blocs",
    "Encadrement Escalade (performance)",
    "Cours enfants / ados",
    "Initiation / loisirs adultes",
  ],
  boxe_arts_martiaux: [
    "Boxe anglaise",
    "Boxe française / Savate",
    "Kickboxing",
    "Karaté",
    "Judo",
    "MMA",
    "Muay Thaï",
    "Boxe éducative (enfants / ados)",
    "Cardio Boxe / Boxe fitness",
    "Coaching boxe (loisir ou compétiteur)",
  ],
  danse: [
    "Danse classique",
    "Danse contemporaine",
    "Jazz / Modern Jazz",
    "Hip Hop / Street Dance",
    "Ragga Dancehall",
    "Danses latines (salsa, bachata…)",
    "Danse africaine",
    "Danse enfants",
    "Barre au sol",
  ],
  bien_etre_sport_sante: [
    "Massages bien-être / sportifs",
    "Kinésithérapie sportive (hors acte médical)",
    "Massage deep tissue / récupération",
    "Réflexologie",
    "Relaxation / cohérence cardiaque",
    "Sonothérapie / Bains sonores",
    "Sophrologie",
    "Méditation / pleine conscience",
    "Stretch & mobilité douce",
    "Cryothérapie / pressothérapie",
    "Nutrition / diététique",
    "Préparation mentale",
  ],
};

export const NIVEAU_EXPERIENCE_MISSION = [
  "peu_importe",
  ...NIVEAU_EXPERIENCE,
] as const;

export const MATERIELS_MISSION = [
  "tapis",
  "haltères",
  "kettlebell",
  "elastiques",
  "medecine_ball",
  "velo_indoor",
  "barre",
  "autre",
] as const;

export const createMissionStep2Schema = z.object({
  discipline: z.enum(DISCIPLINE_MISSION, {
    required_error: "Veuillez sélectionner une discipline",
  }),
  niveauExperienceRequis: z.enum(NIVEAU_EXPERIENCE_MISSION, {
    required_error: "Veuillez sélectionner un niveau d'expérience",
  }),
  assuranceObligatoire: z.boolean().default(false),
  materielsRequis: z.array(z.enum(MATERIELS_MISSION)).default([]),
  detailMission: z
    .string()
    .max(1000, "Le détail supplémentaire ne peut pas dépasser 1000 caractères")
    .optional()
    .or(z.literal("")),
  specialitePrincipale: z
    .string()
    .min(1, "Veuillez sélectionner une spécialité principale"),
  specialitesSecondaires: z.array(z.string()).default([]),
});

export type CreateMissionStep2Schema = z.infer<typeof createMissionStep2Schema>;
