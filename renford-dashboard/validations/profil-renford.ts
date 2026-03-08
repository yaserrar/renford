import { z } from "zod";

// Statut de certification
export const STATUT_CERTIFICATION = [
  "en_attente",
  "certifie",
  "rejete",
] as const;

// Niveau d'expérience
export const NIVEAU_EXPERIENCE = ["debutant", "confirme", "expert"] as const;

export const JOUR_SEMAINE = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

// Labels pour le niveau d'expérience
export const NIVEAU_EXPERIENCE_LABELS: Record<
  (typeof NIVEAU_EXPERIENCE)[number],
  string
> = {
  debutant: "Débutant (moins de 2 ans)",
  confirme: "Confirmé (5 à 10 ans)",
  expert: "Expert (plus de 10 ans)",
};

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
  "matwork",
  "reformer",
  "hot_pilates",
  "cadillac",
  "chair_wunda_chair",
  "petits_materiels",
  "pilates_prenatal_postnatal",
  "lagree_fitness",
  "hatha_yoga",
  "vinyasa_yoga",
  "ashtanga_yoga",
  "yin_yoga",
  "hot_yoga",
  "kundalini_yoga",
  "yoga_prenatal_postnatal",
  "yoga_nidra",
  "yoga_flow",
  "qi_gong_tai_chi",
  "caf_cuisses_abdos_fessiers",
  "lia_low_impact_aerobic",
  "step",
  "hiit",
  "circuit_training",
  "cross_training_crossfit",
  "trx",
  "biking_spinning",
  "body_barre",
  "stretching_mobilite",
  "cardio_boxing",
  "bootcamp",
  "gym_posturale_dos",
  "ems_electrostimulation",
  "preparation_physique_generale",
  "body_pump",
  "body_attack",
  "body_combat",
  "body_step",
  "body_balance",
  "body_jam",
  "rpm",
  "zumba_classique",
  "zumba_kids",
  "strong_toning",
  "zumba_step",
  "zumba_gold",
  "zumba_sentoa",
  "zumba_in_the_circuit",
  "zumba_strong",
  "aqua_zumba",
  "educateur_sportif_multisport",
  "animateur_sportif_enfants_ados",
  "intervenant_scolaire_eps",
  "animateur_sport_sante_seniors_apa",
  "animateur_aquatique",
  "hote_hotesse_d_accueil_sportif",
  "encadrement_en_salle_bloc_voie",
  "encadrement_en_milieu_naturel",
  "ouvreur_de_voies_blocs",
  "encadrement_escalade_performance",
  "cours_enfants_ados",
  "initiation_loisirs_adultes",
  "boxe_anglaise",
  "boxe_francaise_savate",
  "kickboxing",
  "karate",
  "judo",
  "mma",
  "muay_thai",
  "boxe_educative_enfants_ados",
  "cardio_boxe_boxe_fitness",
  "coaching_boxe_loisir_ou_competiteur",
  "danse_classique",
  "danse_contemporaine",
  "jazz_modern_jazz",
  "hip_hop_street_dance",
  "ragga_dancehall",
  "danses_latines_salsa_bachata",
  "danse_africaine",
  "danse_enfants",
  "barre_au_sol",
  "massages_bien_etre_sportifs",
  "kinesitherapie_sportive_hors_acte_medical",
  "massage_deep_tissue_recuperation",
  "reflexologie",
  "relaxation_coherence_cardiaque",
  "sonotherapie_bains_sonores",
  "sophrologie",
  "meditation_pleine_conscience",
  "stretch_and_mobilite_douce",
  "cryotherapie_pressotherapie",
  "nutrition_dietetique",
  "preparation_mentale",
] as const;
export type TypeMission = (typeof TYPE_MISSION)[number];

