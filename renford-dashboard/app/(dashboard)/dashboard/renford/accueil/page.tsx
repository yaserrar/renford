import RenfordIndicatorsSection from "./-components/indicators-section";
import RenfordPlanningSection from "./-components/planning-section";
import RenfordTopActionsSection from "./-components/top-actions-section";

export default function RenfordAccueilPage() {
  return (
    <main className="min-h-screen bg-background px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5 md:space-y-6">
        <RenfordTopActionsSection />
        <RenfordIndicatorsSection />
        <RenfordPlanningSection />
      </div>
    </main>
  );
}
