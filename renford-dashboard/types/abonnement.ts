export type PlanAbonnement = "echauffement" | "performance" | "competition";

export type StatutAbonnement =
  | "actif"
  | "annule"
  | "expire"
  | "en_pause"
  | "en_attente";

export type TypeEvenementAbonnement =
  | "creation"
  | "activation"
  | "renouvellement"
  | "annulation"
  | "expiration"
  | "mise_en_pause"
  | "reprise"
  | "changement_plan"
  | "paiement_reussi"
  | "paiement_echoue"
  | "remboursement";

export type AbonnementEvenement = {
  id: string;
  abonnementId: string;
  type: TypeEvenementAbonnement;
  ancienStatut: StatutAbonnement | null;
  nouveauStatut: StatutAbonnement | null;
  montantCentimes: number | null;
  stripeSubscriptionId: string | null;
  stripeEventId: string | null;
  stripeEventType: string | null;
  details: Record<string, unknown> | null;
  occurredAt: string;
};

export type Abonnement = {
  id: string;
  profilEtablissementId: string;
  plan: PlanAbonnement;
  statut: StatutAbonnement;
  quotaMissions: number;
  missionsUtilisees: number;
  prixMensuelHT: number;
  dateDebut: string;
  dateFin: string | null;
  dateProchainRenouvellement: string | null;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodStart: string | null;
  stripeCurrentPeriodEnd: string | null;
  dateCreation: string;
  dateModification: string;
};

export type AbonnementWithEvents = Abonnement & {
  evenements: AbonnementEvenement[];
};

export type AbonnementQuota = {
  hasSubscription: boolean;
  exceeded: boolean;
  remaining: number;
  quotaMissions: number;
  missionsCreated: number;
  plan: PlanAbonnement | null;
};

export type AbonnementCurrentResponse = {
  abonnement: AbonnementWithEvents | null;
  quota: AbonnementQuota;
  prixCompetitionNegocie: number | null;
};

// ─── Admin types ─────────────────────────────────────────────────────────────

export type AdminAbonnementProfilEtablissement = {
  id: string;
  stripeCustomerId: string | null;
  avatarChemin: string | null;
  utilisateur: {
    id: string;
    email: string;
    prenom: string;
    nom: string;
  };
  etablissements: Array<{ nom: string }>;
};

export type AdminAbonnementListItem = Abonnement & {
  profilEtablissement: AdminAbonnementProfilEtablissement;
};

export type AdminAbonnementDetail = AbonnementWithEvents & {
  profilEtablissement: AdminAbonnementProfilEtablissement;
};
