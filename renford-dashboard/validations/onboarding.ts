import { z } from "zod";

// Étape 1: Informations de contact
export const onboardingContactSchema = z.object({
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  telephone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres"),
});

export type OnboardingContactSchema = z.infer<typeof onboardingContactSchema>;

// Étape 2: Type d'utilisateur
export const TYPE_UTILISATEUR_ONBOARDING = [
  "etablissement",
  "renford",
] as const;

export const onboardingTypeSchema = z.object({
  typeUtilisateur: z.enum(TYPE_UTILISATEUR_ONBOARDING, {
    required_error: "Veuillez sélectionner un type de profil",
  }),
});

export type OnboardingTypeSchema = z.infer<typeof onboardingTypeSchema>;

// Étape 3: Informations établissement
export const onboardingEtablissementSchema = z.object({
  raisonSociale: z
    .string()
    .min(2, "La raison sociale doit contenir au moins 2 caractères")
    .max(100, "La raison sociale ne peut pas dépasser 100 caractères"),
  siret: z
    .string()
    .length(14, "Le numéro SIRET doit contenir exactement 14 chiffres")
    .regex(/^\d{14}$/, "Le numéro SIRET ne doit contenir que des chiffres"),
  adresse: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
  codePostal: z
    .string()
    .length(5, "Le code postal doit contenir exactement 5 chiffres")
    .regex(/^\d{5}$/, "Le code postal ne doit contenir que des chiffres"),
  ville: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne peut pas dépasser 100 caractères"),
  typeEtablissement: z.string({
    required_error: "Veuillez sélectionner un type d'établissement",
  }),
  // Adresse du siège (optionnel)
  adresseSiegeDifferente: z.boolean().optional(),
  adresseSiege: z.string().optional(),
  codePostalSiege: z.string().optional(),
  villeSiege: z.string().optional(),
});

export type OnboardingEtablissementSchema = z.infer<
  typeof onboardingEtablissementSchema
>;

// Étape 4: Inviter des Renfords (favoris)
export const favoriRenfordSchema = z.object({
  nomComplet: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  telephone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres")
    .optional()
    .or(z.literal("")),
});

export type FavoriRenfordSchema = z.infer<typeof favoriRenfordSchema>;

export const onboardingFavorisSchema = z.object({
  favoris: z.array(favoriRenfordSchema).optional(),
});

export type OnboardingFavorisSchema = z.infer<typeof onboardingFavorisSchema>;

// Étape de complétion
export const onboardingCompleteSchema = z.object({
  etape: z.number().min(1).max(5),
});

export type OnboardingCompleteSchema = z.infer<typeof onboardingCompleteSchema>;
