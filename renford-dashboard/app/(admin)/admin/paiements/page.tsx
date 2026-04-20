"use client";

import { DataTable } from "@/components/table/data-table";
import { useAdminPaiements } from "@/hooks/admin";
import { adminPaiementsColumns } from "./columns";

export default function AdminPaiementsPage() {
  const { data = [], isLoading } = useAdminPaiements();

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Paiements</h1>
      <DataTable
        columns={adminPaiementsColumns}
        data={data}
        isLoading={isLoading}
        hidePadding
        title="Tous les paiements"
        description="Vue d'ensemble de tous les paiements effectués sur la plateforme."
        exportFileName="paiements-admin"
      />
    </main>
  );
}
