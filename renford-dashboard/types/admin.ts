import type { StatutCompte, TypeUtilisateur } from "./utilisateur";
import type {
  StatutMission,
  DisciplineMission,
  ModeMission,
  MethodeTarificationMission,
  PlageHoraireMission,
  TypeMissionSpecialite,
  NiveauExperienceMission,
  MaterielMission,
} from "./mission";
import type { StatutMissionRenford } from "./mission-renford";

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
    adresse: string;
    codePostal: string;
    ville: string;
    adresseSiegeDifferente: boolean;
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
    stripeConnectOnboardingComplete: boolean;
    renfordDiplomes: Array<{
      id: string;
      typeDiplome: string;
      justificatifDiplomeChemin: string | null;
      mention: string | null;
      anneeObtention: number | null;
      etablissementFormation: string | null;
      verifie: boolean;
      dateVerification: string | null;
    }>;
    experiencesProfessionnelles: Array<{
      id: string;
      nom: string;
      etablissement: string;
      missions: string;
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

// ─── Admin mission list item ────────────────────────────────

export type AdminMissionListItem = {
  id: string;
  statut: StatutMission;
  modeMission: ModeMission;
  discipline: DisciplineMission;
  specialitePrincipale: TypeMissionSpecialite;
  dateDebut: string;
  dateFin: string | null;
  methodeTarification: MethodeTarificationMission;
  tarif: number | string | null;
  montantHT: number | string | null;
  montantTTC: number | string | null;
  dateCreation: string;
  etablissement: {
    id: string;
    nom: string;
    ville: string;
    profilEtablissement: {
      utilisateurId: string;
      avatarChemin: string | null;
    } | null;
  };
  _count: {
    missionsRenford: number;
  };
};

// ─── Admin mission detail ───────────────────────────────────

export type AdminMissionDetail = {
  id: string;
  statut: StatutMission;
  modeMission: ModeMission;
  discipline: DisciplineMission;
  specialitePrincipale: TypeMissionSpecialite;
  specialitesSecondaires: TypeMissionSpecialite[];
  niveauExperienceRequis: NiveauExperienceMission | null;
  assuranceObligatoire: boolean;
  materielsRequis: MaterielMission[];
  description: string | null;
  dateDebut: string;
  dateFin: string | null;
  methodeTarification: MethodeTarificationMission;
  tarif: number | string | null;
  montantHT: number | string | null;
  montantFraisService: number | string | null;
  montantTTC: number | string | null;
  pourcentageVariationTarif: number | string | null;
  dateCreation: string;
  dateMiseAJour: string;
  etablissement: {
    id: string;
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    typeEtablissement: string;
    emailPrincipal: string | null;
    telephonePrincipal: string | null;
    profilEtablissement: {
      id: string;
      utilisateurId: string;
      avatarChemin: string | null;
      raisonSociale: string | null;
    };
  };
  PlageHoraireMission: PlageHoraireMission[];
  missionsRenford: AdminMissionRenford[];
};

export type AdminMissionRenford = {
  id: string;
  missionId: string;
  profilRenfordId: string;
  statut: StatutMissionRenford;
  ordreShortlist: number | null;
  dateProposition: string;
  dateReponse: string | null;
  dateContratSigne: string | null;
  lienVisio: string | null;
  dateVisio: string | null;
  visioEffectuee: boolean;
  tarifNegocie: number | string | null;
  dateCreation: string;
  dateMiseAJour: string;
  profilRenford: {
    id: string;
    avatarChemin: string | null;
    titreProfil: string | null;
    noteMoyenne: number | null;
    utilisateur: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
      telephone: string | null;
    };
  };
  evaluation: {
    id: string;
    note: number;
    commentaire: string | null;
  } | null;
};

// ─── Admin paiement list item ───────────────────────────────

export type AdminPaiementListItem = {
  id: string;
  reference: string;
  missionId: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  montantCommission: number;
  montantNetRenford: number;
  statut: string;
  stripePaymentIntentId: string | null;
  dateCreation: string;
  dateCapture: string | null;
  dateLiberation: string | null;
  mission: {
    id: string;
    specialitePrincipale: string;
    dateDebut: string;
    dateFin: string | null;
    etablissement: {
      id: string;
      nom: string;
      profilEtablissement: {
        utilisateurId: string;
        avatarChemin: string | null;
      } | null;
    };
    missionsRenford: Array<{
      profilRenford: {
        utilisateurId: string;
        avatarChemin: string | null;
        utilisateur: {
          nom: string;
          prenom: string;
        };
      };
    }>;
  };
};
