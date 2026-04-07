"use client";

import { H2 } from "@/components/ui/typography";
import { DataTable } from "@/components/table/data-table";
import { usePaymentHistory } from "@/hooks/paiement";
import { etablissementColumns } from "./columns";

export default function EtablissementPaiementPage() {
  const historyQuery = usePaymentHistory();
  const payments = historyQuery.data ?? [];

  return (
    <main className="mt-8 space-y-6">
      <H2>Paiements</H2>

      <DataTable
        columns={etablissementColumns}
        data={payments}
        isLoading={historyQuery.isLoading}
        enableFilters={false}
        title="Historique des paiements"
        description="Retrouvez ici l'ensemble de vos paiements effectués."
        exportFileName="paiements-etablissement"
      />
    </main>
  );
}
