// Type de notification
export const TYPE_NOTIFICATION = [
  "nouvelle_mission",
  "mission_acceptee",
  "mission_refusee",
  "contrat_pret",
  "contrat_signe",
  "paiement_traite",
  "paiement_recu",
  "rappel_mission_1_semaine",
  "rappel_mission_2_jours",
  "mission_demarree",
  "mission_terminee",
  "demande_evaluation",
  "rappel_evaluation",
  "rappel_devis",
  "document_expire",
  "mise_a_jour_profil_requise",
  "bienvenue",
] as const;

// Canal de notification
export const CANAL_NOTIFICATION = [
  "email",
  "sms",
  "tableau_de_bord",
  "calendrier",
] as const;

// Labels pour les canaux de notification
export const CANAL_NOTIFICATION_LABELS: Record<
  (typeof CANAL_NOTIFICATION)[number],
  string
> = {
  email: "Email",
  sms: "SMS",
  tableau_de_bord: "Tableau de bord",
  calendrier: "Calendrier",
};
