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
import { Etablissement } from "@/types/etablissement";
import { MissionRenford } from "@/types/mission-renford";

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
  date: Date | string;
  heureDebut: string;
  heureFin: string;
  dateCreation?: Date | string;
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
  dateDebut: Date | string;
  dateFin: Date | string;
  methodeTarification: MethodeTarificationMission;
  tarif: number | string | null;
  pourcentageVariationTarif: number | string | null;
  typePaiement: TypePaiementMission;
  titulaireCarteBancaire: string | null;
  numeroCarteBancaire: string | null;
  dateExpirationCarte: string | null;
  cvvCarte: string | null;
  autorisationDebit: boolean;
  dateAutorisationDebit: Date | string | null;
  titulaireCompteBancaire: string | null;
  IBANCompteBancaire: string | null;
  BICCompteBancaire: string | null;
  autorisationPrelevement: boolean;
  dateAutorisationPrelevement: Date | string | null;
  dateCreation?: Date | string;
  dateMiseAJour?: Date | string;
};

export type MissionEtablissement = Mission & {
  PlageHoraireMission?: PlageHoraireMission[];
  etablissement?: Etablissement;

  totalHours?: number;
};

export type MissionDetailsEtablissement = MissionEtablissement & {
  missionsRenford: MissionRenford[];
};

export type EtablissementMissionsTab =
  | "en-recherche"
  | "confirmees"
  | "terminees";
