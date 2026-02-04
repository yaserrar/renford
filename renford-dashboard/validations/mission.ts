// Mode de mission
export const MODE_MISSION = ["flex", "coach"] as const;

// Labels pour les modes de mission
export const MODE_MISSION_LABELS: Record<
  (typeof MODE_MISSION)[number],
  string
> = {
  flex: "Flex (missions express/ponctuelles)",
  coach: "Coach (missions longue durée)",
};

// Statut de mission
export const STATUT_MISSION = [
  "envoyee",
  "en_cours_de_matching",
  "proposee",
  "acceptee",
  "contrat_signe",
  "payee",
  "en_cours",
  "a_valider",
  "validee",
  "terminee",
  "archivee",
  "annulee",
] as const;

// Labels pour les statuts de mission
export const STATUT_MISSION_LABELS: Record<
  (typeof STATUT_MISSION)[number],
  string
> = {
  envoyee: "Envoyée",
  en_cours_de_matching: "En cours de matching",
  proposee: "Proposée",
  acceptee: "Acceptée",
  contrat_signe: "Contrat signé",
  payee: "Payée",
  en_cours: "En cours",
  a_valider: "À valider",
  validee: "Validée",
  terminee: "Terminée",
  archivee: "Archivée",
  annulee: "Annulée",
};

// Méthode de tarification
export const METHODE_TARIFICATION = [
  "horaire",
  "forfait",
  "degressif",
] as const;

// Labels pour les méthodes de tarification
export const METHODE_TARIFICATION_LABELS: Record<
  (typeof METHODE_TARIFICATION)[number],
  string
> = {
  horaire: "Tarif horaire",
  forfait: "Forfait",
  degressif: "Tarif dégressif",
};

// Tranche de tarif horaire
export const TRANCHE_TARIF_HORAIRE = [
  "moins_de_45",
  "entre_45_et_59",
  "plus_de_60",
] as const;

// Labels pour les tranches de tarif horaire
export const TRANCHE_TARIF_HORAIRE_LABELS: Record<
  (typeof TRANCHE_TARIF_HORAIRE)[number],
  string
> = {
  moins_de_45: "Moins de 45€/h",
  entre_45_et_59: "Entre 45€ et 59€/h",
  plus_de_60: "60€/h et plus",
};

// Statut mission-renford
export const STATUT_MISSION_RENFORD = [
  "propose",
  "accepte",
  "refuse",
  "shortliste",
  "selectionne",
  "contrat_envoye",
  "contrat_signe",
  "en_cours",
  "termine",
  "annule",
] as const;

// Labels pour les statuts mission-renford
export const STATUT_MISSION_RENFORD_LABELS: Record<
  (typeof STATUT_MISSION_RENFORD)[number],
  string
> = {
  propose: "Proposé",
  accepte: "Accepté",
  refuse: "Refusé",
  shortliste: "Shortlisté",
  selectionne: "Sélectionné",
  contrat_envoye: "Contrat envoyé",
  contrat_signe: "Contrat signé",
  en_cours: "En cours",
  termine: "Terminé",
  annule: "Annulé",
};