export const TYPE_MISSION_LABELS: Record<TypeMission, string> = {
  matwork: "Matwork",
  reformer: "Reformer",
  hot_pilates: "Hot Pilates",
  cadillac: "Cadillac",
  chair_wunda_chair: "Chair (Wunda Chair)",
  petits_materiels: "Petits matériels",
  pilates_prenatal_postnatal: "Pilates prénatal / postnatal",
  lagree_fitness: "Lagree Fitness",
  hatha_yoga: "Hatha Yoga",
  vinyasa_yoga: "Vinyasa Yoga",
  ashtanga_yoga: "Ashtanga Yoga",
  yin_yoga: "Yin Yoga",
  hot_yoga: "Hot Yoga",
  kundalini_yoga: "Kundalini Yoga",
  yoga_prenatal_postnatal: "Yoga prénatal / postnatal",
  yoga_nidra: "Yoga Nidra",
  yoga_flow: "Yoga Flow",
  qi_gong_tai_chi: "Qi Gong / Tai Chi",
  caf_cuisses_abdos_fessiers: "CAF (Cuisses Abdos Fessiers)",
  lia_low_impact_aerobic: "LIA (Low Impact Aerobic)",
  step: "Step",
  hiit: "HIIT",
  circuit_training: "Circuit training",
  cross_training_crossfit: "Cross Training / CrossFit",
  trx: "TRX",
  biking_spinning: "Biking / Spinning",
  body_barre: "Body barre",
  stretching_mobilite: "Stretching / Mobilité",
  cardio_boxing: "Cardio Boxing",
  bootcamp: "Bootcamp",
  gym_posturale_dos: "Gym posturale / dos",
  ems_electrostimulation: "EMS (Électrostimulation)",
  preparation_physique_generale: "Préparation Physique Générale",
  body_pump: "Body Pump",
  body_attack: "Body Attack",
  body_combat: "Body Combat",
  body_step: "Body Step",
  body_balance: "Body Balance",
  body_jam: "Body Jam",
  rpm: "RPM",
  zumba_classique: "Zumba classique",
  zumba_kids: "Zumba® Kids",
  strong_toning: "Strong Toning®",
  zumba_step: "Zumba® Step",
  zumba_gold: "Zumba® Gold",
  zumba_sentoa: "Zumba Sentoa",
  zumba_in_the_circuit: "Zumba In The Circuit",
  zumba_strong: "Zumba Strong",
  aqua_zumba: "Aqua Zumba®",
  educateur_sportif_multisport: "Éducateur sportif multisport",
  animateur_sportif_enfants_ados: "Animateur sportif (enfants / ados)",
  intervenant_scolaire_eps: "Intervenant scolaire / EPS",
  animateur_sport_sante_seniors_apa: "Animateur sport santé / seniors / APA",
  animateur_aquatique: "Animateur aquatique",
  hote_hotesse_d_accueil_sportif: "Hôte / Hôtesse d’accueil sportif",
  encadrement_en_salle_bloc_voie: "Encadrement en salle (bloc / voie)",
  encadrement_en_milieu_naturel: "Encadrement en milieu naturel",
  ouvreur_de_voies_blocs: "Ouvreur de voies / blocs",
  encadrement_escalade_performance: "Encadrement Escalade (performance)",
  cours_enfants_ados: "Cours enfants / ados",
  initiation_loisirs_adultes: "Initiation / loisirs adultes",
  boxe_anglaise: "Boxe anglaise",
  boxe_francaise_savate: "Boxe française / Savate",
  kickboxing: "Kickboxing",
  karate: "Karaté",
  judo: "Judo",
  mma: "MMA",
  muay_thai: "Muay Thaï",
  boxe_educative_enfants_ados: "Boxe éducative (enfants / ados)",
  cardio_boxe_boxe_fitness: "Cardio Boxe / Boxe fitness",
  coaching_boxe_loisir_ou_competiteur: "Coaching boxe (loisir ou compétiteur)",
  danse_classique: "Danse classique",
  danse_contemporaine: "Danse contemporaine",
  jazz_modern_jazz: "Jazz / Modern Jazz",
  hip_hop_street_dance: "Hip Hop / Street Dance",
  ragga_dancehall: "Ragga Dancehall",
  danses_latines_salsa_bachata: "Danses latines (salsa, bachata…)",
  danse_africaine: "Danse africaine",
  danse_enfants: "Danse enfants",
  barre_au_sol: "Barre au sol",
  massages_bien_etre_sportifs: "Massages bien-être / sportifs",
  kinesitherapie_sportive_hors_acte_medical:
    "Kinésithérapie sportive (hors acte médical)",
  massage_deep_tissue_recuperation: "Massage deep tissue / récupération",
  reflexologie: "Réflexologie",
  relaxation_coherence_cardiaque: "Relaxation / cohérence cardiaque",
  sonotherapie_bains_sonores: "Sonothérapie / Bains sonores",
  sophrologie: "Sophrologie",
  meditation_pleine_conscience: "Méditation / pleine conscience",
  stretch_and_mobilite_douce: "Stretch & mobilité douce",
  cryotherapie_pressotherapie: "Cryothérapie / pressothérapie",
  nutrition_dietetique: "Nutrition / diététique",
  preparation_mentale: "Préparation mentale",
};

