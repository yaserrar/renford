import {
  METHODE_TARIFICATION,
  MODE_MISSION,
  STATUT_MISSION,
  STATUT_MISSION_RENFORD,
  TRANCHE_TARIF_HORAIRE,
} from "@/validations/mission";
import { TypePoste, NiveauExperience } from "./profil-renford";

// Mode de mission
export type ModeMission = (typeof MODE_MISSION)[number];

// Statut de mission
export type StatutMission = (typeof STATUT_MISSION)[number];

// Méthode de tarification
export type MethodeTarification = (typeof METHODE_TARIFICATION)[number];

// Tranche de tarif horaire
export type TrancheTarifHoraire = (typeof TRANCHE_TARIF_HORAIRE)[number];

// Statut mission-renford
export type StatutMissionRenford = (typeof STATUT_MISSION_RENFORD)[number];

// Mission
export type Mission = {
  id: string;
  reference: string;
  etablissementId: string;
  modeMission: ModeMission;
  statut: StatutMission;
  titre: string | null;
  description: string | null;
  typePosteRecherche: TypePoste;
  specialisationRecherchee: string | null;
  niveauExperienceRequis: NiveauExperience | null;
  dateDebut: Date;
  dateFin: Date;
  nombreHeuresTotal: number | null;
  methodeTarification: MethodeTarification;
  trancheTarifHoraire: TrancheTarifHoraire | null;
  tarifHorairePrecis: number | null;
  montantForfaitaire: number | null;
  nombreParticipants: number | null;
  montantEstimeHT: number | null;
  montantCommission: number | null;
  montantTotalTTC: number | null;
  materielRequis: string[];
  notesFraisPrisesEnCharge: boolean;
  diplomeRequis: string | null;
  niveauCours: string | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Plage horaire de mission
export type PlageHoraireMission = {
  id: string;
  missionId: string;
  date: Date;
  heureDebut: string;
  heureFin: string;
  dateCreation: Date;
};

// Association Mission-Renford
export type MissionRenford = {
  id: string;
  missionId: string;
  profilRenfordId: string;
  statut: StatutMissionRenford;
  estShortliste: boolean;
  ordreShortlist: number | null;
  dateProposition: Date;
  dateReponse: Date | null;
  dateContratSigne: Date | null;
  lienVisio: string | null;
  dateVisio: Date | null;
  visioEffectuee: boolean;
  tarifNegocie: number | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Mission simplifiée pour les listes
export type MissionSimple = {
  id: string;
  reference: string;
  titre: string | null;
  typePosteRecherche: TypePoste;
  statut: StatutMission;
  modeMission: ModeMission;
  dateDebut: Date;
  dateFin: Date;
};
