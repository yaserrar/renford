"use client";

import ColumnHeader from "@/components/table/column-header";
import {
  selectFilterFn,
  dateFilterFn,
} from "@/components/table/filter-functions";
import { buttonVariants } from "@/components/ui/button";
import UserMiniCard from "@/components/common/user-mini-card";
import { formatDate } from "@/lib/date";
import type { AdminMissionListItem } from "@/types/admin";
import {
  DISCIPLINE_MISSION_LABELS,
  MODE_MISSION_LABELS,
  STATUT_MISSION_LABELS,
} from "@/validations/mission";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import MissionStatusBadge from "@/components/common/mission-status-badge";

export const columns: ColumnDef<AdminMissionListItem>[] = [
  {
    accessorKey: "discipline",
    id: "Discipline",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Discipline" />
    ),
    cell: ({ row: { original } }) => (
      <span className="font-medium">
        {DISCIPLINE_MISSION_LABELS[original.discipline]}
      </span>
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: Object.entries(DISCIPLINE_MISSION_LABELS).map(
          ([value, label]) => ({ value, label }),
        ),
      },
    },
  },
  {
    accessorFn: ({ etablissement }) => etablissement.nom,
    id: "Établissement",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Établissement" />
    ),
    cell: ({ row: { original } }) => {
      const etab = original.etablissement;
      const profil = etab.profilEtablissement;
      if (!profil) {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{etab.nom}</span>
            <span className="text-sm text-gray-500">{etab.ville}</span>
          </div>
        );
      }
      return (
        <UserMiniCard
          userId={profil.utilisateurId}
          name={etab.nom}
          type="etablissement"
          avatarPath={profil.avatarChemin}
          subtitle={etab.ville}
        />
      );
    },
  },
  {
    accessorKey: "modeMission",
    id: "Mode",
    header: ({ column }) => <ColumnHeader column={column} header="Mode" />,
    cell: ({ row: { original } }) => (
      <span className="capitalize">
        {MODE_MISSION_LABELS[original.modeMission]}
      </span>
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: Object.entries(MODE_MISSION_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      },
    },
  },
  {
    accessorKey: "statut",
    id: "Statut",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row: { original } }) => (
      <MissionStatusBadge status={original.statut} />
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: Object.entries(STATUT_MISSION_LABELS).map(
          ([value, label]) => ({ value, label }),
        ),
      },
    },
  },
  {
    accessorKey: "dateDebut",
    id: "Date début",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Date début" />
    ),
    cell: ({ row: { original } }) => (
      <span>{formatDate(original.dateDebut)}</span>
    ),
    filterFn: dateFilterFn,
    meta: { dataType: { type: "date" } },
  },
  {
    accessorFn: ({ _count }) => _count.missionsRenford,
    id: "Candidatures",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Candidatures" />
    ),
    cell: ({ row: { original } }) => (
      <span className="font-medium">{original._count.missionsRenford}</span>
    ),
  },
  {
    accessorKey: "tarif",
    id: "Tarif",
    header: ({ column }) => <ColumnHeader column={column} header="Tarif" />,
    cell: ({ row: { original } }) => {
      if (!original.tarif) return <span className="text-gray-400">-</span>;
      return <span>{Number(original.tarif).toFixed(2)} €</span>;
    },
  },
  {
    id: "Actions",
    cell: ({ row: { original } }) => (
      <Link
        href={`/admin/missions/${original.id}`}
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
