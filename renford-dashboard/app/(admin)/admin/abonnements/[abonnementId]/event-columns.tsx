"use client";

import ColumnHeader from "@/components/table/column-header";
import { Badge } from "@/components/ui/badge";
import type {
  AbonnementEvenement,
  StatutAbonnement,
  TypeEvenementAbonnement,
} from "@/types/abonnement";
import type { ColumnDef } from "@tanstack/react-table";

export const STATUT_LABELS: Record<StatutAbonnement, string> = {
  actif: "Actif",
  annule: "Annulé",
  expire: "Expiré",
  en_pause: "En pause",
  en_attente: "En attente",
};

const STATUT_VARIANTS: Record<
  StatutAbonnement,
  "default" | "secondary" | "destructive" | "outline"
> = {
  actif: "default",
  annule: "destructive",
  expire: "secondary",
  en_pause: "outline",
  en_attente: "secondary",
};

export const EVENT_LABELS: Record<TypeEvenementAbonnement, string> = {
  creation: "Création",
  activation: "Activation",
  renouvellement: "Renouvellement",
  annulation: "Annulation",
  expiration: "Expiration",
  mise_en_pause: "Mise en pause",
  reprise: "Reprise",
  changement_plan: "Changement de plan",
  paiement_reussi: "Paiement réussi",
  paiement_echoue: "Paiement échoué",
  remboursement: "Remboursement",
};

const EVENT_VARIANTS: Record<
  TypeEvenementAbonnement,
  "default" | "secondary" | "destructive" | "outline"
> = {
  creation: "secondary",
  activation: "default",
  renouvellement: "default",
  annulation: "destructive",
  expiration: "destructive",
  mise_en_pause: "outline",
  reprise: "default",
  changement_plan: "secondary",
  paiement_reussi: "default",
  paiement_echoue: "destructive",
  remboursement: "outline",
};

export const abonnementEventColumns: ColumnDef<AbonnementEvenement>[] = [
  {
    accessorKey: "occurredAt",
    id: "Date",
    header: ({ column }) => <ColumnHeader column={column} header="Date" />,
    cell: ({ row: { original } }) => (
      <span className="text-sm tabular-nums whitespace-nowrap">
        {new Date(original.occurredAt).toLocaleString("fr-FR")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    id: "Événement",
    header: ({ column }) => <ColumnHeader column={column} header="Événement" />,
    cell: ({ row: { original } }) => (
      <Badge variant={EVENT_VARIANTS[original.type]}>
        {EVENT_LABELS[original.type] ?? original.type}
      </Badge>
    ),
  },
  {
    id: "Transition",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Transition" />
    ),
    cell: ({ row: { original } }) => {
      if (!original.ancienStatut && !original.nouveauStatut) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          {original.ancienStatut && (
            <Badge variant={STATUT_VARIANTS[original.ancienStatut]}>
              {STATUT_LABELS[original.ancienStatut]}
            </Badge>
          )}
          {original.ancienStatut && original.nouveauStatut && (
            <span className="text-muted-foreground text-xs">→</span>
          )}
          {original.nouveauStatut && (
            <Badge variant={STATUT_VARIANTS[original.nouveauStatut]}>
              {STATUT_LABELS[original.nouveauStatut]}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "montantCentimes",
    id: "Montant",
    header: ({ column }) => <ColumnHeader column={column} header="Montant" />,
    cell: ({ row: { original } }) =>
      original.montantCentimes != null ? (
        <span className="tabular-nums text-sm">
          {(original.montantCentimes / 100).toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },
  {
    accessorKey: "stripeEventType",
    id: "Source Stripe",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Source Stripe" />
    ),
    cell: ({ row: { original } }) =>
      original.stripeEventType ? (
        <span className="font-mono text-xs text-muted-foreground">
          {original.stripeEventType}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },
  {
    accessorKey: "stripeSubscriptionId",
    id: "Sub. ID",
    header: ({ column }) => <ColumnHeader column={column} header="Sub. ID" />,
    cell: ({ row: { original } }) =>
      original.stripeSubscriptionId ? (
        <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px] block">
          {original.stripeSubscriptionId}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },
];
