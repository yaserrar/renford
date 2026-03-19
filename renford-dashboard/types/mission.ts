import {
  DISCIPLINE_MISSION,
  MATERIELS_MISSION,
  METHODE_TARIFICATION,
  MODE_MISSION,
  NIVEAU_EXPERIENCE_MISSION,
  STATUT_MISSION,
  TYPE_PAIEMENT,
} from "@/validations/mission";
import { TYPE_MISSION } from "@/validations/profil-renford";

export type ModeMission = (typeof MODE_MISSION)[number];
export type StatutMission = (typeof STATUT_MISSION)[number];
export type DisciplineMission = (typeof DISCIPLINE_MISSION)[number];
export type TypeMissionSpecialite = (typeof TYPE_MISSION)[number];
export type NiveauExperienceMission =
  (typeof NIVEAU_EXPERIENCE_MISSION)[number];
export type MaterielMission = (typeof MATERIELS_MISSION)[number];
export type MethodeTarificationMission = (typeof METHODE_TARIFICATION)[number];
export type TypePaiementMission = (typeof TYPE_PAIEMENT)[number];

export type PlageHoraireMission = {
  id: string;
  missionId: string;
  date: Date;
  heureDebut: string;
  heureFin: string;
  dateCreation: Date;
};

export type Mission = {
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
  etablissementId: string;
  dateDebut: Date;
  dateFin: Date;
  plageHorairesMission?: PlageHoraireMission[];
  methodeTarification: MethodeTarificationMission;
  tarif: number | null;
  pourcentageVariationTarif: number | null;
  typePaiement: TypePaiementMission;
  titulaireCarteBancaire: string | null;
  numeroCarteBancaire: string | null;
  dateExpirationCarte: string | null;
  cvvCarte: string | null;
  autorisationDebit: boolean;
  dateAutorisationDebit: Date | null;
  titulaireCompteBancaire: string | null;
  IBANCompteBancaire: string | null;
  BICCompteBancaire: string | null;
  autorisationPrelevement: boolean;
  dateAutorisationPrelevement: Date | null;
};

export type MissionSimple = Pick<
  Mission,
  | "id"
  | "statut"
  | "modeMission"
  | "discipline"
  | "dateDebut"
  | "dateFin"
  | "typePaiement"
>;
