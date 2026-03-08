import { z } from "zod";

// Types d'établissement (enum TypeEtablissement du Prisma schema)
export const TYPE_ETABLISSEMENT = [
  "salle_sport_gymnase",
  "centre_fitness",
  "studio_yoga",
  "studio_pilates",
  "centre_bien_etre",
  "club_escalade",
  "centre_sports_aquatiques",
  "ecole_danse",
  "centre_formation_sportive",
  "club_sport_combat",
  "centre_arts_martiaux",
  "complexe_multisports",
  "club_golf",
  "club_tennis",
  "centre_athletisme",
  "etablissement_sports_extremes",
  "centre_equestre",
  "club_cyclisme",
  "club_course_pied",
  "club_tir_arc",
  "club_voile_nautique",
  "centre_musculation",
  "centre_reeducation",
  "stade_arene",
  "association_sportive",
  "complexe_loisirs",
  "academie_sportive",
  "ecole_surf",
] as const;

export type TypeEtablissement = (typeof TYPE_ETABLISSEMENT)[number];

// Labels pour l'affichage
export const TYPE_ETABLISSEMENT_LABELS: Record<TypeEtablissement, string> = {
  salle_sport_gymnase: "Salle de sport / Gymnase",
  centre_fitness: "Centre de fitness",
  studio_yoga: "Studio de yoga",
  studio_pilates: "Studio de pilates",
  centre_bien_etre: "Centre de bien-être",
  club_escalade: "Club d'escalade",
  centre_sports_aquatiques: "Centre de sports aquatiques",
  ecole_danse: "École de danse",
  centre_formation_sportive: "Centre de formation sportive",
  club_sport_combat: "Club de sport de combat",
  centre_arts_martiaux: "Centre d'arts martiaux",
  complexe_multisports: "Complexe multisports",
  club_golf: "Club de golf",
  club_tennis: "Club de tennis",
  centre_athletisme: "Centre d'athlétisme",
  etablissement_sports_extremes: "Établissement de sports extrêmes",
  centre_equestre: "Centre équestre",
  club_cyclisme: "Club de cyclisme",
  club_course_pied: "Club de course à pied",
  club_tir_arc: "Club de tir à l'arc",
  club_voile_nautique: "Club de voile / nautique",
  centre_musculation: "Centre de musculation",
  centre_reeducation: "Centre de rééducation",
  stade_arene: "Stade / Arène",
  association_sportive: "Association sportive",
  complexe_loisirs: "Complexe de loisirs",
  academie_sportive: "Académie sportive",
  ecole_surf: "École de surf",
};

export const updateProfilEtablissementCouvertureSchema = z.object({
  imageCouvertureChemin: z.string().nullable(),
});

export type UpdateProfilEtablissementCouvertureSchema = z.infer<
  typeof updateProfilEtablissementCouvertureSchema
>;

export const updateProfilEtablissementAvatarSchema = z.object({
  avatarChemin: z.string().nullable(),
});

export type UpdateProfilEtablissementAvatarSchema = z.infer<
  typeof updateProfilEtablissementAvatarSchema
>;

export const updateProfilEtablissementInfosSchema = z.object({
  raisonSociale: z
    .string()
    .min(2, "La raison sociale doit contenir au moins 2 caractères")
    .max(100, "La raison sociale ne peut pas dépasser 100 caractères"),
  typeEtablissement: z.enum(TYPE_ETABLISSEMENT, {
    required_error: "Veuillez sélectionner un type d'établissement",
  }),
  aPropos: z
    .string()
    .max(2000, "Le texte à propos ne peut pas dépasser 2000 caractères")
    .optional()
    .nullable(),
});

export type UpdateProfilEtablissementInfosSchema = z.infer<
  typeof updateProfilEtablissementInfosSchema
>;

export const updateProfilEtablissementIdentiteSchema = z
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
    typeEtablissement: z.enum(TYPE_ETABLISSEMENT, {
      required_error: "Veuillez sélectionner un type d'établissement",
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
      path: ["adresseSiege"],
    }
  )
  .refine(
    (data) => {
      if (data.adresseSiegeDifferente) {
        return !!data.codePostalSiege && data.codePostalSiege.trim().length > 0;
      }
      return true;
    },
    {
      message: "Le code postal du siège est obligatoire",
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

export type UpdateProfilEtablissementIdentiteSchema = z.infer<
  typeof updateProfilEtablissementIdentiteSchema
>;
