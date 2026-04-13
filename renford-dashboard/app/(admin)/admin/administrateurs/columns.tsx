"use client";

import ColumnHeader from "@/components/table/column-header";
import { dateFilterFn } from "@/components/table/filter-functions";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/date";
import type { AdminListItem } from "@/types/admin";
import { ColumnDef } from "@tanstack/react-table";
import { KeyRound, Pencil, Trash2 } from "lucide-react";

type ColumnActions = {
  onEdit: (admin: AdminListItem) => void;
  onPassword: (admin: AdminListItem) => void;
  onDelete: (admin: AdminListItem) => void;
  currentUserId?: string;
};

export const getColumns = ({
  onEdit,
  onPassword,
  onDelete,
  currentUserId,
}: ColumnActions): ColumnDef<AdminListItem>[] => [
  {
    accessorFn: ({ nom, prenom }) => `${prenom} ${nom}`.trim(),
    id: "Nom",
    header: ({ column }) => <ColumnHeader column={column} header="Nom" />,
    cell: ({ row: { original } }) => {
      const name = `${original.prenom} ${original.nom}`.trim() || "N/A";
      const initial = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-medium text-sm">{initial}</span>
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
    accessorKey: "email",
    id: "Email",
    header: ({ column }) => <ColumnHeader column={column} header="Email" />,
    cell: ({ row: { original } }) => (
      <span className="text-muted-foreground">{original.email}</span>
    ),
  },
  {
    accessorKey: "dateCreation",
    id: "Date de création",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Date de création" />
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
    id: "Actions",
    cell: ({ row: { original } }) => {
      const isSelf = original.id === currentUserId;
      return (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPassword(original)}
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          {!isSelf && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(original)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: false,
  },
];
