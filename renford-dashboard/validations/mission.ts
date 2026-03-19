import { z } from "zod";
import { TYPE_MISSION, TYPE_MISSION_LABELS } from "./profil-renford";

export const MODE_MISSION = ["flex", "coach"] as const;

export const MODE_MISSION_LABELS: Record<
  (typeof MODE_MISSION)[number],
  string
> = {
  flex: "Flex (missions express/ponctuelles)",
  coach: "Coach (missions longue durée)",
};

export const STATUT_MISSION = [
  "brouillon",
  "en_attente_paiement",
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

export const STATUT_MISSION_LABELS: Record<
  (typeof STATUT_MISSION)[number],
  string
> = {
  brouillon: "Brouillon",
  en_attente_paiement: "En attente de paiement",
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

export const METHODE_TARIFICATION = [
  "horaire",
  "journee",
  "demi_journee",
] as const;

export const METHODE_TARIFICATION_LABELS: Record<
  (typeof METHODE_TARIFICATION)[number],
  string
> = {
  horaire: "Tarification horaire",
  journee: "Tarification à la journée",
  demi_journee: "Tarification à la demi-journée",
};

export const TYPE_PAIEMENT = ["carte_bancaire", "prelevement_sepa"] as const;

export const TYPE_PAIEMENT_LABELS: Record<
  (typeof TYPE_PAIEMENT)[number],
  string
> = {
  carte_bancaire: "Carte Bancaire (Empreinte)",
  prelevement_sepa: "Prélèvement SEPA",
};

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

export const NIVEAU_EXPERIENCE_MISSION = [
  "peut_importe",
  "debutant",
  "confirme",
  "expert",
] as const;

export const NIVEAU_EXPERIENCE_MISSION_LABELS: Record<
  (typeof NIVEAU_EXPERIENCE_MISSION)[number],
  string
> = {
  peut_importe: "Peu importe",
  debutant: "Débutant < 2 ans",
  confirme: "Confirmé 2-5 ans",
  expert: "Expert > 5 ans",
};

export const SPECIALITES_BY_DISCIPLINE: Record<
  (typeof DISCIPLINE_MISSION)[number],
  readonly (typeof TYPE_MISSION)[number][]
> = {
  pilates: [
    "matwork",
    "reformer",
    "hot_pilates",
    "cadillac",
    "chair_wunda_chair",
    "petits_materiels",
    "pilates_prenatal_postnatal",
    "lagree_fitness",
  ],
  yoga: [
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
  ],
  fitness_musculation: [
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
  ],
  programmes_les_mills: [
    "body_pump",
    "body_attack",
    "body_combat",
    "body_step",
    "body_balance",
    "body_jam",
    "rpm",
  ],
  zumba: [
    "zumba_classique",
    "zumba_kids",
    "strong_toning",
    "zumba_step",
    "zumba_gold",
    "zumba_sentoa",
    "zumba_in_the_circuit",
    "zumba_strong",
    "aqua_zumba",
  ],
  animation_sportive_multisport: [
    "educateur_sportif_multisport",
    "animateur_sportif_enfants_ados",
    "intervenant_scolaire_eps",
    "animateur_sport_sante_seniors_apa",
    "animateur_aquatique",
    "hote_hotesse_d_accueil_sportif",
  ],
  escalade: [
    "encadrement_en_salle_bloc_voie",
    "encadrement_en_milieu_naturel",
    "ouvreur_de_voies_blocs",
    "encadrement_escalade_performance",
    "cours_enfants_ados",
    "initiation_loisirs_adultes",
  ],
  boxe_arts_martiaux: [
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
  ],
  danse: [
    "danse_classique",
    "danse_contemporaine",
    "jazz_modern_jazz",
    "hip_hop_street_dance",
    "ragga_dancehall",
    "danses_latines_salsa_bachata",
    "danse_africaine",
    "danse_enfants",
    "barre_au_sol",
  ],
  bien_etre_sport_sante: [
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
  ],
};

export const MATERIELS_MISSION = [
  "tapis",
  "halteres",
  "kettlebell",
  "elastiques",
  "medecine_ball",
  "velo_indoor",
  "barre",
  "autre",
] as const;

export const MATERIELS_MISSION_LABELS: Record<
  (typeof MATERIELS_MISSION)[number],
  string
> = {
  tapis: "Tapis",
  halteres: "Haltères",
  kettlebell: "Kettlebell",
  elastiques: "Élastiques",
  medecine_ball: "Medicine ball",
  velo_indoor: "Vélo indoor",
  barre: "Barre",
  autre: "Autre",
};

export const POURCENTAGE_VARIATION_TARIF_OPTIONS = [10, 20, 50] as const;

export const DISCIPLINE_MISSION_OPTIONS = DISCIPLINE_MISSION.map((value) => ({
  value,
  label: DISCIPLINE_MISSION_LABELS[value],
}));

export const NIVEAU_EXPERIENCE_MISSION_OPTIONS = NIVEAU_EXPERIENCE_MISSION.map(
  (value) => ({
    value,
    label: NIVEAU_EXPERIENCE_MISSION_LABELS[value],
  })
);

export const MATERIELS_MISSION_OPTIONS = MATERIELS_MISSION.map((value) => ({
  value,
  label: MATERIELS_MISSION_LABELS[value],
}));

export const METHODE_TARIFICATION_OPTIONS = METHODE_TARIFICATION.map(
  (value) => ({
    value,
    label: METHODE_TARIFICATION_LABELS[value],
  })
);

const parseDateField = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return value;
};

const parseNumberField = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;

  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

export const createMissionStep1Schema = z.object({
  modeMission: z.enum(MODE_MISSION, {
    required_error: "Veuillez sélectionner un type de mission",
  }),
});

export const createMissionStep2Schema = z
  .object({
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
      .max(
        1000,
        "Le détail supplémentaire ne peut pas dépasser 1000 caractères"
      )
      .optional()
      .or(z.literal("")),
    specialitePrincipale: z.enum(TYPE_MISSION, {
      required_error: "Veuillez sélectionner une spécialité principale",
    }),
    specialitesSecondaires: z.array(z.enum(TYPE_MISSION)).default([]),
  })
  .superRefine((values, ctx) => {
    const allowedSpecialites = SPECIALITES_BY_DISCIPLINE[values.discipline];

    if (!allowedSpecialites.includes(values.specialitePrincipale)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialitePrincipale"],
        message:
          "La spécialité principale ne correspond pas à la discipline sélectionnée",
      });
    }

    for (const secondary of values.specialitesSecondaires) {
      if (!allowedSpecialites.includes(secondary)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialitesSecondaires"],
          message:
            "Les spécialités secondaires doivent correspondre à la discipline sélectionnée",
        });
        break;
      }

      if (secondary === values.specialitePrincipale) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialitesSecondaires"],
          message:
            "La spécialité principale ne peut pas être aussi une spécialité secondaire",
        });
        break;
      }
    }
  });

