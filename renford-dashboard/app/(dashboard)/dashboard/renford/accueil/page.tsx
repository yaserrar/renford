"use client";

import { useCurrentUser } from "@/hooks/utilisateur";
import RenfordIndicatorsSection from "./indicators-section";
import RenfordPlanningSection from "./planning-section";
import RenfordTopActionsSection from "./top-actions-section";

export default function RenfordAccueilPage() {
  const { data: currentUser } = useCurrentUser();

  const todayLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="min-h-screen px-4 bg-secondary-background rounded-2xl m-1 border md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-5 md:space-y-6">
        <section className="space-y-1">
          <p className="text-sm text-muted-foreground capitalize">
            {todayLabel}
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            Bonjour {currentUser?.prenom || ""}
          </p>
        </section>
        <RenfordTopActionsSection />
        <RenfordIndicatorsSection />
        <RenfordPlanningSection />
      </div>
    </main>
  );
}
