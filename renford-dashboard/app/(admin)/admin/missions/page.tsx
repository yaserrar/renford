"use client";

import { DataTable } from "@/components/table/data-table";
import { useAdminMissions } from "@/hooks/admin";
import { columns } from "./columns";

export default function AdminMissionsPage() {
  const { data: missions = [], isLoading } = useAdminMissions();

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-5">
        <h1 className="text-2xl font-bold">Missions</h1>

        <DataTable
          columns={columns}
          data={missions}
          isLoading={isLoading}
          exportFileName="missions"
          hidePadding
        />
      </div>
    </main>
  );
}
