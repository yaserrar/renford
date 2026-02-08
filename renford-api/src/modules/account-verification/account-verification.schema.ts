import { z } from 'zod';

// ============================================================================
// Vérification email - Code
// ============================================================================

export const verifyEmailSchema = z.object({
  code: z
    .string({ required_error: 'Le code est obligatoire' })
    .length(6, 'Le code doit contenir 6 chiffres'),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

// ============================================================================
// Renvoi du code de vérification
// ============================================================================

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" }),
});

export type ResendVerificationSchema = z.infer<typeof resendVerificationSchema>;
