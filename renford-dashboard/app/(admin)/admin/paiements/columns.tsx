"use client";

import ColumnHeader from "@/components/table/column-header";
import {
  selectFilterFn,
  dateFilterFn,
} from "@/components/table/filter-functions";
import { formatFrenchDate, formatAmount } from "@/lib/utils";
import { STATUT_PAIEMENT_LABELS } from "@/validations/paiement";
import type { AdminPaiementListItem } from "@/types/admin";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Calendar } from "lucide-react";
import UserMiniCard from "@/components/common/user-mini-card";
import FactureButton from "@/components/common/facture-button";

export const adminPaiementsColumns: ColumnDef<AdminPaiementListItem>[] = [
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
      <Link
        href={`/admin/missions/${original.mission.id}`}
        className="group flex flex-col"
      >
        <span className="font-medium underline-offset-4 group-hover:underline">
          {original.mission.specialitePrincipale.replaceAll("_", " ")}
        </span>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar size={16} />
          {original.mission.dateFin
            ? `${formatFrenchDate(original.mission.dateDebut)} - ${formatFrenchDate(original.mission.dateFin)}`
            : formatFrenchDate(original.mission.dateDebut)}
        </span>
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.mission.etablissement.nom,
    id: "Établissement",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Établissement" />
    ),
    cell: ({ row: { original } }) => {
      const etab = original.mission.etablissement;
      return (
        <UserMiniCard
          userId={etab.profilEtablissement?.utilisateurId ?? ""}
          name={etab.nom}
          type="etablissement"
          avatarPath={etab.profilEtablissement?.avatarChemin ?? undefined}
        />
      );
    },
  },
  {
    accessorFn: (row) => {
      const r = row.mission.missionsRenford[0]?.profilRenford;
      return r ? `${r.utilisateur.prenom} ${r.utilisateur.nom}` : "";
    },
    id: "Renford",
    header: ({ column }) => <ColumnHeader column={column} header="Renford" />,
    cell: ({ row: { original } }) => {
      const r = original.mission.missionsRenford[0]?.profilRenford;
      if (!r) return <span className="text-muted-foreground">—</span>;
      return (
        <UserMiniCard
          userId={r.utilisateurId}
          name={`${r.utilisateur.prenom} ${r.utilisateur.nom}`}
          type="renford"
          avatarPath={r.avatarChemin ?? undefined}
        />
      );
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
      <span className="font-semibold">
        {
          STATUT_PAIEMENT_LABELS[
            original.statut as keyof typeof STATUT_PAIEMENT_LABELS
          ]
        }
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
        basePath="/admin/paiements"
      />
    ),
    enableSorting: false,
  },
];
