import EtablissementIndicatorsSection from "./-components/indicators-section";
import EtablissementPlanningSection from "./-components/planning-section";
import EtablissementTopActionsSection from "./-components/top-actions-section";

export default function EtablissementAccueilPage() {
  return (
    <main className="min-h-screen bg-background px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5 md:space-y-6">
        <EtablissementTopActionsSection />
        <EtablissementIndicatorsSection />
        <EtablissementPlanningSection />
      </div>
    </main>
  );
}
