import { ROLE_ETABLISSEMENT } from "@/validations/etablissement";
import { TYPE_ETABLISSEMENT } from "@/validations/profil-etablissement";

// Type d'établissement
export type TypeEtablissement = (typeof TYPE_ETABLISSEMENT)[number];

// Rôle d'établissement
export type RoleEtablissement = (typeof ROLE_ETABLISSEMENT)[number];

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
  adresseSiegeDifferente: boolean;
  adresseSiege: string | null;
  codePostalSiege: string | null;
  villeSiege: string | null;
  etablissements: Etablissement[];
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
  siret: string;
  adresse: string;
  adresseLigne2: string | null;
  codePostal: string;
  ville: string;
  pays: string;
  emailPrincipal: string | null;
  telephonePrincipal: string | null;
  nomContactPrincipal: string | null;
  prenomContactPrincipal: string | null;
  adresseFacturationDifferente: boolean;
  adresseFacturation: string;
  adresseFacturationLigne2: string | null;
  codePostalFacturation: string;
  villeFacturation: string;
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
};
