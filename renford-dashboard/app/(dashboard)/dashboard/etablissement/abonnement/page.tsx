"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import PlanInfoBanner from "./plan-info-banner";
import SubscriptionPlansSection from "./subscription-plans-section";
import OtherOptionsSection from "./other-options-section";
import {
  useAbonnementActif,
  useCreateCheckoutSession,
  useCancelAbonnement,
} from "@/hooks/abonnement";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlanAbonnement } from "@/types/abonnement";
import CenterState from "@/components/common/center-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const PLAN_LABELS: Record<string, string> = {
  echauffement: "ÉCHAUFFEMENT",
  performance: "PERFORMANCE",
  competition: "COMPÉTITION",
};

export default function AbonnementPage() {
  const searchParams = useSearchParams();
  const { data, isLoading } = useAbonnementActif();
  const { mutateAsync: createCheckout, isPending: isCheckingOut } =
    useCreateCheckoutSession();
  const { mutateAsync: cancelSub, isPending: isCanceling } =
    useCancelAbonnement();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Handle Stripe redirect feedback
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Abonnement activé ! Votre plan est maintenant actif.");
    } else if (searchParams.get("canceled") === "true") {
      toast.info("Souscription annulée.");
    }
  }, [searchParams]);

  const abonnement = data?.abonnement ?? null;
  const quota = data?.quota;
  const prixCompetitionNegocie = data?.prixCompetitionNegocie ?? null;

  const activePlan = abonnement?.plan ?? null;

  // Show the real paid price when subscribed to competition,
  // otherwise show the admin-negotiated quote (or null = contact us).
  const competitionPrice =
    activePlan === "competition"
      ? (abonnement?.prixMensuelHT ?? null)
      : prixCompetitionNegocie;
  const missionsUsed = abonnement?.missionsUtilisees ?? 0;
  const quotaTotal = abonnement?.quotaMissions ?? 0;
  // dateFin being set on an actif sub means cancellation is scheduled for that date
  const scheduledCancellation =
    abonnement?.statut === "actif" && abonnement.dateFin
      ? new Date(abonnement.dateFin)
      : null;

  const handleSubscribe = async (
    plan: "echauffement" | "performance" | "competition",
  ) => {
    try {
      const { url } = await createCheckout(plan);
      if (url) window.location.href = url;
    } catch {
      // error handled by mutation's onError
    }
  };

  const handleCancel = () => setShowCancelDialog(true);

  const handleCancelConfirm = async () => {
    await cancelSub();
    setShowCancelDialog(false);
  };

  return (
    <main className="mt-8 space-y-6">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Réduisez vos coûts dès vos premières missions avec Renford
        </h1>
        <p className="text-sm text-muted-foreground">
          Accédez à des coachs qualifiés, simplifiez votre gestion et gagnez du
          temps dès <span className="italic">aujourd&apos;hui</span>.
        </p>
      </section>

      {isLoading ? (
        <CenterState
          className="border-0"
          title="Chargement des informations d'abonnement"
          description="Nous récupérons les dernières informations de votre abonnement."
          isLoading
        />
      ) : (
        <div className="bg-secondary-background rounded-3xl border m-1 p-6 h-full">
          <div className="mx-auto w-full space-y-6">
            {/* Info banner - only shown when no subscription */}
            {!activePlan && <PlanInfoBanner />}

            {/* Scheduled cancellation notice */}
            {scheduledCancellation && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Votre abonnement sera annulé le{" "}
                <strong>
                  {scheduledCancellation.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                . Vous conservez l&apos;accès à vos missions jusqu&apos;à cette
                date.
              </div>
            )}

            {/* Subscription plans */}
            <SubscriptionPlansSection
              activePlan={activePlan}
              missionsUsed={missionsUsed}
              quota={quotaTotal}
              competitionPrice={competitionPrice}
              onSubscribe={handleSubscribe}
              onCancel={
                activePlan && !scheduledCancellation ? handleCancel : undefined
              }
              isLoading={isCheckingOut || isCanceling}
            />

            {/* Other options */}
            <OtherOptionsSection />
          </div>
        </div>
      )}

      {/* Cancel subscription dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Annuler votre abonnement</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler votre abonnement{" "}
              <span className="font-semibold text-foreground">
                {abonnement?.plan ? PLAN_LABELS[abonnement.plan] : ""}
              </span>
              ? Vous conserverez l&apos;accès jusqu&apos;à la fin de votre
              période de facturation en cours. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCanceling}
            >
              Retour
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isCanceling}
            >
              {isCanceling ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
