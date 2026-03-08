import { z } from 'zod';
import { TYPE_UTILISATEUR } from '../utilisateur/utilisateur.schema';

// Schéma pour la mise à jour des informations de contact (étape 1)
export const updateContactSchema = z.object({
  prenom: z.string().min(2, '2 caractères minimum'),
  nom: z.string().min(2, '2 caractères minimum'),
  telephone: z.string().min(10, 'Numéro de téléphone invalide'),
});

export type UpdateContactSchema = z.infer<typeof updateContactSchema>;

// Schéma pour la mise à jour du type d'utilisateur (étape 2)
export const updateTypeSchema = z.object({
  typeUtilisateur: z.enum(TYPE_UTILISATEUR, {
    required_error: "Le type d'utilisateur est obligatoire",
  }),
});

export type UpdateTypeSchema = z.infer<typeof updateTypeSchema>;

export const TYPE_ETABLISSEMENT = [
  'salle_sport_gymnase',
  'centre_fitness',
  'studio_yoga',
  'studio_pilates',
  'centre_bien_etre',
  'club_escalade',
  'centre_sports_aquatiques',
  'ecole_danse',
  'centre_formation_sportive',
  'club_sport_combat',
  'centre_arts_martiaux',
  'complexe_multisports',
  'club_golf',
  'club_tennis',
  'centre_athletisme',
  'etablissement_sports_extremes',
  'centre_equestre',
  'club_cyclisme',
  'club_course_pied',
  'club_tir_arc',
  'club_voile_nautique',
  'centre_musculation',
  'centre_reeducation',
  'stade_arene',
  'association_sportive',
  'complexe_loisirs',
  'academie_sportive',
  'ecole_surf',
] as const;

// Schéma pour la mise à jour du profil établissement (étape 3)
export const updateEtablissementSchema = z
  .object({
    raisonSociale: z.string().min(2, '2 caractères minimum').max(100, '100 caractères maximum'),
    siret: z
      .string()
      .length(14, 'Le SIRET doit contenir 14 chiffres')
      .regex(/^\d{14}$/, 'Le SIRET ne doit contenir que des chiffres'),
    adresse: z.string().min(5, '5 caractères minimum').max(200, '200 caractères maximum'),
    codePostal: z
      .string()
      .length(5, 'Le code postal doit contenir 5 chiffres')
      .regex(/^\d{5}$/, 'Le code postal ne doit contenir que des chiffres'),
    ville: z.string().min(2, '2 caractères minimum').max(100, '100 caractères maximum'),
    latitude: z.number().min(-90, 'Latitude invalide').max(90, 'Latitude invalide'),
    longitude: z.number().min(-180, 'Longitude invalide').max(180, 'Longitude invalide'),
    typeEtablissement: z.enum(TYPE_ETABLISSEMENT, {
      required_error: "Le type d'établissement est obligatoire",
    }),
    adresseSiegeDifferente: z.boolean(),
    adresseSiege: z.string().optional(),
    codePostalSiege: z.string().optional(),
    villeSiege: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.adresseSiege && data.adresseSiege.length >= 5;
      }
      return true;
    },
    {
      message: "L'adresse du siège est obligatoire (5 caractères minimum)",
      path: ['adresseSiege'],
    },
  )
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.codePostalSiege && /^\d{5}$/.test(data.codePostalSiege);
      }
      return true;
    },
    {
      message: 'Le code postal du siège est obligatoire (5 chiffres)',
      path: ['codePostalSiege'],
    },
  )
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.villeSiege && data.villeSiege.length >= 2;
      }
      return true;
    },
    {
      message: 'La ville du siège est obligatoire (2 caractères minimum)',
      path: ['villeSiege'],
    },
  );

export type UpdateEtablissementSchema = z.infer<typeof updateEtablissementSchema>;

