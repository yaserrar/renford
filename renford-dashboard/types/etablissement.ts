import {
  DEPARTEMENT_IDF,
  ROLE_ETABLISSEMENT,
  TYPE_ETABLISSEMENT,
} from "@/validations/etablissement";

// Type d'établissement
export type TypeEtablissement = (typeof TYPE_ETABLISSEMENT)[number];

// Rôle d'établissement
export type RoleEtablissement = (typeof ROLE_ETABLISSEMENT)[number];

// Département Île-de-France
export type DepartementIDF = (typeof DEPARTEMENT_IDF)[number];

// Profil établissement
export type ProfilEtablissement = {
  id: string;
  utilisateurId: string;
  raisonSociale: string;
  siret: string;
  adresse: string;
  codePostal: string;
  ville: string;
  typeEtablissement: TypeEtablissement | null;
  adresseSiege: string | null;
  codePostalSiege: string | null;
  villeSiege: string | null;
  emailPrincipal: string | null;
  telephonePrincipal: string | null;
  nomContactPrincipal: string | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Établissement (site physique)
export type Etablissement = {
  id: string;
  profilEtablissementId: string;
  nom: string;
  typeEtablissement: TypeEtablissement;
  roleEtablissement: RoleEtablissement;
  adresse: string;
  adresseLigne2: string | null;
  codePostal: string;
  ville: string;
  departement: DepartementIDF;
  pays: string;
  latitude: number | null;
  longitude: number | null;
  telephone: string | null;
  email: string | null;
  etablissementPrincipalId: string | null;
  nomGroupePrincipal: string | null;
  actif: boolean;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Établissement simplifié pour les listes
export type EtablissementSimple = {
  id: string;
  nom: string;
  typeEtablissement: TypeEtablissement;
  ville: string;
  departement: DepartementIDF;
};
