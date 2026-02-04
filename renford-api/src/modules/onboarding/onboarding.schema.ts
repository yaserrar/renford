import { z } from 'zod';

// Schéma pour la mise à jour des informations de contact (étape 1)
export const updateContactSchema = z.object({
  prenom: z.string().min(2, '2 caractères minimum'),
  nom: z.string().min(2, '2 caractères minimum'),
  telephone: z.string().min(10, 'Numéro de téléphone invalide'),
});

export type UpdateContactSchema = z.infer<typeof updateContactSchema>;

// Schéma pour la mise à jour du type d'utilisateur (étape 2)
export const updateTypeSchema = z.object({
  typeUtilisateur: z.enum(['etablissement', 'renford'], {
    required_error: "Le type d'utilisateur est obligatoire",
  }),
});

export type UpdateTypeSchema = z.infer<typeof updateTypeSchema>;

// Schéma pour la mise à jour du profil établissement (étape 3)
export const updateEtablissementSchema = z.object({
  raisonSociale: z.string().min(2, '2 caractères minimum'),
  siret: z.string().length(14, 'Le SIRET doit contenir 14 chiffres'),
  adresse: z.string().min(5, '5 caractères minimum'),
  codePostal: z.string().length(5, 'Le code postal doit contenir 5 chiffres'),
  ville: z.string().min(2, '2 caractères minimum'),
  typeEtablissement: z
    .enum([
      'creche',
      'maternelle',
      'elementaire',
      'college',
      'lycee_general',
      'lycee_professionnel',
      'universite',
      'ecole_superieure',
      'centre_loisirs',
      'club_sportif',
      'association',
      'entreprise',
      'collectivite',
      'autre',
    ])
    .optional(),
  adresseSiege: z.string().optional(),
  codePostalSiege: z.string().length(5, 'Le code postal doit contenir 5 chiffres').optional(),
  villeSiege: z.string().optional(),
});

export type UpdateEtablissementSchema = z.infer<typeof updateEtablissementSchema>;

// Schéma pour un favori Renford
export const favoriRenfordSchema = z.object({
  nomComplet: z.string().min(2, '2 caractères minimum'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
});

export type FavoriRenfordSchema = z.infer<typeof favoriRenfordSchema>;

// Schéma pour la mise à jour des favoris (étape 4)
export const updateFavorisSchema = z.object({
  favoris: z.array(favoriRenfordSchema),
});

export type UpdateFavorisSchema = z.infer<typeof updateFavorisSchema>;

// Schéma pour passer une étape
export const skipStepSchema = z.object({
  etape: z.number().min(1).max(5),
});

export type SkipStepSchema = z.infer<typeof skipStepSchema>;
