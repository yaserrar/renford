"use client";

import ColumnHeader from "@/components/table/column-header";
import { formatFrenchDate } from "@/lib/utils";
import type {
  AdminAbonnementListItem,
  StatutAbonnement,
  PlanAbonnement,
} from "@/types/abonnement";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import UserMiniCard from "@/components/common/user-mini-card";
import { Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const STATUT_LABELS: Record<StatutAbonnement, string> = {
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

const PLAN_LABELS: Record<PlanAbonnement, string> = {
  echauffement: "Échauffement",
  performance: "Performance",
  competition: "Compétition",
};

export const adminAbonnementsColumns: ColumnDef<AdminAbonnementListItem>[] = [
  {
    accessorFn: (row) =>
      `${row.profilEtablissement.utilisateur.prenom} ${row.profilEtablissement.utilisateur.nom}`,
    id: "Établissement",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Établissement" />
    ),
    cell: ({ row: { original } }) => {
      const { utilisateur } = original.profilEtablissement;
      const etabNom = original.profilEtablissement.etablissements[0]?.nom;
      return (
        <div className="flex flex-col gap-0.5">
          <UserMiniCard
            userId={utilisateur.id}
            name={`${utilisateur.prenom} ${utilisateur.nom}`}
            type="etablissement"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "plan",
    id: "Plan",
    header: ({ column }) => <ColumnHeader column={column} header="Plan" />,
    cell: ({ row: { original } }) => (
      <span className="font-semibold uppercase tracking-wide text-sm">
        {PLAN_LABELS[original.plan]}
      </span>
    ),
  },
  {
    accessorKey: "statut",
    id: "Statut",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row: { original } }) => (
      <Badge variant={STATUT_VARIANTS[original.statut]}>
        {STATUT_LABELS[original.statut]}
      </Badge>
    ),
  },
  {
    accessorKey: "quotaMissions",
    id: "Quota",
    header: ({ column }) => <ColumnHeader column={column} header="Quota" />,
    cell: ({ row: { original } }) => (
      <span className="tabular-nums text-sm">
        {original.quotaMissions === 0
          ? "Illimité"
          : `${original.missionsUtilisees} / ${original.quotaMissions}`}
      </span>
    ),
  },
  {
    accessorKey: "prixMensuelHT",
    id: "Prix HT",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Prix HT/mois" />
    ),
    cell: ({ row: { original } }) => (
      <span className="tabular-nums text-sm">
        {Number(original.prixMensuelHT).toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.dateProchainRenouvellement,
    id: "Renouvellement",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Prochain renouv." />
    ),
    cell: ({ row: { original } }) =>
      original.dateProchainRenouvellement ? (
        <span className="text-sm">
          {formatFrenchDate(original.dateProchainRenouvellement)}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "dateCreation",
    id: "Créé le",
    header: ({ column }) => <ColumnHeader column={column} header="Créé le" />,
    cell: ({ row: { original } }) => (
      <span className="text-sm text-muted-foreground">
        {formatFrenchDate(original.dateCreation)}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => (
      <Link
        href={`/admin/abonnements/${original.id}`}
        className={buttonVariants({ variant: "default", size: "icon" })}
      >
        <Eye />
      </Link>
    ),
  },
];
