import { z } from "zod";
import { TYPE_ETABLISSEMENT } from "./profil-etablissement";

// Rôle d'établissement (enum RoleEtablissement du Prisma schema)
export const ROLE_ETABLISSEMENT = ["principal", "secondaire"] as const;

const optionalNullableString = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  return value;
}, z.string().nullable());

const requiredContactString = (fieldLabel: string) =>
  z.preprocess(
    (value) => {
      if (value === null || value === undefined) return "";
      return typeof value === "string" ? value.trim() : value;
    },
    z
      .string({ required_error: `${fieldLabel} est obligatoire` })
      .min(2, `${fieldLabel} doit contenir au moins 2 caractères`)
      .max(120, `${fieldLabel} ne peut pas dépasser 120 caractères`),
  );

const requiredContactEmail = z.preprocess(
  (value) => {
    if (value === null || value === undefined) return "";
    return typeof value === "string" ? value.trim() : value;
  },
  z
    .string({ required_error: "L'email principal est obligatoire" })
    .min(1, "L'email principal est obligatoire")
    .email("Email invalide"),
);

export const upsertEtablissementSiteSchema = z
  .object({
    nom: z
      .string()
      .min(2, "Le nom de l'établissement doit contenir au moins 2 caractères")
      .max(
        120,
        "Le nom de l'établissement ne peut pas dépasser 120 caractères",
      ),
    adresse: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
    codePostal: z.string().min(1, "Le code postal est obligatoire"),
    ville: z
      .string()
      .min(2, "La ville doit contenir au moins 2 caractères")
      .max(100, "La ville ne peut pas dépasser 100 caractères"),
    latitude: z
      .number()
      .min(-90, "Latitude invalide")
      .max(90, "Latitude invalide"),
    longitude: z
      .number()
      .min(-180, "Longitude invalide")
      .max(180, "Longitude invalide"),
    siret: z
      .string({ required_error: "Le numéro SIRET est obligatoire" })
      .length(14, "Le numéro SIRET doit contenir exactement 14 chiffres")
      .regex(/^\d{14}$/, "Le numéro SIRET ne doit contenir que des chiffres"),
    typeEtablissement: z.enum(TYPE_ETABLISSEMENT, {
      required_error: "Veuillez sélectionner un type d'établissement",
    }),
    emailPrincipal: requiredContactEmail,
    telephonePrincipal: optionalNullableString.optional(),
    nomContactPrincipal: requiredContactString("Le nom du contact principal"),
    prenomContactPrincipal: requiredContactString(
      "Le prénom du contact principal",
    ),
    adresseFacturationDifferente: z.boolean().default(false),
    adresseFacturation: z.string().optional(),
    codePostalFacturation: z.string().optional(),
    villeFacturation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.adresseFacturationDifferente) {
      if (!data.adresseFacturation || data.adresseFacturation.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["adresseFacturation"],
          message:
            "L'adresse de facturation doit contenir au moins 5 caractères",
        });
      }

      if (
        !data.codePostalFacturation ||
        data.codePostalFacturation.trim().length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["codePostalFacturation"],
          message: "Le code postal de facturation est obligatoire",
        });
      }

      if (!data.villeFacturation || data.villeFacturation.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["villeFacturation"],
          message:
            "La ville de facturation doit contenir au moins 2 caractères",
        });
      }
    }
  });

export type UpsertEtablissementSiteSchema = z.infer<
  typeof upsertEtablissementSiteSchema
>;

export type CreateEtablissementSiteSchema = UpsertEtablissementSiteSchema;
export type UpdateEtablissementSiteSchema = UpsertEtablissementSiteSchema;
