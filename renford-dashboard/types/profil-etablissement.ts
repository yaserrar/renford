import { TypeEtablissement, Etablissement } from "./etablissement";

export type ProfilEtablissement = {
  id: string;
  utilisateurId: string;
  avatarChemin: string | null;
  imageCouvertureChemin: string | null;
  raisonSociale: string;
  siret: string;
  aPropos: string | null;
  adresse: string;
  codePostal: string;
  ville: string;
  latitude: number | null;
  longitude: number | null;
  typeEtablissement: TypeEtablissement | null;
  adresseSiegeDifferente: boolean;
  adresseSiege: string | null;
  codePostalSiege: string | null;
  villeSiege: string | null;
  stripeCustomerId: string | null;
  etablissements: Etablissement[];
  dateCreation: Date;
  dateMiseAJour: Date;
};
