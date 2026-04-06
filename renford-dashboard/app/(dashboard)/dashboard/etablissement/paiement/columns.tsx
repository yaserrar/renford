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

export const etablissementColumns: ColumnDef<PaiementWithMission>[] = [
  {
    accessorKey: "reference",
    id: "Référence",
    header: ({ column }) => <ColumnHeader column={column} header="Référence" />,
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
      <span className="font-medium">
        {original.mission.specialitePrincipale.replaceAll("_", " ")}
      </span>
    ),
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
      <PaiementStatusBadge status={original.statut} />
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
    accessorKey: "dateCreation",
    id: "Date",
    header: ({ column }) => <ColumnHeader column={column} header="Date" />,
    cell: ({ row: { original } }) => formatFrenchDate(original.dateCreation),
    filterFn: dateFilterFn,
    meta: { dataType: { type: "date" } },
  },
];
