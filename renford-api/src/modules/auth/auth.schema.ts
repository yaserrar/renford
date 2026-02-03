import { z } from 'zod';

// Types d'utilisateurs pour l'authentification
export const TYPE_UTILISATEUR = ['etablissement', 'renford', 'administrateur'] as const;
export type TypeUtilisateur = (typeof TYPE_UTILISATEUR)[number];

// ============================================================================
// Schémas de connexion
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
  password: z
    .string({ required_error: 'Le mot de passe est obligatoire' })
    .min(8, { message: '8 caractères minimum' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// ============================================================================
// Schémas d'inscription - Base commune
// ============================================================================

const passwordSchema = z
  .string({ required_error: 'Le mot de passe est obligatoire' })
  .min(8, { message: '8 caractères minimum' })
  .refine((value) => /^(?=.*[a-z])/.test(value), {
    message: 'Le mot de passe doit contenir au moins une lettre minuscule',
  })
  .refine((value) => /^(?=.*[A-Z])/.test(value), {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule',
  })
  .refine((value) => /^(?=.*\d)/.test(value), {
    message: 'Le mot de passe doit contenir au moins un chiffre',
  })
  .refine((value) => /^(?=.*[^\da-zA-Z])/.test(value), {
    message: 'Le mot de passe doit contenir au moins un caractère spécial',
  });

const baseSignupSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
  password: passwordSchema,
  confirmPassword: z
    .string({ required_error: 'La confirmation du mot de passe est obligatoire' })
    .min(8, { message: '8 caractères minimum' }),
  nom: z
    .string({ required_error: 'Le nom est obligatoire' })
    .min(2, '2 caractères minimum')
    .max(100, '100 caractères maximum'),
  prenom: z
    .string({ required_error: 'Le prénom est obligatoire' })
    .min(2, '2 caractères minimum')
    .max(100, '100 caractères maximum'),
  telephone: z.string().optional(),
});

// ============================================================================
// Schéma d'inscription - Établissement
// ============================================================================

export const signupEtablissementSchema = baseSignupSchema
  .extend({
    // Informations légales (obligatoires)
    raisonSociale: z
      .string({ required_error: 'La raison sociale est obligatoire' })
      .min(2, '2 caractères minimum'),
    siret: z
      .string({ required_error: 'Le numéro SIRET est obligatoire' })
      .length(14, 'Le numéro SIRET doit contenir exactement 14 chiffres')
      .regex(/^\d{14}$/, 'Le numéro SIRET doit contenir uniquement des chiffres'),

    // Adresse de l'établissement (obligatoire)
    adresse: z
      .string({ required_error: "L'adresse est obligatoire" })
      .min(5, '5 caractères minimum'),
    codePostal: z
      .string({ required_error: 'Le code postal est obligatoire' })
      .regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),
    ville: z.string({ required_error: 'La ville est obligatoire' }).min(2, '2 caractères minimum'),

    // Type d'établissement (optionnel)
    typeEtablissement: z
      .enum([
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
      ])
      .optional(),

    // Adresse du siège (optionnel)
    adresseSiege: z.string().optional(),
    codePostalSiege: z
      .string()
      .regex(/^\d{5}$/, 'Le code postal du siège doit contenir 5 chiffres')
      .optional(),
    villeSiege: z.string().optional(),

    // Contact professionnel (optionnel)
    emailPrincipal: z.string().email({ message: "L'email est invalide" }).optional(),
    telephonePrincipal: z.string().optional(),
    nomContactPrincipal: z.string().optional(),
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type SignupEtablissementSchema = z.infer<typeof signupEtablissementSchema>;

// ============================================================================
// Schéma d'inscription - Renford (Freelancer)
// ============================================================================

// Niveaux d'expérience
export const NIVEAUX_EXPERIENCE = ['debutant', 'confirme', 'expert'] as const;

// Jours de la semaine
export const JOURS_SEMAINE = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
] as const;

