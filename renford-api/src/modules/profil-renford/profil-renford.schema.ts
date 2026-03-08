import { z } from 'zod';
import { DIPLOME_KEYS, NIVEAU_EXPERIENCE, TYPE_MISSION } from '../onboarding/onboarding.schema';

export const updateCouvertureSchema = z.object({
  imageCouvertureChemin: z.string().nullable(),
});

export type UpdateCouvertureSchema = z.infer<typeof updateCouvertureSchema>;

export const updateAvatarSchema = z.object({
  avatarChemin: z.string().nullable(),
});

export type UpdateAvatarSchema = z.infer<typeof updateAvatarSchema>;

export const updateProfilRenfordSchema = z.object({
  titreProfil: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  descriptionProfil: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  typeMission: z
    .array(z.enum(TYPE_MISSION), {
      required_error: 'Veuillez sélectionner au moins un type de mission',
    })
    .min(1, 'Veuillez sélectionner au moins un type de mission'),
  assuranceRCPro: z.boolean(),
});

export type UpdateProfilRenfordSchema = z.infer<typeof updateProfilRenfordSchema>;

export const updateDescriptionProfilSchema = z.object({
  descriptionProfil: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
});

export type UpdateDescriptionProfilSchema = z.infer<typeof updateDescriptionProfilSchema>;

const CRENEAUX_DISPONIBILITE = ['matin', 'midi', 'apres_midi', 'soir'] as const;
const disponibilitesJourSchema = z.array(z.enum(CRENEAUX_DISPONIBILITE));

export const updateDisponibilitesProfilSchema = z.object({
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

export type UpdateDisponibilitesProfilSchema = z.infer<typeof updateDisponibilitesProfilSchema>;

const optionalNumberFromInput = z.preprocess((value) => {
  if (value === '' || value === undefined) return null;
  if (typeof value === 'string') return Number(value);
  return value;
}, z.number().int().min(1900).max(2100).nullable());

const optionalStringFromInput = z.preprocess((value) => {
  if (value === '') return null;
  return value;
}, z.string().nullable());

export const updateExperiencesProfilSchema = z.object({
  experiencesProfessionnelles: z.array(
    z.object({
      nom: z
        .string()
        .min(2, 'Le nom du poste doit contenir au moins 2 caractères')
        .max(100, 'Le nom du poste ne peut pas dépasser 100 caractères'),
      etablissement: z
        .string()
        .min(2, "Le nom de l'établissement doit contenir au moins 2 caractères")
        .max(120, "Le nom de l'établissement ne peut pas dépasser 120 caractères"),
      missions: z
        .string()
        .min(5, 'La description des missions doit contenir au moins 5 caractères')
        .max(1000, 'La description des missions ne peut pas dépasser 1000 caractères'),
      dateDebut: z.string().or(z.date()),
      dateFin: z.string().or(z.date()).nullable().optional(),
    }),
  ),
});

export type UpdateExperiencesProfilSchema = z.infer<typeof updateExperiencesProfilSchema>;

export const updateDiplomesProfilSchema = z.object({
  renfordDiplomes: z.array(
    z.object({
      typeDiplome: z.enum(DIPLOME_KEYS),
      anneeObtention: optionalNumberFromInput,
      mention: optionalStringFromInput,
      etablissementFormation: optionalStringFromInput,
      justificatifDiplomeChemin: optionalStringFromInput,
    }),
  ),
});

export type UpdateDiplomesProfilSchema = z.infer<typeof updateDiplomesProfilSchema>;

export const updatePortfolioProfilSchema = z.object({
  portfolio: z.array(z.string().min(1, 'Le chemin image est requis')),
});

export type UpdatePortfolioProfilSchema = z.infer<typeof updatePortfolioProfilSchema>;

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

export const updateQualificationsProfilSchema = z
  .object({
    niveauExperience: z.enum(NIVEAU_EXPERIENCE, {
      required_error: "Le niveau d'expérience est obligatoire",
    }),
    justificatifCarteProfessionnelleChemin: z
      .string({
        required_error: 'Le justificatif carte professionnelle est obligatoire',
      })
      .min(1, 'Le justificatif carte professionnelle est obligatoire'),
    tarifHoraire: tarifHoraireSchema,
    proposeJournee: z.boolean().default(false),
    tarifJournee: tarifJourneeSchema,
    proposeDemiJournee: z.boolean().default(false),
    tarifDemiJournee: tarifDemiJourneeSchema,
  })
  .superRefine((data, ctx) => {
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

export type UpdateQualificationsProfilSchema = z.infer<typeof updateQualificationsProfilSchema>;

export const updateIdentiteProfilSchema = z
  .object({
    telephone: z
      .string()
      .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
      .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres'),
    siret: z.string().optional(),
    siretEnCoursObtention: z.boolean(),
    attestationAutoEntrepreneur: z.boolean(),
    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
    codePostal: z.string().min(1, 'Le code postal est obligatoire'),
    ville: z
      .string()
      .min(2, 'La ville doit contenir au moins 2 caractères')
      .max(100, 'La ville ne peut pas dépasser 100 caractères'),
    latitude: z.number().min(-90, 'Latitude invalide').max(90, 'Latitude invalide').optional(),
    longitude: z.number().min(-180, 'Longitude invalide').max(180, 'Longitude invalide').optional(),
    pays: z.string().min(2, 'Le pays est obligatoire'),
    dateNaissance: z.string().or(z.date()),
    attestationVigilanceChemin: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.siretEnCoursObtention) {
      if (!data.siret || !/^\d{14}$/.test(data.siret)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['siret'],
          message: 'Le numéro SIRET doit contenir exactement 14 chiffres',
        });
      }
    }
  });

export type UpdateIdentiteProfilSchema = z.infer<typeof updateIdentiteProfilSchema>;