// Schéma pour un favori Renford
export const favoriRenfordSchema = z.object({
  nomComplet: z.string().min(2, '2 caractères minimum'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
});

export type FavoriRenfordSchema = z.infer<typeof favoriRenfordSchema>;

// Schéma pour la mise à jour des favoris (étape 4)
export const updateFavorisSchema = z.object({
  favoris: z.array(favoriRenfordSchema),
});

export type UpdateFavorisSchema = z.infer<typeof updateFavorisSchema>;

// Schéma pour passer une étape
export const skipStepSchema = z.object({
  etape: z.number().min(1).max(8),
});

export type SkipStepSchema = z.infer<typeof skipStepSchema>;

// ============================================================================
// Schémas spécifiques aux Renfords
// ============================================================================

// Schéma pour l'identité légale Renford (étape 3)
export const updateRenfordIdentiteSchema = z
  .object({
    siret: z.string().optional(),
    siretEnCoursObtention: z.boolean(),
    attestationAutoEntrepreneur: z.boolean(),
    adresse: z.string().min(5, '5 caractères minimum'),
    codePostal: z.string().length(5, 'Le code postal doit contenir 5 chiffres'),
    ville: z.string().min(2, '2 caractères minimum'),
    latitude: z.number().min(-90, 'Latitude invalide').max(90, 'Latitude invalide'),
    longitude: z.number().min(-180, 'Longitude invalide').max(180, 'Longitude invalide'),
    pays: z.string().min(2, '2 caractères minimum'),
    dateNaissance: z.string().or(z.date()),
    attestationVigilanceChemin: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.siretEnCoursObtention) {
      if (!data.siret || data.siret.length !== 14 || !/^\d{14}$/.test(data.siret)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['siret'],
          message: 'Le SIRET doit contenir 14 chiffres',
        });
      }
    }
  });

export type UpdateRenfordIdentiteSchema = z.infer<typeof updateRenfordIdentiteSchema>;

export const TYPE_MISSION = [
  'matwork',
  'reformer',
  'hot_pilates',
  'cadillac',
  'chair_wunda_chair',
  'petits_materiels',
  'pilates_prenatal_postnatal',
  'lagree_fitness',
  'hatha_yoga',
  'vinyasa_yoga',
  'ashtanga_yoga',
  'yin_yoga',
  'hot_yoga',
  'kundalini_yoga',
  'yoga_prenatal_postnatal',
  'yoga_nidra',
  'yoga_flow',
  'qi_gong_tai_chi',
  'caf_cuisses_abdos_fessiers',
  'lia_low_impact_aerobic',
  'step',
  'hiit',
  'circuit_training',
  'cross_training_crossfit',
  'trx',
  'biking_spinning',
  'body_barre',
  'stretching_mobilite',
  'cardio_boxing',
  'bootcamp',
  'gym_posturale_dos',
  'ems_electrostimulation',
  'preparation_physique_generale',
  'body_pump',
  'body_attack',
  'body_combat',
  'body_step',
  'body_balance',
  'body_jam',
  'rpm',
  'zumba_classique',
  'zumba_kids',
  'strong_toning',
  'zumba_step',
  'zumba_gold',
  'zumba_sentoa',
  'zumba_in_the_circuit',
  'zumba_strong',
  'aqua_zumba',
  'educateur_sportif_multisport',
  'animateur_sportif_enfants_ados',
  'intervenant_scolaire_eps',
  'animateur_sport_sante_seniors_apa',
  'animateur_aquatique',
  'hote_hotesse_d_accueil_sportif',
  'encadrement_en_salle_bloc_voie',
  'encadrement_en_milieu_naturel',
  'ouvreur_de_voies_blocs',
  'encadrement_escalade_performance',
  'cours_enfants_ados',
  'initiation_loisirs_adultes',
  'boxe_anglaise',
  'boxe_francaise_savate',
  'kickboxing',
  'karate',
  'judo',
  'mma',
  'muay_thai',
  'boxe_educative_enfants_ados',
  'cardio_boxe_boxe_fitness',
  'coaching_boxe_loisir_ou_competiteur',
  'danse_classique',
  'danse_contemporaine',
  'jazz_modern_jazz',
  'hip_hop_street_dance',
  'ragga_dancehall',
  'danses_latines_salsa_bachata',
  'danse_africaine',
  'danse_enfants',
  'barre_au_sol',
  'massages_bien_etre_sportifs',
  'kinesitherapie_sportive_hors_acte_medical',
  'massage_deep_tissue_recuperation',
  'reflexologie',
  'relaxation_coherence_cardiaque',
  'sonotherapie_bains_sonores',
  'sophrologie',
  'meditation_pleine_conscience',
  'stretch_and_mobilite_douce',
  'cryotherapie_pressotherapie',
  'nutrition_dietetique',
  'preparation_mentale',
] as const;

