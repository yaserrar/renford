"use client";

import SubscriptionPlanCard from "./subscription-plan-card";
import QuotaProgressBar from "./quota-progress-bar";
import { PLAN_LABELS } from "./page";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    key: "echauffement" as const,
    name: "ÉCHAUFFEMENT",
    missions: "10 missions/mois",
    price: "99€",
    priceLabel: "/ mois",
    description: [
      "Simple et rapide à mettre en place",
      "Parfait pour tester Renford",
    ],
    buttonLabel: "Démarrer avec ÉCHAUFFEMENT",
    recommended: false,
  },
  {
    key: "performance" as const,
    name: "PERFORMANCE",
    missions: "25 missions/mois",
    price: "199€",
    priceLabel: "/ mois",
    description: ["Tarification simple et prévisible", "Coût optimisé"],
    buttonLabel: "Passer au plan PERFORMANCE",
    recommended: true,
  },
  {
    key: "competition" as const,
    name: "COMPÉTITION",
    missions: "Missions illimitées",
    price: "Tarification adaptée",
    description: ["Pour une activité sans limite", "Zéro contrainte de volume"],
    buttonLabel: "Parler à un expert",
    recommended: false,
    badgeLabel: "Volume illimitée",
    variant: "custom" as const,
  },
];

interface SubscriptionPlansSectionProps {
  activePlan?: string | null;
  missionsUsed?: number;
  quota?: number;
  competitionPrice?: number | null;
  onSubscribe?: (plan: "echauffement" | "performance" | "competition") => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function SubscriptionPlansSection({
  activePlan = null,
  missionsUsed = 0,
  quota = 0,
  competitionPrice = null,
  onSubscribe,
  onCancel,
  isLoading = false,
}: SubscriptionPlansSectionProps) {
  const hasSubscription = !!activePlan;

  const handleCardButton = (
    planKey: "echauffement" | "performance" | "competition",
  ) => {
    if (planKey === "competition") {
      if (competitionPrice) {
        onSubscribe?.(planKey);
      } else {
        window.open(
          "mailto:contact@renford.fr?subject=Plan%20Compétition",
          "_blank",
        );
      }
      return;
    }
    onSubscribe?.(planKey);
  };

  return (
    <section className="space-y-4 p-4 bg-white rounded-3xl">
      {hasSubscription && (
        <QuotaProgressBar
          missionsUsed={missionsUsed}
          quotaTotal={quota}
          planName={
            activePlan
              ? (PLAN_LABELS[activePlan] ?? activePlan.toUpperCase())
              : ""
          }
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCompetition = plan.key === "competition";
          const competitionPriceLabel = competitionPrice
            ? `${competitionPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`
            : undefined;

          const resolvedPrice =
            isCompetition && competitionPrice
              ? competitionPriceLabel!
              : plan.price;

          const resolvedPriceLabel =
            isCompetition && competitionPrice ? "/ mois HT" : plan.priceLabel;

          const resolvedVariant =
            isCompetition && competitionPrice
              ? ("default" as const)
              : plan.variant;

          const resolvedButtonLabel = (() => {
            if (activePlan === plan.key) return "Plan actuel";
            if (isCompetition && competitionPrice)
              return "Souscrire au plan COMPÉTITION";
            if (isCompetition) return plan.buttonLabel;
            if (activePlan) return `Changer pour ${plan.name}`;
            return plan.buttonLabel;
          })();

          return (
            <SubscriptionPlanCard
              key={plan.name}
              name={plan.name}
              missions={plan.missions}
              price={resolvedPrice}
              priceLabel={resolvedPriceLabel}
              description={plan.description}
              buttonLabel={resolvedButtonLabel}
              onButtonClick={
                activePlan === plan.key
                  ? undefined
                  : () => handleCardButton(plan.key)
              }
              recommended={plan.recommended}
              badgeLabel={plan.badgeLabel}
              variant={resolvedVariant}
              isCurrentPlan={activePlan === plan.key}
            />
          );
        })}
      </div>

      {/* Cancel subscription button */}
      {onCancel && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost-destructive"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler mon abonnement
          </Button>
        </div>
      )}
    </section>
  );
}
