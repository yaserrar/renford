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
  nouveau: "Nouveau",
  vu: "Vu",
  refuse_par_renford: "Refusé par renford",
  selection_en_cours: "Sélection en cours",
  attente_de_signature: "Attente de signature",
  refuse_par_etablissement: "Refusé par établissement",
  contrat_signe: "Contrat signé",
  mission_en_cours: "Mission en cours",
  mission_terminee: "Mission terminée",
  annule: "Annulé",
};

export const RENFORD_MISSIONS_TAB = [
  "opportunites",
  "candidatures",
  "validees",
] as const;

export const RENFORD_MISSIONS_TAB_LABELS: Record<
  (typeof RENFORD_MISSIONS_TAB)[number],
  string
> = {
  opportunites: "Opportunités",
  candidatures: "Mes candidatures",
  validees: "Missions validées",
};

export const RENFORD_MISSIONS_STATUS_GROUPS = {
  opportunites: ["nouveau", "vu"],
  candidatures: [
    "selection_en_cours",
    "attente_de_signature",
    "refuse_par_etablissement",
  ],
  validees: ["contrat_signe", "mission_en_cours", "mission_terminee"],
} as const satisfies Record<
  string,
  readonly (typeof STATUT_MISSION_RENFORD)[number][]
>;
