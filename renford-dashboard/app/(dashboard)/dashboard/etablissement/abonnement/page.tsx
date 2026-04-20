"use client";

import { useState } from "react";
import PlanInfoBanner from "./plan-info-banner";
import SubscriptionPlansSection from "./subscription-plans-section";
import OtherOptionsSection from "./other-options-section";
import DebugControls, { type DebugPlan } from "./debug-controls";
import QuotaProgressBar from "./quota-progress-bar";

const PLAN_QUOTAS: Record<DebugPlan, number> = {
  none: 0,
  echauffement: 10,
  performance: 25,
  competition: 0,
};

export const PLAN_LABELS: Record<DebugPlan, string> = {
  none: "",
  echauffement: "ÉCHAUFFEMENT",
  performance: "PERFORMANCE",
  competition: "COMPÉTITION",
};

export default function AbonnementPage() {
  const [debugPlan, setDebugPlan] = useState<DebugPlan>("none");
  const [missionsUsed, setMissionsUsed] = useState(0);

  const quota = PLAN_QUOTAS[debugPlan];
  const hasSubscription = debugPlan !== "none";

  const handlePlanChange = (plan: DebugPlan) => {
    setDebugPlan(plan);
    setMissionsUsed(0);
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

      {/* Debug controls */}
      <DebugControls
        plan={debugPlan}
        onPlanChange={handlePlanChange}
        missionsUsed={missionsUsed}
        onMissionsChange={setMissionsUsed}
        maxMissions={quota}
      />

      <div className="bg-secondary-background rounded-3xl border m-1 p-6 h-full">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {/* Quota progress bar - only shown when subscribed */}

          {/* Info banner - only shown when no subscription */}
          {!hasSubscription && <PlanInfoBanner />}

          {/* Subscription plans */}
          <SubscriptionPlansSection
            activePlan={debugPlan}
            missionsUsed={missionsUsed}
            quota={quota}
          />

          {/* Other options */}
          <OtherOptionsSection />
        </div>
      </div>
    </main>
  );
}
