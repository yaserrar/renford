"use client";

import ColumnHeader from "@/components/table/column-header";
import {
  selectFilterFn,
  dateFilterFn,
} from "@/components/table/filter-functions";
import PaiementStatusBadge from "@/components/common/paiement-status-badge";
import { formatFrenchDate, formatAmount } from "@/lib/utils";
import { STATUT_PAIEMENT_LABELS } from "@/validations/paiement";
import type { PaiementWithMission } from "@/hooks/paiement";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Calendar } from "lucide-react";
import FactureButton from "@/components/common/facture-button";

export const etablissementColumns: ColumnDef<PaiementWithMission>[] = [
  {
    accessorKey: "reference",
    id: "Numéro de facture",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Numéro de facture" />
    ),
    cell: ({ row: { original } }) => (
      <span className="font-mono text-sm">
        {original.reference.slice(0, 8)}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.mission.specialitePrincipale,
    id: "Mission",
    header: ({ column }) => <ColumnHeader column={column} header="Mission" />,
    cell: ({ row: { original } }) => (
      <Link
        href={`/dashboard/etablissement/missions/${original.mission.id}`}
        className="group flex flex-col"
      >
        <span className="font-medium underline-offset-4 group-hover:underline">
          {original.mission.specialitePrincipale.replaceAll("_", " ")}
        </span>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar size={16} />{" "}
          {original.mission.dateFin
            ? `Mission du ${formatFrenchDate(original.mission.dateDebut)} au ${formatFrenchDate(original.mission.dateFin)}`
            : `Mission le ${formatFrenchDate(original.mission.dateDebut)}`}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "dateCreation",
    id: "Date",
    header: ({ column }) => <ColumnHeader column={column} header="Date" />,
    cell: ({ row: { original } }) => formatFrenchDate(original.dateCreation),
    filterFn: dateFilterFn,
    meta: { dataType: { type: "date" } },
  },
  {
    accessorKey: "montantHT",
    id: "Montant HT",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Montant HT" />
    ),
    cell: ({ row: { original } }) => (
      <span className="text-muted-foreground">
        {formatAmount(original.montantHT)}
      </span>
    ),
  },
  {
    accessorKey: "montantTTC",
    id: "Montant TTC",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Montant TTC" />
    ),
    cell: ({ row: { original } }) => (
      <span className="font-semibold">{formatAmount(original.montantTTC)}</span>
    ),
  },
  {
    accessorKey: "statut",
    id: "Statut",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row: { original } }) => (
      <span className="font-semibold">
        {STATUT_PAIEMENT_LABELS[original.statut]}
      </span>
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: Object.entries(STATUT_PAIEMENT_LABELS).map(
          ([value, label]) => ({
            label,
            value,
          }),
        ),
      },
    },
  },
  {
    id: "Facture",
    header: ({ column }) => <ColumnHeader column={column} header="Facture" />,
    cell: ({ row: { original } }) => (
      <FactureButton
        paiementId={original.id}
        stripePaymentIntentId={original.stripePaymentIntentId}
        statut={original.statut}
      />
    ),
    enableSorting: false,
  },
];