export const createMissionStep3Schema = z
  .object({
    etablissementId: z
      .string({
        required_error: "Veuillez sélectionner un site d'exécution",
      })
      .uuid("Veuillez sélectionner un site valide"),
    dateDebut: z.preprocess(
      parseDateField,
      z.date({
        required_error: "Veuillez sélectionner une date de début",
        invalid_type_error: "Veuillez sélectionner une date de début valide",
      })
    ),
    dateFin: z.preprocess(
      parseDateField,
      z.date({
        required_error: "Veuillez sélectionner une date de fin",
        invalid_type_error: "Veuillez sélectionner une date de fin valide",
      })
    ),
    plagesHoraires: z
      .array(
        z.object({
          date: z.preprocess(
            parseDateField,
            z.date({
              required_error: "Date de plage horaire requise",
              invalid_type_error: "Veuillez sélectionner une date valide",
            })
          ),
          heureDebut: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide"),
          heureFin: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide"),
        })
      )
      .min(1, "Veuillez ajouter au moins une plage horaire"),
    methodeTarification: z.enum(METHODE_TARIFICATION, {
      required_error: "Veuillez sélectionner une méthode de tarification",
    }),
    tarif: z.preprocess(
      parseNumberField,
      z
        .number({
          required_error: "Veuillez saisir un tarif",
          invalid_type_error: "Veuillez saisir un tarif valide",
        })
        .positive("Le tarif doit être supérieur à 0")
        .max(99_999_999.99, "Le tarif ne peut pas dépasser 99 999 999,99")
    ),
    pourcentageVariationTarif: z.coerce
      .number({
        required_error: "Veuillez sélectionner un pourcentage de variation",
      })
      .refine(
        (value) =>
          POURCENTAGE_VARIATION_TARIF_OPTIONS.includes(value as 10 | 20 | 50),
        {
          message: "Veuillez sélectionner un pourcentage de variation valide",
        }
      ),
  })
  .superRefine((values, ctx) => {
    if (values.dateFin < values.dateDebut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateFin"],
        message:
          "La date de fin doit être postérieure ou égale à la date de début",
      });
    }

    values.plagesHoraires.forEach((slot, index) => {
      if (slot.date < values.dateDebut || slot.date > values.dateFin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["plagesHoraires", index, "date"],
          message:
            "La date de la plage horaire doit être comprise dans la période sélectionnée",
        });
      }

      if (slot.heureFin <= slot.heureDebut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["plagesHoraires", index, "heureFin"],
          message: "L'heure de fin doit être postérieure à l'heure de début",
        });
      }
    });
  });

