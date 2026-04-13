import ColumnHeader from "@/components/table/column-header";
import {
  dateFilterFn,
  selectFilterFn,
} from "@/components/table/filter-functions";
import UserMiniCard from "@/components/common/user-mini-card";
import { formatDate, formatTime } from "@/lib/date";
import type { ContactMessage } from "@/types/admin";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TYPE_UTILISATEUR_LABELS } from "@/validations/utilisateur";

export const columns: ColumnDef<ContactMessage>[] = [
  {
    accessorKey: "utilisateur",
    id: "Utilisateur",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Utilisateur" />
    ),
    cell: ({ row }) => {
      const user = row.original.utilisateur;
      const name = `${user.prenom} ${user.nom}`.trim() || user.email;
      return (
        <UserMiniCard
          userId={user.id}
          name={name}
          type={user.typeUtilisateur}
          subtitle={user.email}
        />
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "typeUtilisateur",
    id: "Type",
    header: ({ column }) => <ColumnHeader column={column} header="Type" />,
    accessorFn: (row) => row.utilisateur.typeUtilisateur,
    cell: ({ row }) => {
      const type = row.original.utilisateur.typeUtilisateur;
      return (
        <Badge variant={type === "etablissement" ? "default" : "secondary"}>
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
    id: "Date de création",
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
    id: "Statut",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row }) => {
      const traite = row.original.traite;
      return (
        <Badge
          variant={traite ? "default" : "secondary"}
          className={
            traite
              ? "bg-secondary-background text-secondary border-secondary/60"
              : "bg-amber-100 text-amber-600 border-amber-200"
          }
        >
          {traite ? "Traité" : "Non traité"}
        </Badge>
      );
    },
    filterFn: selectFilterFn,
  },
];