export const DIPLOME_KEYS = [
  "bpjeps_af_mention_cours_collectifs",
  "bpjeps_af_mention_halterophilie_musculation",
  "bpjeps_mapst",
  "bpjeps_apt",
  "bpjeps_ltp",
  "bpjeps_agff_ancienne_appellation",
  "dejeps_option_force_athletique_musculation",
  "dejeps_perfectionnement_sportif",
  "dejeps_specialite_sportive",
  "desjeps_performance_sportives",
  "licence_staps_management_du_sport",
  "licence_staps_education_et_motricite",
  "licence_staps_entrainement_sportif",
  "licence_staps_apa",
  "master_staps_apa",
  "master_staps_entrainement_sportif",
  "master_staps_preparation_physique",
  "master_staps_management_du_sport",
  "cqp_if_option_cours_collectifs",
  "cqp_if_option_musculation_and_personal_training",
  "cqp_als_option_agee",
  "bees_metiers_de_la_forme",
  "du_preparation_physique",
  "certification_yoga",
  "certification_pilates",
  "certification_zumba",
  "bpjeps_escalade",
  "dejeps_escalade",
  "cqp_escalade",
  "bees_escalade",
  "desjeps_escalade",
] as const;

export type DiplomeKey = (typeof DIPLOME_KEYS)[number];

export const DIPLOME_LABELS: Record<DiplomeKey, string> = {
  bpjeps_af_mention_cours_collectifs: "BPJEPS AF - Mention Cours Collectifs",
  bpjeps_af_mention_halterophilie_musculation:
    "BPJEPS AF - Mention Haltérophilie, Musculation",
  bpjeps_mapst: "BPJEPS MAPST",
  bpjeps_apt: "BPJEPS APT",
  bpjeps_ltp: "BPJEPS LTP",
  bpjeps_agff_ancienne_appellation: "BPJEPS AGFF (ancienne appellation)",
  dejeps_option_force_athletique_musculation:
    "DEJEPS - Option Force Athlétique / Musculation",
  dejeps_perfectionnement_sportif: "DEJEPS - Perfectionnement Sportif",
  dejeps_specialite_sportive: "DEJEPS - Spécialité sportive",
  desjeps_performance_sportives: "DESJEPS - Performance Sportives",
  licence_staps_management_du_sport: "Licence STAPS - Management du Sport",
  licence_staps_education_et_motricite:
    "Licence STAPS - Education et motricité",
  licence_staps_entrainement_sportif: "Licence STAPS - Entraînement Sportif",
  licence_staps_apa: "Licence STAPS APA",
  master_staps_apa: "Master Staps - APA",
  master_staps_entrainement_sportif: "Master STAPS - Entrainement Sportif",
  master_staps_preparation_physique: "Master STAPS - Préparation physique",
  master_staps_management_du_sport: "Master STAPS - Management du Sport",
  cqp_if_option_cours_collectifs: "CQP IF - Option Cours Collectifs",
  cqp_if_option_musculation_and_personal_training:
    "CQP IF - Option Musculation & Personal Training",
  cqp_als_option_agee: "CQP ALS - Option AGEE",
  bees_metiers_de_la_forme: "BEES Métiers de la Forme",
  du_preparation_physique: "DU - Préparation Physique",
  certification_yoga: "Certification Yoga",
  certification_pilates: "Certification Pilates",
  certification_zumba: "Certification Zumba",
  bpjeps_escalade: "BPJEPS Escalade",
  dejeps_escalade: "DEJEPS Escalade",
  cqp_escalade: "CQP Escalade",
  bees_escalade: "BEES Escalade",
  desjeps_escalade: "DESJEPS Escalade",
};

