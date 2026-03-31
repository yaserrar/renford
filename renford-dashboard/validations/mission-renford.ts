export const STATUT_MISSION_RENFORD = [
  "nouveau",
  "vu",
  "refuse_par_renford",
  "selection_en_cours",
  "attente_de_signature",
  "refuse_par_etablissement",
  "contrat_signe",
  "mission_en_cours",
  "mission_terminee",
  "annule",
] as const;

export const STATUT_MISSION_RENFORD_LABELS: Record<
  (typeof STATUT_MISSION_RENFORD)[number],
  string
> = {
  nouveau: "a reçu la mission",
  vu: "a consulté la mission",
  refuse_par_renford: "a refusé la mission",
  selection_en_cours: "est en cours de sélection",
  attente_de_signature: "est en attente de signature",
  refuse_par_etablissement: "a été refusé par l'établissement",
  contrat_signe: "a signé le contrat",
  mission_en_cours: "réalise la mission",
  mission_terminee: "a terminé la mission",
  annule: "est annulé",
};
