import { STATUT_COMPTE, TYPE_UTILISATEUR } from "@/validations/utilisateur";
import { ProfilEtablissement } from "./etablissement";
import { ProfilRenford } from "./profil-renford";

// Type d'utilisateur
export type TypeUtilisateur = (typeof TYPE_UTILISATEUR)[number];

// Statut du compte
export type StatutCompte = (typeof STATUT_COMPTE)[number];

// Utilisateur courant (retourné par /utilisateur/me)
export type CurrentUser = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  avatarChemin: string | null;
  typeUtilisateur: TypeUtilisateur;
  statut: StatutCompte;
  etapeOnboarding: number;
  emailVerifie: boolean;
  dateCreation: Date;
  derniereConnexion: Date | null;
  // Relations selon le type d'utilisateur
  profilEtablissement: ProfilEtablissement | null;
  profilRenford: ProfilRenford | null;
};

// Types simplifiés pour les relations
export type UtilisateurSimple = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  avatarChemin: string | null;
};

// Réponse du JWT token
export type JwtToken = {
  token: string;
};