// Créneaux de disponibilité par moment de la journée
export const CRENEAUX_DISPONIBILITE = [
  "matin",
  "midi",
  "apres_midi",
  "soir",
] as const;

export type CreneauDisponibilite = (typeof CRENEAUX_DISPONIBILITE)[number];

export const CRENEAUX_DISPONIBILITE_LABELS: Record<
  CreneauDisponibilite,
  string
> = {
  matin: "Matin",
  midi: "Midi",
  apres_midi: "Après-midi",
  soir: "Soir",
};

export const updateProfilRenfordCouvertureSchema = z.object({
  imageCouvertureChemin: z.string().nullable(),
});

export type UpdateProfilRenfordCouvertureSchema = z.infer<
  typeof updateProfilRenfordCouvertureSchema
>;

export const updateProfilRenfordAvatarSchema = z.object({
  avatarChemin: z.string().nullable(),
});

export type UpdateProfilRenfordAvatarSchema = z.infer<
  typeof updateProfilRenfordAvatarSchema
>;

export const updateProfilRenfordInfosSchema = z.object({
  titreProfil: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  descriptionProfil: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  typeMission: z
    .array(z.enum(TYPE_MISSION), {
      required_error: "Veuillez sélectionner au moins un type de mission",
    })
    .min(1, "Veuillez sélectionner au moins un type de mission"),
  assuranceRCPro: z.boolean(),
});

export type UpdateProfilRenfordInfosSchema = z.infer<
  typeof updateProfilRenfordInfosSchema
>;

export const updateProfilRenfordDescriptionSchema = z.object({
  descriptionProfil: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
});

export type UpdateProfilRenfordDescriptionSchema = z.infer<
  typeof updateProfilRenfordDescriptionSchema
>;

const disponibilitesJourSchema = z.array(z.enum(CRENEAUX_DISPONIBILITE));

export const updateProfilRenfordDisponibilitesSchema = z.object({
  disponibilitesLundi: disponibilitesJourSchema,
  disponibilitesMardi: disponibilitesJourSchema,
  disponibilitesMercredi: disponibilitesJourSchema,
  disponibilitesJeudi: disponibilitesJourSchema,
  disponibilitesVendredi: disponibilitesJourSchema,
  disponibilitesSamedi: disponibilitesJourSchema,
  disponibilitesDimanche: disponibilitesJourSchema,
  dureeIllimitee: z.boolean(),
  dateDebut: z.date().optional(),
  dateFin: z.date().optional(),
  zoneDeplacement: z
    .number()
    .min(1, "La zone de déplacement doit être d'au moins 1 km")
    .max(200, "La zone de déplacement ne peut pas dépasser 200 km"),
});

export type UpdateProfilRenfordDisponibilitesSchema = z.infer<
  typeof updateProfilRenfordDisponibilitesSchema
>;

const optionalYearSchema = z.number().int().min(1900).max(2100).nullable();

const optionalNullableStringSchema = z.string().nullable();

const updateProfilRenfordExperienceItemSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom du poste doit contenir au moins 2 caractères")
    .max(100, "Le nom du poste ne peut pas dépasser 100 caractères"),
  etablissement: z
    .string()
    .min(2, "Le nom de l'établissement doit contenir au moins 2 caractères")
    .max(120, "Le nom de l'établissement ne peut pas dépasser 120 caractères"),
  missions: z
    .string()
    .min(5, "La description des missions doit contenir au moins 5 caractères")
    .max(
      1000,
      "La description des missions ne peut pas dépasser 1000 caractères"
    ),
  dateDebut: z.date({ required_error: "La date de début est obligatoire" }),
  dateFin: z.date().nullable().optional(),
});

export const updateProfilRenfordExperiencesSchema = z.object({
  experiencesProfessionnelles: z.array(updateProfilRenfordExperienceItemSchema),
});

export type UpdateProfilRenfordExperiencesSchema = z.infer<
  typeof updateProfilRenfordExperiencesSchema
>;

const updateProfilRenfordDiplomeItemSchema = z.object({
  typeDiplome: z.enum(DIPLOME_KEYS),
  anneeObtention: optionalYearSchema,
  mention: optionalNullableStringSchema,
  etablissementFormation: optionalNullableStringSchema,
  justificatifDiplomeChemin: optionalNullableStringSchema,
});

