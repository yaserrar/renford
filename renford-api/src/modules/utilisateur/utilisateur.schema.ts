import { z } from 'zod';

export const TYPE_UTILISATEUR = ['etablissement', 'renford', 'administrateur'] as const;

export const STATUT_COMPTE = [
  'actif',
  'suspendu',
  'en_attente_verification',
  'onboarding',
] as const;

// Mise à jour du profil utilisateur
export const updateProfileSchema = z.object({
  nom: z.string().min(2, '2 caractères minimum').optional(),
  prenom: z.string().min(2, '2 caractères minimum').optional(),
  telephone: z.string().optional().nullable(),
  avatarChemin: z.string().optional().nullable(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

// Changement de mot de passe
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: 'Le mot de passe actuel est obligatoire' })
      .min(8, { message: '8 caractères minimum' }),
    newPassword: z
      .string({ required_error: 'Le nouveau mot de passe est obligatoire' })
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
      }),
    confirmPassword: z
      .string({ required_error: 'La confirmation du mot de passe est obligatoire' })
      .min(8, { message: '8 caractères minimum' }),
  })
  .refine((obj) => obj.newPassword === obj.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
