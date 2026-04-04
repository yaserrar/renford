import { ProfilRenfordMissionSimple } from "@/types/profil-renford";
import { Etablissement } from "@/types/etablissement";
import { RENFORD_MISSIONS_TAB } from "@/validations/mission-renford";
import {
  DisciplineMission,
  MaterielMission,
  MethodeTarificationMission,
  ModeMission,
  NiveauExperienceMission,
  PlageHoraireMission,
  StatutMission,
  TypeMissionSpecialite,
} from "@/types/mission";

export type StatutMissionRenford =
  | "nouveau"
  | "vu"
  | "refuse_par_renford"
  | "selection_en_cours"
  | "attente_de_signature"
  | "refuse_par_etablissement"
  | "contrat_signe"
  | "mission_en_cours"
  | "mission_terminee"
  | "annule";

export type MissionRenford = {
  id: string;
  missionId: string;
  profilRenfordId: string;
  statut: StatutMissionRenford;
  ordreShortlist: number | null;
  dateProposition: Date | string;
  dateReponse: Date | string | null;
  dateContratSigne: Date | string | null;
  lienVisio: string | null;
  dateVisio: Date | string | null;
  visioEffectuee: boolean;
  tarifNegocie: number | string | null;
  signatureContratPrestationRenfordChemin: string | null;
  signatureContratPrestationEtablissementChemin: string | null;
  signatureAttestationMissionRenfordChemin: string | null;
  signatureAttestationMissionEtablissementChemin: string | null;
  dateCreation: Date | string;
  dateMiseAJour: Date | string;
  profilRenford: ProfilRenfordMissionSimple;
};

export type RenfordMissionsTab = (typeof RENFORD_MISSIONS_TAB)[number];

// Établissement simplifié retourné avec les missions renford
export type EtablissementMissionRenford = Pick<
  Etablissement,
  "id" | "nom" | "adresse" | "codePostal" | "ville"
> & { avatarChemin: string | null };

// Mission imbriquée dans la réponse getRenfordMissions
export type MissionForRenford = {
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
  dateCreation: Date | string;
  etablissement: EtablissementMissionRenford;
  PlageHoraireMission: PlageHoraireMission[];
  totalHours: number;
};

// Item retourné par GET /renford/missions
export type MissionRenfordListItem = {
  id: string;
  missionId: string;
  profilRenfordId: string;
  statut: StatutMissionRenford;
  ordreShortlist: number | null;
  dateProposition: Date | string;
  dateReponse: Date | string | null;
  dateContratSigne: Date | string | null;
  tarifNegocie: number | string | null;
  signatureContratPrestationRenfordChemin: string | null;
  signatureContratPrestationEtablissementChemin: string | null;
  signatureAttestationMissionRenfordChemin: string | null;
  signatureAttestationMissionEtablissementChemin: string | null;
  dateCreation: Date | string;
  dateMiseAJour: Date | string;
  mission: MissionForRenford;
};

// Item retourné par GET /renford/missions/:missionId
export type MissionRenfordDetails = MissionRenfordListItem & {
  lienVisio: string | null;
  dateVisio: Date | string | null;
  visioEffectuee: boolean;
  mission: MissionForRenford & {
    etablissement: EtablissementMissionRenford & {
      typeEtablissement: string;
    };
  };
};
