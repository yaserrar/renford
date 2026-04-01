import ColumnHeader from "@/components/table/column-header";
import {
  dateFilterFn,
  selectFilterFn,
} from "@/components/table/filter-functions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/date";
import { cn, getUrl } from "@/lib/utils";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Megaphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const columns: ColumnDef<User>[] = [
  {
    accessorFn: ({ profilBarista, profilAnnonceur, type, email }) => {
      if (type === "barista" && profilBarista) {
        return (
          `${profilBarista.prenom || ""} ${profilBarista.nom || ""}`.trim() ||
          email
        );
      }
      if (type === "annonceur" && profilAnnonceur) {
        return (
          profilAnnonceur.nomComplet || profilAnnonceur.nomEntreprise || email
        );
      }
      return email;
    },
    id: "Nom & prénom",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Nom & prénom" />
    ),
    cell: ({ row: { original } }) => {
      const isBarista = original.type === "barista";
      const isAnnonceur = original.type === "annonceur";

      let name = "";
      let subtitle = original.email;

      if (isBarista && original.profilBarista) {
        name =
          `${original.profilBarista.prenom || ""} ${
            original.profilBarista.nom || ""
          }`.trim() || "N/A";
      } else if (isAnnonceur && original.profilAnnonceur) {
        name =
          original.profilAnnonceur.nomComplet ||
          original.profilAnnonceur.nomEntreprise ||
          "N/A";
        subtitle = original.profilAnnonceur.nomEntreprise
          ? "Business"
          : original.email;
      }

      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {isBarista && original.profilBarista?.photoChemin ? (
              <Image
                src={getUrl(original.profilBarista.photoChemin)}
                alt={name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : isAnnonceur && original.profilAnnonceur?.logoChemin ? (
              <Image
                src={getUrl(original.profilAnnonceur.logoChemin)}
                alt={name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="text-gray-500 font-medium">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-gray-500">{subtitle}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: ({ profilBarista, profilAnnonceur, type }) => {
      if (type === "barista" && profilBarista) {
        return profilBarista.telephone || "";
      }
      if (type === "annonceur" && profilAnnonceur) {
        return profilAnnonceur.telephone || "";
      }
      return "";
    },
    id: "Téléphone",
    header: ({ column }) => <ColumnHeader column={column} header="Téléphone" />,
    cell: ({ row: { original } }) => {
      const telephone =
        original.type === "barista"
          ? original.profilBarista?.telephone
          : original.profilAnnonceur?.telephone;
      return telephone || "-";
    },
  },
  {
    accessorKey: "type",
    id: "Type de compte",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Type de compte" />
    ),
    cell: ({ row: { original } }) => (
      <div className="flex items-center gap-2 bg-primary-background rounded-md px-2 py-1 w-fit">
        {original.type === "barista" ? (
          <>
            <Image
              src="/svg/Barista.svg"
              alt="barista"
              width={15}
              height={15}
            />
            <span className="text-primary font-medium">Barista</span>
          </>
        ) : (
          <>
            <Megaphone className="text-primary" size={17} />
            <span className="text-blue-600 font-medium">Annonceur</span>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    id: "Date d'inscription",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Date d'inscription" />
    ),
    cell: ({ row: { original } }) => {
      const date = new Date(original.createdAt);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(date)}</span>
          <span className="text-sm text-gray-500">{formatTime(date)}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
    meta: {
      dataType: {
        type: "date",
      },
    },
  },
  {
    accessorKey: "derniereConnexionA",
    id: "Dernière connexion",
    header: ({ column }) => (
      <ColumnHeader column={column} header="Dernière connexion" />
    ),
    cell: ({ row: { original } }) => {
      if (!original.derniereConnexionA) {
        return <span className="text-sm text-gray-500">Jamais</span>;
      }

      const date = new Date(original.derniereConnexionA);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(date)}</span>
          <span className="text-sm text-gray-500">{formatTime(date)}</span>
        </div>
      );
    },
    filterFn: dateFilterFn,
    meta: {
      dataType: {
        type: "date",
      },
    },
  },
  {
    accessorKey: "statut",
    id: "Statuts",
    header: ({ column }) => <ColumnHeader column={column} header="Statuts" />,
    cell: ({ row: { original } }) => (
      <Badge
        variant={original.statut === "actif" ? "default" : "outline"}
        className={cn(
          "px-3 py-1",
          original.statut === "actif"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-orange-50 text-orange-700 border-orange-200",
        )}
      >
        {original.statut === "actif" ? "Active" : "Inactive"}
      </Badge>
    ),
    filterFn: selectFilterFn,
    meta: {
      dataType: {
        type: "select",
        options: [
          { label: "Active", value: "actif" },
          { label: "Inactive", value: "inactif" },
        ],
      },
    },
  },
  {
    id: "Actions",
    cell: ({ row: { original } }) => {
      return (
        <Link
          href={`/admin/utilisateurs/${original.id}`}
          className={buttonVariants({ variant: "default", size: "icon" })}
        >
          <Eye />
        </Link>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: false,
  },
];
