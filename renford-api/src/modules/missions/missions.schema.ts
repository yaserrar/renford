import { z } from 'zod';
import { TYPE_MISSION } from '../onboarding/onboarding.schema';

export const MODE_MISSION = ['flex', 'coach'] as const;

export const DISCIPLINE_MISSION = [
  'pilates',
  'yoga',
  'fitness_musculation',
  'programmes_les_mills',
  'zumba',
  'animation_sportive_multisport',
  'escalade',
  'boxe_arts_martiaux',
  'danse',
  'bien_etre_sport_sante',
] as const;

export const NIVEAU_EXPERIENCE_MISSION = [
  'peut_importe',
  'debutant',
  'confirme',
  'expert',
] as const;

export const MATERIELS_MISSION = [
  'tapis',
  'halteres',
  'kettlebell',
  'elastiques',
  'medecine_ball',
  'velo_indoor',
  'barre',
  'autre',
] as const;

export const METHODE_TARIFICATION = ['horaire', 'journee', 'demi_journee'] as const;

export const TYPE_PAIEMENT = ['carte_bancaire', 'prelevement_sepa'] as const;

export const ETABLISSEMENT_MISSIONS_TAB = ['en-recherche', 'confirmees', 'terminees'] as const;
export type EtablissementMissionsTab = (typeof ETABLISSEMENT_MISSIONS_TAB)[number];

export const POURCENTAGE_VARIATION_TARIF_OPTIONS = [10, 20, 50] as const;

type TypeMission = (typeof TYPE_MISSION)[number];

export const TYPE_MISSION_LABELS: Record<TypeMission, string> = {
  matwork: 'Matwork',
  reformer: 'Reformer',
  hot_pilates: 'Hot Pilates',
  cadillac: 'Cadillac',
  chair_wunda_chair: 'Chair (Wunda Chair)',
  petits_materiels: 'Petits materiels',
  pilates_prenatal_postnatal: 'Pilates prenatal / postnatal',
  lagree_fitness: 'Lagree Fitness',
  hatha_yoga: 'Hatha Yoga',
  vinyasa_yoga: 'Vinyasa Yoga',
  ashtanga_yoga: 'Ashtanga Yoga',
  yin_yoga: 'Yin Yoga',
  hot_yoga: 'Hot Yoga',
  kundalini_yoga: 'Kundalini Yoga',
  yoga_prenatal_postnatal: 'Yoga prenatal / postnatal',
  yoga_nidra: 'Yoga Nidra',
  yoga_flow: 'Yoga Flow',
  qi_gong_tai_chi: 'Qi Gong / Tai Chi',
  caf_cuisses_abdos_fessiers: 'CAF (Cuisses Abdos Fessiers)',
  lia_low_impact_aerobic: 'LIA (Low Impact Aerobic)',
  step: 'Step',
  hiit: 'HIIT',
  circuit_training: 'Circuit training',
  cross_training_crossfit: 'Cross Training / CrossFit',
  trx: 'TRX',
  biking_spinning: 'Biking / Spinning',
  body_barre: 'Body barre',
  stretching_mobilite: 'Stretching / Mobilite',
  cardio_boxing: 'Cardio Boxing',
  bootcamp: 'Bootcamp',
  gym_posturale_dos: 'Gym posturale / dos',
  ems_electrostimulation: 'EMS (Electrostimulation)',
  preparation_physique_generale: 'Preparation Physique Generale',
  body_pump: 'Body Pump',
  body_attack: 'Body Attack',
  body_combat: 'Body Combat',
  body_step: 'Body Step',
  body_balance: 'Body Balance',
  body_jam: 'Body Jam',
  rpm: 'RPM',
  zumba_classique: 'Zumba classique',
  zumba_kids: 'Zumba Kids',
  strong_toning: 'Strong Toning',
  zumba_step: 'Zumba Step',
  zumba_gold: 'Zumba Gold',
  zumba_sentoa: 'Zumba Sentoa',
  zumba_in_the_circuit: 'Zumba In The Circuit',
  zumba_strong: 'Zumba Strong',
  aqua_zumba: 'Aqua Zumba',
  educateur_sportif_multisport: 'Educateur sportif multisport',
  animateur_sportif_enfants_ados: 'Animateur sportif (enfants / ados)',
  intervenant_scolaire_eps: 'Intervenant scolaire / EPS',
  animateur_sport_sante_seniors_apa: 'Animateur sport sante / seniors / APA',
  animateur_aquatique: 'Animateur aquatique',
  hote_hotesse_d_accueil_sportif: "Hote / Hotesse d'accueil sportif",
  encadrement_en_salle_bloc_voie: 'Encadrement en salle (bloc / voie)',
  encadrement_en_milieu_naturel: 'Encadrement en milieu naturel',
  ouvreur_de_voies_blocs: 'Ouvreur de voies / blocs',
  encadrement_escalade_performance: 'Encadrement Escalade (performance)',
  cours_enfants_ados: 'Cours enfants / ados',
  initiation_loisirs_adultes: 'Initiation / loisirs adultes',
  boxe_anglaise: 'Boxe anglaise',
  boxe_francaise_savate: 'Boxe francaise / Savate',
  kickboxing: 'Kickboxing',
  karate: 'Karate',
  judo: 'Judo',
  mma: 'MMA',
  muay_thai: 'Muay Thai',
  boxe_educative_enfants_ados: 'Boxe educative (enfants / ados)',
  cardio_boxe_boxe_fitness: 'Cardio Boxe / Boxe fitness',
  coaching_boxe_loisir_ou_competiteur: 'Coaching boxe (loisir ou competiteur)',
  danse_classique: 'Danse classique',
  danse_contemporaine: 'Danse contemporaine',
  jazz_modern_jazz: 'Jazz / Modern Jazz',
  hip_hop_street_dance: 'Hip Hop / Street Dance',
  ragga_dancehall: 'Ragga Dancehall',
  danses_latines_salsa_bachata: 'Danses latines (salsa, bachata...)',
  danse_africaine: 'Danse africaine',
  danse_enfants: 'Danse enfants',
  barre_au_sol: 'Barre au sol',
  massages_bien_etre_sportifs: 'Massages bien-etre / sportifs',
  kinesitherapie_sportive_hors_acte_medical: 'Kinesitherapie sportive (hors acte medical)',
  massage_deep_tissue_recuperation: 'Massage deep tissue / recuperation',
  reflexologie: 'Reflexologie',
  relaxation_coherence_cardiaque: 'Relaxation / coherence cardiaque',
  sonotherapie_bains_sonores: 'Sonotherapie / Bains sonores',
  sophrologie: 'Sophrologie',
  meditation_pleine_conscience: 'Meditation / pleine conscience',
  stretch_and_mobilite_douce: 'Stretch & mobilite douce',
  cryotherapie_pressotherapie: 'Cryotherapie / pressotherapie',
  nutrition_dietetique: 'Nutrition / dietetique',
  preparation_mentale: 'Preparation mentale',
};