export const signupRenfordSchema = baseSignupSchema
  .extend({
    // Profil public
    titreProfil: z.string().optional(),
    descriptionProfil: z.string().optional(),

    // Informations légales
    siret: z
      .string()
      .length(14, 'Le numéro SIRET doit contenir exactement 14 chiffres')
      .regex(/^\d{14}$/, 'Le numéro SIRET doit contenir uniquement des chiffres')
      .optional(),
    siretEnCoursObtention: z.boolean().default(false),
    attestationStatut: z.boolean({
      required_error: "L'attestation de statut est obligatoire",
    }),

    // Informations personnelles
    dateNaissance: z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => (typeof val === 'string' ? new Date(val) : val))
      .optional(),

    // Localisation
    adresse: z.string().optional(),
    codePostal: z
      .string()
      .regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres')
      .optional(),
    ville: z.string().optional(),
    pays: z.string().default('France'),

    // Zone de déplacement
    zoneDeplacement: z.number().int().positive().optional(),

    // Niveau d'expérience
    niveauExperience: z.enum(NIVEAUX_EXPERIENCE).optional(),

    // Tarification (au moins un requis côté front)
    tarifHoraire: z.number().positive('Le tarif horaire doit être positif').optional(),
    tarifJournee: z.number().positive('Le tarif journée doit être positif').optional(),
    tarifDemiJournee: z.number().positive('Le tarif demi-journée doit être positif').optional(),

    // Informations bancaires
    iban: z.string().optional(),

    // Disponibilité
    joursDisponibles: z.array(z.enum(JOURS_SEMAINE)).optional(),
    disponibiliteIllimitee: z.boolean().default(true),
    dateDebutDispo: z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => (typeof val === 'string' ? new Date(val) : val))
      .optional(),
    dateFinDispo: z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => (typeof val === 'string' ? new Date(val) : val))
      .optional(),
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
  .refine(
    (obj) => {
      // Si pas siretEnCoursObtention, siret est obligatoire
      if (!obj.siretEnCoursObtention && !obj.siret) {
        return false;
      }
      return true;
    },
    {
      message: "Le numéro SIRET est obligatoire si vous n'avez pas coché 'en cours d'obtention'",
      path: ['siret'],
    },
  );

export type SignupRenfordSchema = z.infer<typeof signupRenfordSchema>;

// ============================================================================
// Schéma d'inscription - Administrateur (création par un admin existant)
// ============================================================================

export const signupAdminSchema = baseSignupSchema.refine(
  (obj) => obj.password === obj.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  },
);

export type SignupAdminSchema = z.infer<typeof signupAdminSchema>;

// ============================================================================
// Vérification email
// ============================================================================

export const verifyEmailSchema = z.object({
  code: z
    .string({ required_error: 'Le code est obligatoire' })
    .length(6, 'Le code doit contenir 6 chiffres'),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" }),
});

export type ResendVerificationSchema = z.infer<typeof resendVerificationSchema>;

// ============================================================================
// Réinitialisation de mot de passe
// ============================================================================

export const passwordResetSendCodeSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
});

export type PasswordResetSendCodeSchema = z.infer<typeof passwordResetSendCodeSchema>;

export const passwordResetValidateCodeSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
  code: z.string({ required_error: 'Le code est obligatoire' }).length(6, 'Le code est invalide'),
});

export type PasswordResetValidateCodeSchema = z.infer<typeof passwordResetValidateCodeSchema>;

export const passwordResetUpdatePasswordSchema = z
  .object({
    email: z
      .string({ required_error: "L'email est obligatoire" })
      .email({ message: "L'email est invalide" })
      .max(250, '250 caractères maximum'),
    code: z.string({ required_error: 'Le code est obligatoire' }).length(6, 'Le code est invalide'),
    password: passwordSchema,
    confirmPassword: z
      .string({ required_error: 'La confirmation du mot de passe est obligatoire' })
      .min(8, { message: '8 caractères minimum' }),
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type PasswordResetUpdatePasswordSchema = z.infer<typeof passwordResetUpdatePasswordSchema>;
