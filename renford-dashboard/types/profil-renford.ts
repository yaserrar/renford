import {
  JOUR_SEMAINE,
  NIVEAU_EXPERIENCE,
  STATUT_CERTIFICATION,
  TYPE_POSTE,
} from "@/validations/profil-renford";

// Statut de certification
export type StatutCertification = (typeof STATUT_CERTIFICATION)[number];

// Niveau d'expérience
export type NiveauExperience = (typeof NIVEAU_EXPERIENCE)[number];

// Jour de la semaine
export type JourSemaine = (typeof JOUR_SEMAINE)[number];

// Type de poste
export type TypePoste = (typeof TYPE_POSTE)[number];

// Profil Renford (Freelancer)
export type ProfilRenford = {
  id: string;
  utilisateurId: string;
  titreProfil: string | null;
  descriptionProfil: string | null;
  photoProfilChemin: string | null;
  siret: string | null;
  siretEnCoursObtention: boolean;
  attestationStatut: boolean;
  dateNaissance: Date | null;
  adresse: string | null;
  codePostal: string | null;
  ville: string | null;
  pays: string | null;
  zoneDeplacement: number | null;
  statutCertification: StatutCertification;
  dateCertification: Date | null;
  carteIdentiteChemin: string | null;
  attestationVigilanceChemin: string | null;
  justificatifsDiplomesChemins: string[];
  justificatifsCarteProChemins: string[];
  niveauExperience: NiveauExperience | null;
  tarifHoraire: number | null;
  tarifJournee: number | null;
  tarifDemiJournee: number | null;
  iban: string | null;
  joursDisponibles: JourSemaine[];
  disponibiliteIllimitee: boolean;
  dateDebutDispo: Date | null;
  dateFinDispo: Date | null;
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
  photoProfilChemin: string | null;
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
