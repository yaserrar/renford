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
  'coaching_individuel',
  'sessions_en_groupe',
  'ateliers_workshops',
  'evenements_speciaux',
  'remplacement_temporaire',
  'consultation_accompagnement',
  'programmes_specifiques',
  'encadrement_enfants_adolescents',
  'formation_certification',
  'maintenance_gestion_equipements',
  'suivi_evaluation_clients',
  'encadrement_competitions',
  'animation_activites_loisirs',
  'seances_initiation',
  'consulting_amelioration_performances',
] as const;

export const DIPLOME_KEYS = [
  'licence_sciences_et_techniques_des_activites_physiques_et_sportives',
  'master_sciences_et_techniques_des_activites_physiques_et_sportives',
  'doctorat_en_sciences_du_sport',
  'brevet_professionnel_de_la_jeunesse_de_l_education_populaire_et_du_sport',
  'diplome_d_etat_de_la_jeunesse_de_l_education_populaire_et_du_sport',
  'diplome_d_etat_superieur_de_la_jeunesse_de_l_education_populaire_et_du_sport',
  'certificat_de_qualification_professionnelle',
  'brevet_federal',
  'brevet_d_etat_d_educateur_sportif',
  'certificat_d_aptitude_a_l_enseignement_de_la_danse',
  'diplome_d_etat_de_masseur_kinesitherapeute',
  'diplome_de_preparateur_physique',
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
