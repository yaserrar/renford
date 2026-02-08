import {
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

// Type pour les jours de disponibilité
export type JoursDisponibles = {
  lundi: boolean;
  mardi: boolean;
  mercredi: boolean;
  jeudi: boolean;
  vendredi: boolean;
  samedi: boolean;
  dimanche: boolean;
};

// Type pour un créneau horaire
export type CreneauHoraire = {
  debut: string;
  fin: string;
};

// Profil Renford (Freelancer)
export type ProfilRenford = {
  id: string;
  utilisateurId: string;
  // Profil public (étape 4)
  titreProfil: string | null;
  descriptionProfil: string | null;
  photoProfil: string | null;
  typeMission: TypeMission | null;
  assuranceRCPro: boolean;
  // Informations légales (étape 3)
  siret: string | null;
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
  diplomes: string | null;
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
  joursDisponibles: JoursDisponibles | null;
  creneaux: CreneauHoraire[] | null;
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