export const updateProfilRenfordDiplomesSchema = z.object({
  renfordDiplomes: z.array(updateProfilRenfordDiplomeItemSchema),
});

export type UpdateProfilRenfordDiplomesSchema = z.infer<
  typeof updateProfilRenfordDiplomesSchema
>;

export const updateProfilRenfordPortfolioSchema = z.object({
  portfolio: z.array(z.string().min(1, "Le chemin image est requis")),
});

export type UpdateProfilRenfordPortfolioSchema = z.infer<
  typeof updateProfilRenfordPortfolioSchema
>;

const preprocessOptionalNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number" && Number.isNaN(value)) return undefined;
  return value;
};

const tarifHoraireSchema = z.preprocess(
  preprocessOptionalNumber,
  z
    .number({
      required_error: "Le tarif horaire est obligatoire",
      invalid_type_error: "Le tarif horaire doit être un nombre valide",
    })
    .min(10, "Le tarif horaire minimum est de 10€")
    .max(500, "Le tarif horaire maximum est de 500€")
);

const tarifJourneeSchema = z.preprocess(
  preprocessOptionalNumber,
  z
    .number({
      invalid_type_error: "Le tarif journée doit être un nombre valide",
    })
    .min(100, "Le tarif journée minimum est de 100€")
    .max(5000, "Le tarif journée maximum est de 5000€")
    .optional()
);

const tarifDemiJourneeSchema = z.preprocess(
  preprocessOptionalNumber,
  z
    .number({
      invalid_type_error: "Le tarif demi-journée doit être un nombre valide",
    })
    .min(50, "Le tarif demi-journée minimum est de 50€")
    .max(2000, "Le tarif demi-journée maximum est de 2000€")
    .optional()
);

export const updateProfilRenfordQualificationsSchema = z
  .object({
    niveauExperience: z.enum(NIVEAU_EXPERIENCE, {
      required_error: "Veuillez sélectionner votre niveau d'expérience",
    }),
    justificatifCarteProfessionnelleChemin: z
      .string({
        required_error: "Le justificatif carte professionnelle est obligatoire",
      })
      .min(1, "Le justificatif carte professionnelle est obligatoire"),
    tarifHoraire: tarifHoraireSchema,
    proposeJournee: z.boolean().default(false),
    tarifJournee: tarifJourneeSchema,
    proposeDemiJournee: z.boolean().default(false),
    tarifDemiJournee: tarifDemiJourneeSchema,
  })
  .superRefine((data, ctx) => {
    if (data.proposeJournee && data.tarifJournee === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tarifJournee"],
        message:
          "Le tarif journée est obligatoire quand cette option est activée",
      });
    }

    if (data.proposeDemiJournee && data.tarifDemiJournee === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tarifDemiJournee"],
        message:
          "Le tarif demi-journée est obligatoire quand cette option est activée",
      });
    }
  });

export type UpdateProfilRenfordQualificationsSchema = z.infer<
  typeof updateProfilRenfordQualificationsSchema
>;

export const updateProfilRenfordIdentiteSchema = z
  .object({
    siret: z.string().optional(),
    siretEnCoursObtention: z.boolean(),
    attestationAutoEntrepreneur: z.boolean(),
    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
    codePostal: z.string().min(1, "Le code postal est obligatoire"),
    ville: z
      .string()
      .min(2, "La ville doit contenir au moins 2 caractères")
      .max(100, "La ville ne peut pas dépasser 100 caractères"),
    latitude: z
      .number()
      .min(-90, "Latitude invalide")
      .max(90, "Latitude invalide")
      .optional(),
    longitude: z
      .number()
      .min(-180, "Longitude invalide")
      .max(180, "Longitude invalide")
      .optional(),
    pays: z.string().min(2, "Le pays est obligatoire"),
    dateNaissance: z.date({
      required_error: "La date de naissance est requise",
    }),
    attestationVigilanceChemin: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.siretEnCoursObtention) {
      if (!data.siret || !/^\d{14}$/.test(data.siret)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["siret"],
          message: "Le numéro SIRET doit contenir exactement 14 chiffres",
        });
      }
    }
  });

export type UpdateProfilRenfordIdentiteSchema = z.infer<
  typeof updateProfilRenfordIdentiteSchema
>;
