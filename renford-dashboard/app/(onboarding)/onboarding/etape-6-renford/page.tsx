"use client";

import { Button } from "@/components/ui/button";
import {
  useUpdateRenfordBancaire,
  useSkipRenfordStep,
} from "@/hooks/onboarding";
import {
  useCreateConnectOnboarding,
  useConnectAccountStatus,
} from "@/hooks/paiement";
import { CheckCircle, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { OnboardingCard } from "../-components";
import { toast } from "sonner";

export default function Etape6RenfordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripeOnboarding = searchParams.get("stripe_onboarding");
  const stripeRefresh = searchParams.get("stripe_refresh");

  const { mutate: advanceStep, isPending: isAdvancing } =
    useUpdateRenfordBancaire();
  const { mutate: skipStep, isPending: isSkipping } = useSkipRenfordStep();
  const onboardingMutation = useCreateConnectOnboarding();
  const statusQuery = useConnectAccountStatus();
  const status = statusQuery.data;

  useEffect(() => {
    if (stripeOnboarding === "complete") {
      toast.success("Configuration Stripe terminée !");
      statusQuery.refetch();
    }
    if (stripeRefresh === "true") {
      toast.info("Session expirée. Veuillez relancer la configuration Stripe.");
    }
  }, [stripeOnboarding, stripeRefresh]);

  const isOnboardingComplete = status?.hasAccount && status?.onboardingComplete;

  const handleContinue = () => {
    advanceStep(undefined, {
      onSuccess: () => {
        router.push("/onboarding/etape-7-renford");
      },
    });
  };

  const handleSkip = () => {
    skipStep(6, {
      onSuccess: () => {
        router.push("/onboarding/etape-7-renford");
      },
    });
  };

  const handleStartStripeOnboarding = () => {
    onboardingMutation.mutate({ returnUrl: "onboarding" });
  };

  return (
    <>
      <OnboardingCard
        currentStep={6}
        totalSteps={8}
        title="Configuration du paiement"
        subtitle="Pour recevoir vos paiements"
        description="Renford utilise Stripe pour la gestion sécurisée de vos paiements. Vous allez être redirigé vers Stripe pour configurer votre compte de réception des paiements. Vos données bancaires sont gérées exclusivement par Stripe — Renford n'y a jamais accès."
      >
        <div className="space-y-5">
          {statusQuery.isLoading ? (
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Vérification du statut...
              </p>
            </div>
          ) : isOnboardingComplete ? (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  Compte Stripe configuré
                </p>
                <p className="text-xs text-green-600">
                  Votre compte est prêt à recevoir des paiements.
                </p>
              </div>
            </div>
          ) : status?.hasAccount ? (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  Configuration incomplète
                </p>
                <p className="text-xs text-amber-600">
                  Veuillez compléter la configuration de votre compte Stripe.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-secondary/60 bg-secondary/5 p-4">
              <ExternalLink className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium text-secondary-dark">
                  Configuration requise
                </p>
                <p className="text-xs text-secondary">
                  Cliquez ci-dessous pour configurer votre compte de paiement
                  via Stripe.
                </p>
              </div>
            </div>
          )}
          {!isOnboardingComplete && (
            <Button
              type="button"
              variant="dark"
              className="w-full"
              disabled={onboardingMutation.isPending}
              onClick={handleStartStripeOnboarding}
            >
              {onboardingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirection vers Stripe...
                </>
              ) : status?.hasAccount ? (
                "Compléter la configuration Stripe"
              ) : (
                "Configurer mon compte Stripe"
              )}
            </Button>
          )}
          <div className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
            <Button
              type="button"
              variant="link"
              onClick={handleSkip}
              disabled={isAdvancing || isSkipping}
              className="text-gray-500"
            >
              {isSkipping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Passer cette étape
            </Button>

            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isAdvancing || isSkipping}
              >
                Retour
              </Button>
              <Button
                type="button"
                disabled={!isOnboardingComplete || isAdvancing}
                onClick={handleContinue}
              >
                {isAdvancing && <Loader2 className="mr-2 animate-spin" />}
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </OnboardingCard>
    </>
  );
}
