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
// Schéma d'inscription - Simple et unifié
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
  });

export const signupSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
  password: passwordSchema,
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

export type SignupSchema = z.infer<typeof signupSchema>;

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

export const passwordResetUpdatePasswordSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
  code: z.string({ required_error: 'Le code est obligatoire' }).length(6, 'Le code est invalide'),
  password: passwordSchema,
});

export type PasswordResetUpdatePasswordSchema = z.infer<typeof passwordResetUpdatePasswordSchema>;
