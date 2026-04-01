import type { StatutCompte, TypeUtilisateur } from "./utilisateur";

// ─── Admin list item ─────────────────────────────────────────

export type AdminListItem = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  statut: StatutCompte;
  dateCreation: string;
  derniereConnexion: string | null;
};

// ─── User list item (for admin user management) ─────────────

export type AdminUserListItem = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  typeUtilisateur: TypeUtilisateur;
  statut: StatutCompte;
  dateCreation: string;
  derniereConnexion: string | null;
  profilEtablissement: {
    id: string;
    avatarChemin: string | null;
  } | null;
  profilRenford: {
    id: string;
    avatarChemin: string | null;
    titreProfil: string | null;
  } | null;
};

// ─── User detail (for admin user detail page) ───────────────

export type AdminUserDetail = AdminUserListItem & {
  etapeOnboarding: number;
  emailVerifie: boolean;
  profilEtablissement: {
    id: string;
    avatarChemin: string | null;
    raisonSociale: string | null;
    siret: string | null;
    siretEnCoursObtention: boolean;
    formeJuridique: string | null;
    adresseSiege: string | null;
    codePostalSiege: string | null;
    villeSiege: string | null;
    etablissements: Array<{
      id: string;
      nom: string;
      adresse: string;
      codePostal: string;
      ville: string;
      avatarChemin: string | null;
    }>;
  } | null;
  profilRenford: {
    id: string;
    avatarChemin: string | null;
    titreProfil: string | null;
    dateNaissance: string | null;
    adresse: string | null;
    codePostal: string | null;
    ville: string | null;
    siret: string | null;
    siretEnCoursObtention: boolean;
    iban: string | null;
    bic: string | null;
    renfordDiplomes: Array<{
      id: string;
      intitule: string;
      organisme: string | null;
      anneeObtention: number | null;
    }>;
    experiencesProfessionnelles: Array<{
      id: string;
      intitulePoste: string;
      nomEntreprise: string | null;
      dateDebut: string | null;
      dateFin: string | null;
    }>;
  } | null;
};

// ─── Admin dashboard stats ──────────────────────────────────

export type AdminStats = {
  utilisateurs: {
    total: number;
    etablissements: number;
    renfords: number;
    actifs: number;
    suspendus: number;
    nouveaux30j: number;
  };
  missions: {
    total: number;
    enRecherche: number;
    enCours: number;
    terminees: number;
    annulees: number;
    nouvelles30j: number;
    tauxAcceptation: number;
  };
  messagesContactNonTraites: number;
  evolution: {
    utilisateurs: Array<{ mois: string; total: number }>;
    missions: Array<{ mois: string; total: number }>;
  };
};

// ─── Contact message (for admin) ────────────────────────────

export type ContactMessage = {
  id: string;
  email: string;
  sujet: string;
  texte: string;
  traite: boolean;
  traiteA: string | null;
  dateCreation: string;
  utilisateur: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    typeUtilisateur: TypeUtilisateur;
  };
};
