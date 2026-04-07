"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  CreditCard,
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
      <H2>Paiements</H2>

      {/* Stripe Connect Status Card */}
      <section className="rounded-3xl border border-border bg-white px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
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
                  className="mt-3 px-6"
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
                <div className="flex items-center gap-2 text-sm text-amber-600">
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
                  className="mt-3 px-6"
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
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Compte configuré et actif</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Votre compte est prêt à recevoir des paiements. Vous pouvez
                  accéder à votre tableau de bord Stripe pour gérer vos
                  versements.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 px-6"
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
        data={payments}
        isLoading={historyQuery.isLoading}
        enableFilters={false}
        title="Historique des paiements"
        description="Retrouvez ici l'ensemble de vos paiements reçus."
        exportFileName="paiements-renford"
      />
    </main>
  );
}
