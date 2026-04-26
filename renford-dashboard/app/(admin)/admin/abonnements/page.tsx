"use client";

import { DataTable } from "@/components/table/data-table";
import { useAdminAbonnements } from "@/hooks/abonnement";
import { adminAbonnementsColumns } from "./columns";
import CreateCompetitionDialog from "./create-competition-dialog";

export default function AdminAbonnementsPage() {
  const { data = [], isLoading } = useAdminAbonnements();

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Abonnements</h1>
        <CreateCompetitionDialog />
      </div>
      <DataTable
        columns={adminAbonnementsColumns}
        data={data}
        isLoading={isLoading}
        hidePadding
        title="Tous les abonnements"
        description="Vue d'ensemble de tous les abonnements établissements sur la plateforme."
        exportFileName="abonnements-admin"
      />
    </main>
  );
}
