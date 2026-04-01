import ColumnHeader from "@/components/table/column-header";
import {
  dateFilterFn,
  selectFilterFn,
} from "@/components/table/filter-functions";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/date";
import type { ContactMessage } from "@/types/admin";
import { TYPE_UTILISATEUR_LABELS } from "@/validations/utilisateur";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ContactMessage>[] = [
  {
    accessorKey: "utilisateur",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Utilisateur" />
    ),
    cell: ({ row }) => {
      const user = row.original.utilisateur;
      return (
        <div>
          <p className="font-medium">
            {user.prenom} {user.nom}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "typeUtilisateur",
    header: ({ column }) => <ColumnHeader column={column} header="Type" />,
    accessorFn: (row) => row.utilisateur.typeUtilisateur,
    cell: ({ row }) => {
      const type = row.original.utilisateur.typeUtilisateur;
      return (
        <Badge
          variant="outline"
          className={
            type === "etablissement"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-purple-200 bg-purple-50 text-purple-700"
          }
        >
          {TYPE_UTILISATEUR_LABELS[type]}
        </Badge>
      );
    },
    filterFn: selectFilterFn,
  },
  {
    accessorKey: "sujet",
    header: ({ column }) => <ColumnHeader column={column} header="Sujet" />,
    cell: ({ row }) => (
      <p className="max-w-[200px] truncate">{row.original.sujet}</p>
    ),
  },
  {
    accessorKey: "texte",
    header: ({ column }) => <ColumnHeader column={column} header="Message" />,
    cell: ({ row }) => (
      <p className="max-w-[250px] truncate text-muted-foreground text-xs">
        {row.original.texte}
      </p>
    ),
  },
  {
    accessorKey: "dateCreation",
    header: ({ column }) => <ColumnHeader column={column} header="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.dateCreation);
      return (
        <div className="text-sm">
          <p>{formatDate(date)}</p>
          <p className="text-xs text-muted-foreground">{formatTime(date)}</p>
        </div>
      );
    },
    filterFn: dateFilterFn,
  },
  {
    accessorKey: "traite",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row }) => {
      const traite = row.original.traite;
      return (
        <Badge
          variant={traite ? "default" : "secondary"}
          className={
            traite
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          }
        >
          {traite ? "Traité" : "Non traité"}
        </Badge>
      );
    },
    filterFn: selectFilterFn,
  },
];
