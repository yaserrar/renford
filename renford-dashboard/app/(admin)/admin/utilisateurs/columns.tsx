import ColumnHeader from "@/components/table/column-header";
import {
  dateFilterFn,
  selectFilterFn,
} from "@/components/table/filter-functions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { AdminUserListItem } from "@/types/admin";
import {
  STATUT_COMPTE_LABELS,
  TYPE_UTILISATEUR_LABELS,
} from "@/validations/utilisateur";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<AdminUserListItem>[] = [
  {
    accessorFn: ({ nom, prenom, email }) => `${prenom} ${nom}`.trim() || email,
    id: "Nom & prénom",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Nom & prénom" />
    ),
    cell: ({ row: { original } }) => {
      const name = `${original.prenom} ${original.nom}`.trim() || "N/A";
      const initial = name.charAt(0).toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <span className="text-gray-500 font-medium">{initial}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-gray-500">{original.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "telephone",
    id: "Téléphone",
    header: ({ column }) => <ColumnHeader column={column} header="Téléphone" />,
    cell: ({ row: { original } }) => original.telephone || "-",
  },
  {
    accessorKey: "typeUtilisateur",
    id: "Type de compte",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Type de compte" />
    ),
    cell: ({ row: { original } }) => (
      <Badge
        variant={
          original.typeUtilisateur === "etablissement" ? "default" : "secondary"
        }
      >
        {TYPE_UTILISATEUR_LABELS[original.typeUtilisateur]}
      </Badge>
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: [
          { label: "Établissement", value: "etablissement" },
          { label: "Renford", value: "renford" },
        ],
      },
    },
  },
  {
    accessorKey: "dateCreation",
    id: "Date d'inscription",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Date d'inscription" />
    ),
    cell: ({ row: { original } }) => {
      const date = new Date(original.dateCreation);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(date)}</span>
          <span className="text-sm text-gray-500">{formatTime(date)}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
    meta: { dataType: { type: "date" } },
  },
  {
    accessorKey: "derniereConnexion",
    id: "Dernière connexion",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Dernière connexion" />
    ),
    cell: ({ row: { original } }) => {
      if (!original.derniereConnexion) {
        return <span className="text-sm text-gray-500">Jamais</span>;
      }
      const date = new Date(original.derniereConnexion);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(date)}</span>
          <span className="text-sm text-gray-500">{formatTime(date)}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
    meta: { dataType: { type: "date" } },
  },
  {
    accessorKey: "statut",
    id: "Statut",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row: { original } }) => (
      <Badge
        variant="outline"
        className={cn(
          "px-3 py-1",
          original.statut === "actif"
            ? "bg-green-50 text-green-700 border-green-200"
            : original.statut === "suspendu"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-orange-50 text-orange-700 border-orange-200",
        )}
      >
        {STATUT_COMPTE_LABELS[original.statut]}
      </Badge>
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: [
          { label: "Actif", value: "actif" },
          { label: "Suspendu", value: "suspendu" },
          { label: "En attente", value: "en_attente_verification" },
          { label: "Onboarding", value: "onboarding" },
        ],
      },
    },
  },
  {
    id: "Actions",
    cell: ({ row: { original } }) => (
      <Link
        href={`/admin/utilisateurs/${original.id}`}
        className={buttonVariants({ variant: "default", size: "icon" })}
      >
        <Eye />
      </Link>
    ),
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: false,
  },
];