export const DIPLOME_KEYS = [
  'bpjeps_af_mention_cours_collectifs',
  'bpjeps_af_mention_halterophilie_musculation',
  'bpjeps_mapst',
  'bpjeps_apt',
  'bpjeps_ltp',
  'bpjeps_agff_ancienne_appellation',
  'dejeps_option_force_athletique_musculation',
  'dejeps_perfectionnement_sportif',
  'dejeps_specialite_sportive',
  'desjeps_performance_sportives',
  'licence_staps_management_du_sport',
  'licence_staps_education_et_motricite',
  'licence_staps_entrainement_sportif',
  'licence_staps_apa',
  'master_staps_apa',
  'master_staps_entrainement_sportif',
  'master_staps_preparation_physique',
  'master_staps_management_du_sport',
  'cqp_if_option_cours_collectifs',
  'cqp_if_option_musculation_and_personal_training',
  'cqp_als_option_agee',
  'bees_metiers_de_la_forme',
  'du_preparation_physique',
  'certification_yoga',
  'certification_pilates',
  'certification_zumba',
  'bpjeps_escalade',
  'dejeps_escalade',
  'cqp_escalade',
  'bees_escalade',
  'desjeps_escalade',
] as const;

// Schéma pour le profil Renford (étape 4)
export const updateRenfordProfilSchema = z.object({
  photoProfil: z.string().nullable().optional(),
  titreProfil: z.string().min(5, '5 caractères minimum').max(100, '100 caractères maximum'),
  descriptionProfil: z
    .string()
    .min(20, '20 caractères minimum')
    .max(1000, '1000 caractères maximum'),
  typeMission: z
    .array(z.enum(TYPE_MISSION), {
      required_error: 'Veuillez sélectionner au moins un type de mission',
      invalid_type_error: 'Le type de mission doit être un tableau de valeurs valides',
    })
    .min(1, 'Veuillez sélectionner au moins un type de mission'),
  assuranceRCPro: z.boolean(),
});

export type UpdateRenfordProfilSchema = z.infer<typeof updateRenfordProfilSchema>;

export const NIVEAU_EXPERIENCE = ['debutant', 'confirme', 'expert'] as const;

const preprocessOptionalNumber = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'number' && Number.isNaN(value)) return undefined;
  return value;
};

const tarifHoraireSchema = z.preprocess(
  preprocessOptionalNumber,
  z
    .number({
      required_error: 'Le tarif horaire est obligatoire',
      invalid_type_error: 'Le tarif horaire doit être un nombre valide',
    })
    .min(10, 'Le tarif horaire minimum est de 10€')
    .max(500, 'Le tarif horaire maximum est de 500€'),
);

const tarifJourneeSchema = z.preprocess(
  preprocessOptionalNumber,
  z
    .number({ invalid_type_error: 'Le tarif journée doit être un nombre valide' })
    .min(100, 'Le tarif journée minimum est de 100€')
    .max(5000, 'Le tarif journée maximum est de 5000€')
    .optional(),
);

