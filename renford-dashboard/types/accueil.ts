import { DisciplineMission, MethodeTarificationMission } from "@/types/mission";

export type AccueilPlanningSlot = {
  id: string;
  date: Date | string;
  heureDebut: string;
  heureFin: string;
  missionId: string;
  discipline: DisciplineMission;
  tarif: number | string | null;
  methodeTarification: MethodeTarificationMission;
  totalHours: number;
};

export type EtablissementAccueilPlanningSlot = AccueilPlanningSlot & {
  etablissement: {
    id: string;
    nom: string;
    avatarChemin: string | null;
  };
  renford: {
    id: string;
    avatarChemin: string | null;
    titreProfil: string | null;
    nom: string;
    prenom: string;
  } | null;
};

export type RenfordAccueilPlanningSlot = AccueilPlanningSlot & {
  etablissement: {
    id: string;
    nom: string;
    avatarChemin: string | null;
    adresse: string;
    codePostal: string;
    ville: string;
  };
};

export type EtablissementAccueilData = {
  indicators: {
    missionsEnCours: number;
    missionsEnAttente: number;
    missionsRealisees: number;
    paiementsARegler: number;
    paiementsEnAttente: number;
    paiementsReglesCeMois: number;
  };
  planning: EtablissementAccueilPlanningSlot[];
};

export type RenfordAccueilData = {
  indicators: {
    missionsEnCours: number;
    missionsEnAttente: number;
    missionsRealisees: number;
    nouvellesOpportunites: number;
    paiementsEnCours: number;
    paiementsCeMois: number;
    paiementsCetteAnnee: number;
  };
  planning: RenfordAccueilPlanningSlot[];
};
