// Statut de paiement
export const STATUT_PAIEMENT = [
  "en_attente",
  "en_cours",
  "bloque",
  "libere",
  "rembourse",
  "echoue",
  "conteste",
] as const;

// Labels pour les statuts de paiement
export const STATUT_PAIEMENT_LABELS: Record<
  (typeof STATUT_PAIEMENT)[number],
  string
> = {
  en_attente: "En attente",
  en_cours: "En cours",
  bloque: "Bloqué",
  libere: "Libéré",
  rembourse: "Remboursé",
  echoue: "Échoué",
  conteste: "Contesté",
};