const tarifDemiJourneeSchema = z.preprocess(
  preprocessOptionalNumber,
  z
    .number({ invalid_type_error: 'Le tarif demi-journée doit être un nombre valide' })
    .min(50, 'Le tarif demi-journée minimum est de 50€')
    .max(2000, 'Le tarif demi-journée maximum est de 2000€')
    .optional(),
);

// Schéma pour les qualifications Renford (étape 5)
export const updateRenfordQualificationsSchema = z
  .object({
    niveauExperience: z.enum(NIVEAU_EXPERIENCE, {
      required_error: "Le niveau d'expérience est obligatoire",
    }),
    diplomes: z
      .array(z.enum(DIPLOME_KEYS), {
        required_error: 'Veuillez sélectionner au moins un diplôme',
        invalid_type_error: 'Le format des diplômes est invalide',
      })
      .min(1, 'Veuillez sélectionner au moins un diplôme'),
    justificatifDiplomeChemins: z
      .array(z.string().min(1, 'Le justificatif diplôme est obligatoire'))
      .min(1, 'Veuillez ajouter les justificatifs de diplôme'),
    justificatifCarteProfessionnelleChemin: z
      .string({ required_error: 'Le justificatif carte professionnelle est obligatoire' })
      .min(1, 'Le justificatif carte professionnelle est obligatoire'),
    tarifHoraire: tarifHoraireSchema,
    proposeJournee: z.boolean().default(false),
    tarifJournee: tarifJourneeSchema,
    proposeDemiJournee: z.boolean().default(false),
    tarifDemiJournee: tarifDemiJourneeSchema,
  })
  .superRefine((data, ctx) => {
    if (data.justificatifDiplomeChemins.length !== data.diplomes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['justificatifDiplomeChemins'],
        message: 'Chaque diplôme sélectionné doit avoir un justificatif associé',
      });
    }

    if (data.proposeJournee && data.tarifJournee === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tarifJournee'],
        message: 'Le tarif journée est obligatoire quand cette option est activée',
      });
    }

    if (data.proposeDemiJournee && data.tarifDemiJournee === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tarifDemiJournee'],
        message: 'Le tarif demi-journée est obligatoire quand cette option est activée',
      });
    }
  });

export type UpdateRenfordQualificationsSchema = z.infer<typeof updateRenfordQualificationsSchema>;

// Schéma pour les infos bancaires Renford (étape 6)
export const updateRenfordBancaireSchema = z.object({
  iban: z.string().min(14, 'IBAN invalide').max(34, 'IBAN invalide'),
  carteIdentiteChemin: z.string().min(1, "La carte d'identité est obligatoire"),
});

export type UpdateRenfordBancaireSchema = z.infer<typeof updateRenfordBancaireSchema>;

const CRENEAUX_DISPONIBILITE = ['matin', 'midi', 'apres_midi', 'soir'] as const;
const disponibilitesJourSchema = z.array(z.enum(CRENEAUX_DISPONIBILITE));

// Schéma pour les disponibilités Renford (étape 7)
export const updateRenfordDisponibilitesSchema = z.object({
  disponibilitesLundi: disponibilitesJourSchema,
  disponibilitesMardi: disponibilitesJourSchema,
  disponibilitesMercredi: disponibilitesJourSchema,
  disponibilitesJeudi: disponibilitesJourSchema,
  disponibilitesVendredi: disponibilitesJourSchema,
  disponibilitesSamedi: disponibilitesJourSchema,
  disponibilitesDimanche: disponibilitesJourSchema,
  dureeIllimitee: z.boolean().default(true),
  dateDebut: z.string().or(z.date()).optional(),
  dateFin: z.string().or(z.date()).optional(),
  zoneDeplacement: z
    .number()
    .min(1, "La zone de déplacement doit être d'au moins 1 km")
    .max(200, 'La zone de déplacement ne peut pas dépasser 200 km'),
});

export type UpdateRenfordDisponibilitesSchema = z.infer<typeof updateRenfordDisponibilitesSchema>;