export const getTypeMissionLabel = (specialite: string): string => {
  const label = TYPE_MISSION_LABELS[specialite as TypeMission];

  if (label) {
    return label;
  }

  return specialite
    .split('_')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
};

const parseDateField = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return value;
};

const parseNumberField = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const plageHoraireSchema = z.object({
  date: z.preprocess(
    parseDateField,
    z.date({
      required_error: 'La date de plage horaire est requise',
      invalid_type_error: 'Veuillez sélectionner une date valide',
    }),
  ),
  heureDebut: z
    .string({ required_error: "L'heure de début est requise" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide"),
  heureFin: z
    .string({ required_error: "L'heure de fin est requise" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide"),
});

export const createMissionSchema = z
  .object({
    modeMission: z.enum(MODE_MISSION, {
      required_error: 'Veuillez sélectionner un type de mission',
    }),
    discipline: z.enum(DISCIPLINE_MISSION, {
      required_error: 'Veuillez sélectionner une discipline',
    }),
    specialitePrincipale: z.enum(TYPE_MISSION, {
      required_error: 'Veuillez sélectionner une spécialité principale',
    }),
    specialitesSecondaires: z.array(z.enum(TYPE_MISSION)).default([]),
    niveauExperienceRequis: z.enum(NIVEAU_EXPERIENCE_MISSION).nullable().optional(),
    assuranceObligatoire: z.boolean().default(false),
    materielsRequis: z.array(z.enum(MATERIELS_MISSION)).default([]),
    description: z
      .string()
      .max(1000, 'La description ne peut pas dépasser 1000 caractères')
      .nullable()
      .optional(),
    etablissementId: z
      .string({ required_error: "Veuillez sélectionner un site d'exécution" })
      .uuid('Veuillez sélectionner un site valide'),
    dateDebut: z.preprocess(
      parseDateField,
      z.date({
        required_error: 'Veuillez sélectionner une date de début',
        invalid_type_error: 'Veuillez sélectionner une date de début valide',
      }),
    ),
    dateFin: z.preprocess(
      parseDateField,
      z.date({
        required_error: 'Veuillez sélectionner une date de fin',
        invalid_type_error: 'Veuillez sélectionner une date de fin valide',
      }),
    ),
    plagesHoraires: z
      .array(plageHoraireSchema)
      .min(1, 'Veuillez ajouter au moins une plage horaire de mission'),
    methodeTarification: z.enum(METHODE_TARIFICATION, {
      required_error: 'Veuillez sélectionner une méthode de tarification',
    }),
    tarif: z.preprocess(
      parseNumberField,
      z
        .number({
          required_error: 'Veuillez saisir un tarif',
          invalid_type_error: 'Veuillez saisir un tarif valide',
        })
        .positive('Le tarif doit être supérieur à 0')
        .max(99_999_999.99, 'Le tarif ne peut pas dépasser 99 999 999,99'),
    ),
    pourcentageVariationTarif: z.preprocess(
      parseNumberField,
      z
        .number({
          required_error: 'Veuillez sélectionner un pourcentage de variation',
          invalid_type_error: 'Le pourcentage de variation est invalide',
        })
        .refine((value) => POURCENTAGE_VARIATION_TARIF_OPTIONS.includes(value as 10 | 20 | 50), {
          message: 'Le pourcentage de variation est invalide',
        }),
    ),
  })
  .superRefine((values, ctx) => {
    if (values.dateFin < values.dateDebut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateFin'],
        message: 'La date de fin doit être postérieure ou égale à la date de début',
      });
    }

    values.plagesHoraires.forEach((slot, index) => {
      if (slot.date < values.dateDebut || slot.date > values.dateFin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['plagesHoraires', index, 'date'],
          message: 'La date de la plage horaire doit être comprise dans la période sélectionnée',
        });
      }

      if (slot.heureFin <= slot.heureDebut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['plagesHoraires', index, 'heureFin'],
          message: "L'heure de fin doit être postérieure à l'heure de début",
        });
      }
    });
  });

