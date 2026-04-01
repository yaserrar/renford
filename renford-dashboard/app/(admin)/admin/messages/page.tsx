"use client";

import { DataTable } from "@/components/table/data-table";
import { useAdminContactMessages } from "@/hooks/admin";
import type { ContactMessage } from "@/types/admin";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { columns as baseColumns } from "./columns";
import TraiterMessageDialog from "./traiter-dialog";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const { data = [], isLoading } = useAdminContactMessages();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  const columns: ColumnDef<ContactMessage>[] = [
    ...baseColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const message = row.original;
        if (message.traite) {
          return <span className="text-xs text-muted-foreground">Traité</span>;
        }
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMessage(message)}
          >
            <CheckCircle className="size-4" />
            Traiter
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-5">
        <h1 className="text-2xl font-bold">Messages de contact</h1>
        <DataTable columns={columns} data={data} isLoading={isLoading} />
      </div>

      {selectedMessage && (
        <TraiterMessageDialog
          open={!!selectedMessage}
          onOpenChange={(open) => {
            if (!open) setSelectedMessage(null);
          }}
          message={selectedMessage}
        />
      )}
    </main>
  );
}
