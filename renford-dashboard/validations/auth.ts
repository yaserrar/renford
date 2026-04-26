import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, "250 caractères maximum"),
  password: z
    .string({ required_error: "Le mot de passe est obligatoire" })
    .min(8, { message: "8 caractères minimum" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

//----------------------------------------------------------------------------------------

const backendPasswordSchema = z
  .string({ required_error: "Le mot de passe est obligatoire" })
  .min(8, { message: "8 caractères minimum" })
  .refine((value) => /^(?=.*[a-z])/.test(value), {
    message: "Le mot de passe doit contenir au moins une lettre minuscule",
  })
  .refine((value) => /^(?=.*[A-Z])/.test(value), {
    message: "Le mot de passe doit contenir au moins une lettre majuscule",
  })
  .refine((value) => /^(?=.*\d)/.test(value), {
    message: "Le mot de passe doit contenir au moins un chiffre",
  });

//----------------------------------------------------------------------------------------

export const signupSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, "250 caractères maximum"),
  password: backendPasswordSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales",
  }),
});

export type SignupSchema = z.infer<typeof signupSchema>;

//----------------------------------------------------------------------------------------

export const emailSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, "250 caractères maximum"),
});

export const codeSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, "250 caractères maximum"),
  code: z
    .string({ required_error: "Le code est obligatoire" })
    .max(6, "Le code est invalide")
    .min(6, "Le code est invalide"),
});

export const passwordResetSchema = z.object({
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, "250 caractères maximum"),
  code: z
    .string({ required_error: "Le code est obligatoire" })
    .max(6, "Le code est invalide")
    .min(6, "Le code est invalide"),
  password: backendPasswordSchema,
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type CodeSchema = z.infer<typeof codeSchema>;
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>;

//----------------------------------------------------------------------------------------
