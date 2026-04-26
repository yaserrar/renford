"use client";

import ColumnHeader from "@/components/table/column-header";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { AdminEmailTemplateListItem } from "@/types/email-template";

export const emailTemplatesColumns: ColumnDef<AdminEmailTemplateListItem>[] = [
  {
    accessorKey: "label",
    id: "Email",
    header: ({ column }) => <ColumnHeader column={column} header="Email" />,
    cell: ({ row: { original } }) => (
      <div className="min-w-[180px]">
        <p className="font-medium leading-tight">{original.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {original.description}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1 italic truncate max-w-[260px]">
          {original.effectiveValues.sujet}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    id: "Type",
    header: ({ column }) => <ColumnHeader column={column} header="Type" />,
    cell: ({ row: { original } }) => (
      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
        {original.type}
      </code>
    ),
  },
  {
    id: "Statut",
    header: ({ column }) => <ColumnHeader column={column} header="Statut" />,
    cell: ({ row: { original } }) =>
      original.customise ? (
        <Badge variant="default">Personnalisé</Badge>
      ) : (
        <Badge variant="secondary">Défaut</Badge>
      ),
  },
  {
    id: "Variables",
    header: ({ column }) => <ColumnHeader column={column} header="Variables" />,
    cell: ({ row: { original } }) => (
      <p className="text-xs text-muted-foreground max-w-[260px] truncate">
        {original.variables.length === 0
          ? "—"
          : original.variables.map((v) => `{{${v.name}}}`).join(", ")}
      </p>
    ),
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => (
      <Link href={`/admin/emails/${original.type}`}>
        <Button variant="outline" size="sm">
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Modifier
        </Button>
      </Link>
    ),
  },
];
