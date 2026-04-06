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

export const renfordColumns: ColumnDef<PaiementWithMission>[] = [
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
      <div className="flex flex-col">
        <span className="font-medium">
          {original.mission.specialitePrincipale.replaceAll("_", " ")}
        </span>
        <span className="text-sm text-muted-foreground">
          {original.mission.etablissement.nom}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "montantNetRenford",
    id: "Montant net",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Montant net" />
    ),
    cell: ({ row: { original } }) => (
      <span className="font-semibold">
        {formatAmount(original.montantNetRenford)}
      </span>
    ),
  },
  {
    accessorKey: "montantCommission",
    id: "Commission",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Commission" />
    ),
    cell: ({ row: { original } }) => (
      <span className="text-muted-foreground">
        {formatAmount(original.montantCommission)}
      </span>
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
