import {
  CRENEAUX_DISPONIBILITE,
  DIPLOME_KEYS,
  JOUR_SEMAINE,
  NIVEAU_EXPERIENCE,
  STATUT_CERTIFICATION,
  TYPE_POSTE,
  TypeMission,
} from "@/validations/profil-renford";

// Statut de certification
export type StatutCertification = (typeof STATUT_CERTIFICATION)[number];

// Niveau d'expérience
export type NiveauExperience = (typeof NIVEAU_EXPERIENCE)[number];

// Jour de la semaine
export type JourSemaine = (typeof JOUR_SEMAINE)[number];

// Type de poste
export type TypePoste = (typeof TYPE_POSTE)[number];
export type DiplomeKey = (typeof DIPLOME_KEYS)[number];
export type CreneauDisponibilite = (typeof CRENEAUX_DISPONIBILITE)[number];

// Profil Renford (Freelancer)
export type ProfilRenford = {
  id: string;
  utilisateurId: string;
  // Profil public (étape 4)
  titreProfil: string | null;
  descriptionProfil: string | null;
  photoProfil: string | null;
  typeMission: TypeMission[];
  assuranceRCPro: boolean;
  // Informations légales (étape 3)
  siret: string | null;
  siretEnCoursObtention: boolean;
  attestationAutoEntrepreneur: boolean;
  attestationVigilanceChemin: string | null;
  // Informations personnelles
  dateNaissance: Date | null;
  adresse: string | null;
  codePostal: string | null;
  ville: string | null;
  pays: string | null;
  zoneDeplacement: number | null;
  // Certification
  statutCertification: StatutCertification;
  dateCertification: Date | null;
  // Documents (étape 5 et 6)
  carteIdentiteChemin: string | null;
  justificatifDiplomeChemin: string | null;
  justificatifCarteProfessionnelleChemin: string | null;
  diplomes: DiplomeKey[];
  // Expérience (étape 5)
  niveauExperience: NiveauExperience | null;
  // Tarification (étape 5)
  tarifHoraire: number | null;
  proposeJournee: boolean;
  tarifJournee: number | null;
  proposeDemiJournee: boolean;
  tarifDemiJournee: number | null;
  // Informations bancaires (étape 6)
  iban: string | null;
  // Disponibilité (étape 7)
  disponibilitesLundi: CreneauDisponibilite[];
  disponibilitesMardi: CreneauDisponibilite[];
  disponibilitesMercredi: CreneauDisponibilite[];
  disponibilitesJeudi: CreneauDisponibilite[];
  disponibilitesVendredi: CreneauDisponibilite[];
  disponibilitesSamedi: CreneauDisponibilite[];
  disponibilitesDimanche: CreneauDisponibilite[];
  dureeIllimitee: boolean;
  dateDebut: Date | null;
  dateFin: Date | null;
  // Statistiques calculées
  nombreMissionsCompletees: number;
  noteMoyenne: number | null;
  chiffreAffairesTotal: number | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Profil Renford simplifié pour les listes
export type ProfilRenfordSimple = {
  id: string;
  utilisateurId: string;
  titreProfil: string | null;
  photoProfil: string | null;
  statutCertification: StatutCertification;
  niveauExperience: NiveauExperience | null;
  noteMoyenne: number | null;
  ville: string | null;
};

// Type de poste du Renford
export type RenfordTypePoste = {
  id: string;
  profilRenfordId: string;
  typePoste: TypePoste;
  dateCreation: Date;
};

// Spécialisation du Renford
export type RenfordSpecialisation = {
  id: string;
  profilRenfordId: string;
  typePoste: TypePoste;
  nomSpecialisation: string;
  dateCreation: Date;
};

// Diplôme du Renford
export type RenfordDiplome = {
  id: string;
  profilRenfordId: string;
  typeDiplome: string;
  nomDiplome: string;
  mention: string | null;
  specialite: string | null;
  anneeObtention: number | null;
  etablissementFormation: string | null;
  documentId: string | null;
  verifie: boolean;
  dateVerification: Date | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};
