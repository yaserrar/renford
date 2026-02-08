import { z } from "zod";
import { TYPE_ETABLISSEMENT } from "./profil-etablissement";
import { NIVEAU_EXPERIENCE, TYPE_MISSION } from "./profil-renford";
import { TYPE_UTILISATEUR } from "./utilisateur";

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

export const onboardingTypeSchema = z.object({
  typeUtilisateur: z.enum(TYPE_UTILISATEUR, {
    required_error: "Veuillez sélectionner un type de profil",
  }),
});

export type OnboardingTypeSchema = z.infer<typeof onboardingTypeSchema>;

// Étape 3: Informations établissement
export const onboardingEtablissementSchema = z
  .object({
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
    typeEtablissement: z.enum(TYPE_ETABLISSEMENT, {
      required_error: "Veuillez sélectionner un type d'établissement",
    }),
    // Adresse du siège social (conditionnellement obligatoire)
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
      message: "L'adresse du siège doit contenir au moins 5 caractères",
      path: ["adresseSiege"],
    }
  )
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.codePostalSiege && /^\d{5}$/.test(data.codePostalSiege);
      }
      return true;
    },
    {
      message: "Le code postal du siège doit contenir exactement 5 chiffres",
      path: ["codePostalSiege"],
    }
  )
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.villeSiege && data.villeSiege.length >= 2;
      }
      return true;
    },
    {
      message: "La ville du siège doit contenir au moins 2 caractères",
      path: ["villeSiege"],
    }
  );

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

// ============================================================================
// Schémas spécifiques aux Renfords
// ============================================================================

// Étape 3 Renford: Identité légale
export const onboardingRenfordIdentiteSchema = z.object({
  siret: z
    .string()
    .length(14, "Le numéro SIRET doit contenir exactement 14 chiffres")
    .regex(/^\d{14}$/, "Le numéro SIRET ne doit contenir que des chiffres"),
  attestationAutoEntrepreneur: z.boolean(),
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
  pays: z.string().min(2, "Le pays est obligatoire"),
  dateNaissance: z.date({
    required_error: "La date de naissance est obligatoire",
  }),
  attestationVigilanceChemin: z.string().optional(),
});

export type OnboardingRenfordIdentiteSchema = z.infer<
  typeof onboardingRenfordIdentiteSchema
>;

// Étape 4 Renford: Profil public
export const onboardingRenfordProfilSchema = z.object({
  photoProfil: z.string().optional(),
  titreProfil: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  descriptionProfil: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  typeMission: z.enum(TYPE_MISSION, {
    required_error: "Veuillez sélectionner un type de mission",
  }),
  assuranceRCPro: z.boolean().refine((val) => val === true, {
    message: "Vous devez certifier avoir une assurance RC Pro",
  }),
});

export type OnboardingRenfordProfilSchema = z.infer<
  typeof onboardingRenfordProfilSchema
>;

// Étape 5 Renford: Qualifications et expériences
export const onboardingRenfordQualificationsSchema = z.object({
  niveauExperience: z.enum(NIVEAU_EXPERIENCE, {
    required_error: "Veuillez sélectionner votre niveau d'expérience",
  }),
  diplomes: z.string().optional(),
  justificatifDiplomeChemin: z.string().optional(),
  justificatifCarteProfessionnelleChemin: z.string().optional(),
  tarifHoraire: z.coerce
    .number()
    .min(10, "Le tarif horaire minimum est de 10€")
    .max(500, "Le tarif horaire maximum est de 500€"),
  proposeJournee: z.boolean(),
  tarifJournee: z.coerce
    .number()
    .min(100, "Le tarif journée minimum est de 100€")
    .max(5000, "Le tarif journée maximum est de 5000€")
    .optional(),
  proposeDemiJournee: z.boolean(),
  tarifDemiJournee: z.coerce
    .number()
    .min(50, "Le tarif demi-journée minimum est de 50€")
    .max(2000, "Le tarif demi-journée maximum est de 2000€")
    .optional(),
});

export type OnboardingRenfordQualificationsSchema = z.infer<
  typeof onboardingRenfordQualificationsSchema
>;

// Étape 6 Renford: Informations bancaires
export const onboardingRenfordBancaireSchema = z.object({
  iban: z.string().min(14, "L'IBAN doit contenir au moins 14 caractères"),
  carteIdentiteChemin: z.string().min(1, "La carte d'identité est obligatoire"),
});

export type OnboardingRenfordBancaireSchema = z.infer<
  typeof onboardingRenfordBancaireSchema
>;

// Schéma pour les jours de disponibilité
const joursDisponiblesSchema = z.object({
  lundi: z.boolean(),
  mardi: z.boolean(),
  mercredi: z.boolean(),
  jeudi: z.boolean(),
  vendredi: z.boolean(),
  samedi: z.boolean(),
  dimanche: z.boolean(),
});

// Schéma pour un créneau horaire
const creneauSchema = z.object({
  debut: z.string(),
  fin: z.string(),
});

// Étape 7 Renford: Disponibilités
export const onboardingRenfordDisponibilitesSchema = z.object({
  joursDisponibles: joursDisponiblesSchema,
  creneaux: z.array(creneauSchema).optional(),
  dureeIllimitee: z.boolean(),
  dateDebut: z.date().optional(),
  dateFin: z.date().optional(),
  zoneDeplacement: z.coerce
    .number()
    .min(1, "La zone de déplacement doit être d'au moins 1 km")
    .max(200, "La zone de déplacement ne peut pas dépasser 200 km"),
});

export type OnboardingRenfordDisponibilitesSchema = z.infer<
  typeof onboardingRenfordDisponibilitesSchema
>;

// Étape de complétion
export const onboardingCompleteSchema = z.object({
  etape: z.number().min(1).max(8),
});

export type OnboardingCompleteSchema = z.infer<typeof onboardingCompleteSchema>;
