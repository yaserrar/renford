"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { DataTable } from "@/components/table/data-table";
import CenterState from "@/components/common/center-state";
import {
  useConnectAccountStatus,
  useCreateConnectDashboardLink,
  useCreateConnectOnboarding,
  usePaymentHistory,
} from "@/hooks/paiement";
import { toast } from "sonner";
import { renfordColumns } from "./columns";

export default function RenfordPaiementPage() {
  const searchParams = useSearchParams();
  const stripeOnboarding = searchParams.get("stripe_onboarding");
  const stripeRefresh = searchParams.get("stripe_refresh");

  const statusQuery = useConnectAccountStatus();
  const onboardingMutation = useCreateConnectOnboarding();
  const dashboardMutation = useCreateConnectDashboardLink();
  const historyQuery = usePaymentHistory();

  useEffect(() => {
    if (stripeOnboarding === "complete") {
      toast.success("Configuration Stripe terminée !");
      statusQuery.refetch();
    }
    if (stripeRefresh === "true") {
      toast.info("Session expirée. Veuillez relancer la configuration Stripe.");
    }
  }, [stripeOnboarding, stripeRefresh]);

  const status = statusQuery.data;
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

  if (statusQuery.isLoading) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Paiements</H2>
        <CenterState
          title="Chargement..."
          description="Récupération de vos informations de paiement."
          isLoading
        />
      </main>
    );
  }

  return (
    <main className="mt-8 space-y-6">
      <H2>Factures & paiements</H2>

      {/* Stripe Connect Status Card */}
      <section className="rounded-3xl border border-border bg-white p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10">
            <CreditCard className="h-6 w-6 text-secondary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Compte de réception des paiements
            </h3>

            {!status?.hasAccount && (
              <>
                <p className="text-sm text-muted-foreground">
                  Configurez votre compte bancaire pour recevoir les paiements
                  de vos missions. La configuration est sécurisée et gérée par
                  Stripe.
                </p>
                <Button
                  variant="dark"
                  className="mt-2 rounded-full px-6"
                  disabled={onboardingMutation.isPending}
                  onClick={() => onboardingMutation.mutate()}
                >
                  {onboardingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    "Configurer mon compte"
                  )}
                </Button>
              </>
            )}

            {status?.hasAccount && !status.onboardingComplete && (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>Configuration incomplète</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Votre compte Stripe est créé mais la configuration n&apos;est
                  pas terminée. Veuillez compléter votre profil pour pouvoir
                  recevoir des paiements.
                </p>
                <Button
                  variant="dark"
                  className="mt-2 rounded-full px-6"
                  disabled={onboardingMutation.isPending}
                  onClick={() => onboardingMutation.mutate()}
                >
                  {onboardingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    "Compléter la configuration"
                  )}
                </Button>
              </>
            )}

            {status?.hasAccount && status.onboardingComplete && (
              <>
                {/* <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Compte configuré et actif</span>
                </div> */}
                <p className="text-sm text-muted-foreground">
                  Votre compte est prêt à recevoir des paiements. Vous pouvez
                  accéder à votre tableau de bord Stripe pour gérer vos
                  versements.
                </p>
                <Button
                  variant="outline-secondary"
                  className="mt-2 rounded-full px-6"
                  disabled={dashboardMutation.isPending}
                  onClick={() => dashboardMutation.mutate()}
                >
                  {dashboardMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ouverture...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Accéder au tableau de bord Stripe
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Payment History - DataTable */}
      <DataTable
        columns={renfordColumns}
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
        description="Retrouvez ici l'ensemble de vos paiements reçus."
        exportFileName="paiements-renford"
      />
    </main>
  );
}
