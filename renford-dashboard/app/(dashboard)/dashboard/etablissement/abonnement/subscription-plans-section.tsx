"use client";

import SubscriptionPlanCard from "./subscription-plan-card";
import type { DebugPlan } from "./debug-controls";
import QuotaProgressBar from "./quota-progress-bar";
import { PLAN_LABELS } from "./page";

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
  activePlan?: DebugPlan;
  missionsUsed?: number;
  quota?: number;
}

export default function SubscriptionPlansSection({
  activePlan = "none",
  missionsUsed = 0,
  quota = 0,
}: SubscriptionPlansSectionProps) {
  const hasSubscription = activePlan !== "none";

  return (
    <section className="space-y-4 p-4 bg-white rounded-3xl">
      {hasSubscription && (
        <QuotaProgressBar
          missionsUsed={missionsUsed}
          quotaTotal={quota}
          planName={PLAN_LABELS[activePlan]}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <SubscriptionPlanCard
            key={plan.name}
            name={plan.name}
            missions={plan.missions}
            price={plan.price}
            priceLabel={plan.priceLabel}
            description={plan.description}
            buttonLabel={plan.buttonLabel}
            recommended={plan.recommended}
            badgeLabel={plan.badgeLabel}
            variant={plan.variant}
            isCurrentPlan={activePlan === plan.key}
          />
        ))}
      </div>
    </section>
  );
}