const cardPaymentSchema = z.object({
  typePaiement: z.literal('carte_bancaire'),
  titulaireCarteBancaire: z
    .string({ required_error: 'Le titulaire de la carte est requis' })
    .min(2, 'Le titulaire de la carte est requis'),
  numeroCarteBancaire: z
    .string({ required_error: 'Le numéro de carte est requis' })
    .regex(/^\d{13,19}$/, 'Le numéro de carte doit contenir entre 13 et 19 chiffres'),
  dateExpirationCarte: z
    .string({ required_error: "La date d'expiration est requise" })
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format attendu: MM/AA'),
  cvvCarte: z
    .string({ required_error: 'Le CVC est requis' })
    .regex(/^\d{3,4}$/, 'Le CVC doit contenir 3 ou 4 chiffres'),
  autorisationDebit: z.literal(true, {
    errorMap: () => ({ message: 'Veuillez autoriser le débit pour continuer' }),
  }),
});

const sepaPaymentSchema = z.object({
  typePaiement: z.literal('prelevement_sepa'),
  titulaireCompteBancaire: z
    .string({ required_error: 'Le titulaire du compte est requis' })
    .min(2, 'Le titulaire du compte est requis'),
  IBANCompteBancaire: z
    .string({ required_error: "L'IBAN est requis" })
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, 'IBAN invalide'),
  BICCompteBancaire: z
    .string({ required_error: 'Le BIC/SWIFT est requis' })
    .regex(/^[A-Z0-9]{8,11}$/, 'BIC/SWIFT invalide'),
  autorisationPrelevement: z.literal(true, {
    errorMap: () => ({ message: 'Veuillez autoriser le prélèvement pour continuer' }),
  }),
});

export const finalizeMissionPaymentSchema = z.discriminatedUnion('typePaiement', [
  cardPaymentSchema,
  sepaPaymentSchema,
]);

export const missionIdParamsSchema = z.object({
  missionId: z.string().uuid("L'identifiant de mission est invalide"),
});

export const getEtablissementMissionsQuerySchema = z.object({
  tab: z
    .enum(ETABLISSEMENT_MISSIONS_TAB, {
      required_error: 'Veuillez préciser un onglet de mission valide',
    })
    .optional(),
});

export type CreateMissionSchema = z.infer<typeof createMissionSchema>;
export type FinalizeMissionPaymentSchema = z.infer<typeof finalizeMissionPaymentSchema>;
export type MissionIdParamsSchema = z.infer<typeof missionIdParamsSchema>;
export type GetEtablissementMissionsQuerySchema = z.infer<
  typeof getEtablissementMissionsQuerySchema
>;
