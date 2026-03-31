import { ProfilRenfordMissionSimple } from "@/types/profil-renford";

export type StatutMissionRenford =
  | "shortliste"
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
  estShortliste: boolean;
  ordreShortlist: number | null;
  dateProposition: Date | string;
  dateReponse: Date | string | null;
  dateContratSigne: Date | string | null;
  lienVisio: string | null;
  dateVisio: Date | string | null;
  visioEffectuee: boolean;
  tarifNegocie: number | string | null;
  dateCreation: Date | string;
  dateMiseAJour: Date | string;
  profilRenford: ProfilRenfordMissionSimple;
};
