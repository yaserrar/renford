import { QUALITE_SERVICE, TYPE_EVALUATION } from "@/validations/evaluation";

// Type d'évaluation
export type TypeEvaluation = (typeof TYPE_EVALUATION)[number];

// Qualité de service
export type QualiteService = (typeof QUALITE_SERVICE)[number];

// Évaluation
export type Evaluation = {
  id: string;
  missionId: string;
  auteurId: string;
  cibleId: string;
  typeEvaluation: TypeEvaluation;
  noteGlobale: number;
  qualiteService: QualiteService | null;
  notePlateforme: number | null;
  prestationRepondAttentes: boolean | null;
  motifInsatisfaction: string | null;
  ajouterAuxFavoris: boolean | null;
  recommande: boolean | null;
  aspectsSatisfaisants: string[];
  commentaire: string | null;
  absenceSignalee: boolean;
  detailsAbsence: Record<string, unknown> | null;
  ajustementDureeSignale: boolean;
  detailsAjustement: Record<string, unknown> | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};
