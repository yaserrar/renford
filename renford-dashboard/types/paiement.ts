import { STATUT_PAIEMENT } from "@/validations/paiement";

// Statut de paiement
export type StatutPaiement = (typeof STATUT_PAIEMENT)[number];

// Paiement
export type Paiement = {
  id: string;
  reference: string;
  missionId: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  montantCommission: number;
  montantNetRenford: number;
  statut: StatutPaiement;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  stripeTransferId: string | null;
  dateCreation: Date;
  dateCapture: Date | null;
  dateLiberation: Date | null;
  dateMiseAJour: Date;
};
