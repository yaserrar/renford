// Type d'utilisateur
export type TypeUtilisateur = "etablissement" | "renford" | "administrateur";

// Statut du compte
export type StatutCompte =
  | "actif"
  | "suspendu"
  | "banni"
  | "en_attente_verification"
  | "desactive";

// Utilisateur courant (retourné par /utilisateur/me)
export type CurrentUser = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  avatarChemin: string | null;
  typeUtilisateur: TypeUtilisateur;
  statutCompte: StatutCompte;
  emailVerifie: boolean;
  dateCreation: Date;
  derniereConnexion: Date | null;
  // Relations selon le type d'utilisateur
  profilEtablissement: ProfilEtablissement | null;
  profilRenford: ProfilRenford | null;
};

// Profil établissement
export type ProfilEtablissement = {
  id: string;
  raisonSociale: string;
  siret: string;
  adresse: string;
  codePostal: string;
  ville: string;
  typeEtablissement: string | null;
  emailPrincipal: string | null;
  telephonePrincipal: string | null;
  nomContactPrincipal: string | null;
};

// Profil Renford (Freelancer)
export type ProfilRenford = {
  id: string;
  titreProfil: string | null;
  descriptionProfil: string | null;
  photoProfilChemin: string | null;
  siret: string | null;
  siretEnCoursObtention: boolean;
  attestationStatut: boolean;
  adresse: string | null;
  codePostal: string | null;
  ville: string | null;
  niveauExperience: string | null;
  statutCertification: string;
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
