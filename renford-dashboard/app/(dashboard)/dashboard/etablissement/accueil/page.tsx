"use client";

import { useCurrentUser } from "@/hooks/utilisateur";
import EtablissementIndicatorsSection from "./-components/indicators-section";
import EtablissementPlanningSection from "./-components/planning-section";
import EtablissementTopActionsSection from "./-components/top-actions-section";

export default function EtablissementAccueilPage() {
  const { data: currentUser } = useCurrentUser();

  const todayLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-background px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5 md:space-y-6">
        <section className="space-y-1">
          <p className="text-sm text-muted-foreground capitalize">
            {todayLabel}
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            Bonjour {currentUser?.prenom || ""}
          </p>
        </section>
        <EtablissementTopActionsSection />
        <EtablissementIndicatorsSection />
        <EtablissementPlanningSection />
      </div>
    </main>
  );
}
