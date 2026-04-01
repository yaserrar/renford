"use client";

import { DataTable } from "@/components/table/data-table";
import { useAdminUsers } from "@/hooks/admin";
import { Loader2 } from "lucide-react";
import { columns } from "./columns";

export default function UtilisateursPage() {
  const { data = [], isLoading } = useAdminUsers();

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
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <DataTable columns={columns} data={data} isLoading={isLoading} />
      </div>
    </main>
  );
}
