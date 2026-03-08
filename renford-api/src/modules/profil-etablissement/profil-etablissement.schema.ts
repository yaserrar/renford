import { z } from 'zod';
import { TYPE_ETABLISSEMENT } from '../onboarding/onboarding.schema';

export const updateCouvertureProfilEtablissementSchema = z.object({
  imageCouvertureChemin: z.string().nullable(),
});

export type UpdateCouvertureProfilEtablissementSchema = z.infer<
  typeof updateCouvertureProfilEtablissementSchema
>;

export const updateAvatarProfilEtablissementSchema = z.object({
  avatarChemin: z.string().nullable(),
});

export type UpdateAvatarProfilEtablissementSchema = z.infer<
  typeof updateAvatarProfilEtablissementSchema
>;

export const updateInfosProfilEtablissementSchema = z.object({
  raisonSociale: z
    .string()
    .min(2, 'La raison sociale doit contenir au moins 2 caractères')
    .max(100, 'La raison sociale ne peut pas dépasser 100 caractères'),
  typeEtablissement: z.enum(TYPE_ETABLISSEMENT, {
    required_error: "Le type d'établissement est obligatoire",
  }),
  aPropos: z
    .string()
    .max(2000, "Le texte 'A propos' ne peut pas dépasser 2000 caractères")
    .nullable()
    .optional(),
});

export type UpdateInfosProfilEtablissementSchema = z.infer<
  typeof updateInfosProfilEtablissementSchema
>;

export const updateIdentiteProfilEtablissementSchema = z
  .object({
    raisonSociale: z
      .string()
      .min(2, 'La raison sociale doit contenir au moins 2 caractères')
      .max(100, 'La raison sociale ne peut pas dépasser 100 caractères'),
    siret: z
      .string()
      .length(14, 'Le numéro SIRET doit contenir exactement 14 chiffres')
      .regex(/^\d{14}$/, 'Le numéro SIRET ne doit contenir que des chiffres'),
    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
    codePostal: z.string().min(1, 'Le code postal est obligatoire'),
    ville: z
      .string()
      .min(2, 'La ville doit contenir au moins 2 caractères')
      .max(100, 'La ville ne peut pas dépasser 100 caractères'),
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
      message: "L'adresse du siège doit contenir au moins 5 caractères",
      path: ['adresseSiege'],
    },
  )
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.codePostalSiege && data.codePostalSiege.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Le code postal du siège est obligatoire',
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
      message: 'La ville du siège doit contenir au moins 2 caractères',
      path: ['villeSiege'],
    },
  );

export type UpdateIdentiteProfilEtablissementSchema = z.infer<
  typeof updateIdentiteProfilEtablissementSchema
>;
