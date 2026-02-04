// Types de document
export const TYPE_DOCUMENT = [
  "devis",
  "contrat_prestation",
  "facture",
  "attestation_mission",
  "attestation_vigilance",
  "bordereau_paiement",
  "diplome",
  "carte_pro",
  "justificatif_assurance",
  "note_frais",
] as const;

// Labels pour les types de document
export const TYPE_DOCUMENT_LABELS: Record<
  (typeof TYPE_DOCUMENT)[number],
  string
> = {
  devis: "Devis",
  contrat_prestation: "Contrat de prestation",
  facture: "Facture",
  attestation_mission: "Attestation de mission",
  attestation_vigilance: "Attestation de vigilance",
  bordereau_paiement: "Bordereau de paiement",
  diplome: "Diplôme",
  carte_pro: "Carte professionnelle",
  justificatif_assurance: "Justificatif d'assurance",
  note_frais: "Note de frais",
};

// Statut de document
export const STATUT_DOCUMENT = [
  "brouillon",
  "en_attente_signature",
  "signe",
  "archive",
  "expire",
] as const;

// Labels pour les statuts de document
export const STATUT_DOCUMENT_LABELS: Record<
  (typeof STATUT_DOCUMENT)[number],
  string
> = {
  brouillon: "Brouillon",
  en_attente_signature: "En attente de signature",
  signe: "Signé",
  archive: "Archivé",
  expire: "Expiré",
};
