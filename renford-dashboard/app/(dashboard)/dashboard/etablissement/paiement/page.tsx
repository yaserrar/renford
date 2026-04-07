"use client";

import { useMemo, useState } from "react";
import { H2 } from "@/components/ui/typography";
import { DataTable } from "@/components/table/data-table";
import { usePaymentHistory } from "@/hooks/paiement";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { etablissementColumns } from "./columns";

export default function EtablissementPaiementPage() {
  const historyQuery = usePaymentHistory();
  const payments = historyQuery.data ?? [];
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const dayOffset = (now.getDay() + 6) % 7;
    now.setHours(0, 0, 0, 0);
    now.setDate(now.getDate() - dayOffset);
    return now;
  });

  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [weekStart]);

  const weeklyPayments = useMemo(
    () =>
      payments.filter((payment) => {
        const paymentDate = new Date(payment.dateCreation);
        return (
          !Number.isNaN(paymentDate.getTime()) &&
          paymentDate >= weekStart &&
          paymentDate <= weekEnd
        );
      }),
    [payments, weekStart, weekEnd],
  );

  const weekLabel = `${weekStart.toLocaleDateString("fr-FR")} - ${weekEnd.toLocaleDateString("fr-FR")}`;

  const goToPreviousWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 7);
      return next;
    });
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 7);
      return next;
    });
  };

  return (
    <main className="mt-8 space-y-6">
      <H2>Factures & paiements</H2>

      <DataTable
        columns={etablissementColumns}
        data={weeklyPayments}
        isLoading={historyQuery.isLoading}
        enableFilters={false}
        showGlobalFilter={false}
        toolbarLeft={
          <div className="inline-flex items-center rounded-full border bg-white p-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={goToPreviousWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium">{weekLabel}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={goToNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
        title="Historique des paiements"
        description="Retrouvez ici l'ensemble de vos paiements effectués."
        exportFileName="paiements-etablissement"
      />
    </main>
  );
}