export const createMissionFormSchema = createMissionStep1Schema
  .and(createMissionStep2Schema)
  .and(createMissionStep3Schema);

export const createMissionPayloadSchema = createMissionFormSchema.transform(
  (values) => ({
    ...values,
    description: values.detailMission?.trim() ? values.detailMission : null,
  })
);

const cardPaymentSchema = z.object({
  typePaiement: z.literal("carte_bancaire"),
  titulaireCarteBancaire: z
    .string({ required_error: "Le titulaire de la carte est requis" })
    .min(2, "Le titulaire de la carte est requis"),
  numeroCarteBancaire: z
    .string({ required_error: "Le numéro de carte est requis" })
    .regex(
      /^\d{13,19}$/,
      "Le numéro de carte doit contenir entre 13 et 19 chiffres"
    ),
  dateExpirationCarte: z
    .string({ required_error: "La date d'expiration est requise" })
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format attendu: MM/AA"),
  cvvCarte: z
    .string({ required_error: "Le CVC est requis" })
    .regex(/^\d{3,4}$/, "Le CVC doit contenir 3 ou 4 chiffres"),
  autorisationDebit: z.literal(true, {
    errorMap: () => ({ message: "Veuillez autoriser le débit pour continuer" }),
  }),
});

const sepaPaymentSchema = z.object({
  typePaiement: z.literal("prelevement_sepa"),
  titulaireCompteBancaire: z
    .string({ required_error: "Le titulaire du compte est requis" })
    .min(2, "Le titulaire du compte est requis"),
  IBANCompteBancaire: z
    .string({ required_error: "L'IBAN est requis" })
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "IBAN invalide"),
  BICCompteBancaire: z
    .string({ required_error: "Le BIC/SWIFT est requis" })
    .regex(/^[A-Z0-9]{8,11}$/, "BIC/SWIFT invalide"),
  autorisationPrelevement: z.literal(true, {
    errorMap: () => ({
      message: "Veuillez autoriser le prélèvement pour continuer",
    }),
  }),
});

export const finalizeMissionPaymentSchema = z.discriminatedUnion(
  "typePaiement",
  [cardPaymentSchema, sepaPaymentSchema]
);

export const getSpecialitesOptionsByDiscipline = (
  discipline: (typeof DISCIPLINE_MISSION)[number] | undefined
) => {
  if (!discipline) return [];

  return SPECIALITES_BY_DISCIPLINE[discipline].map((value) => ({
    value,
    label: TYPE_MISSION_LABELS[value],
  }));
};

export type CreateMissionStep1Schema = z.infer<typeof createMissionStep1Schema>;
export type CreateMissionStep2Schema = z.infer<typeof createMissionStep2Schema>;
export type CreateMissionStep3Schema = z.infer<typeof createMissionStep3Schema>;
export type CreateMissionFormSchema = z.infer<typeof createMissionFormSchema>;
export type CreateMissionPayloadSchema = z.infer<
  typeof createMissionPayloadSchema
>;
export type FinalizeMissionPaymentSchema = z.infer<
  typeof finalizeMissionPaymentSchema
>;
