"use client";

import PlanningItem from "@/components/common/planning-item";

const PLANNING = [
  {
    title: "Jessica - coach de yoga",
    subtitle: "Aujourd'hui - Lundi 8 janvier",
    dateLabel: "Séance",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-people/jessica.svg",
    amountLabel: "30 € HT",
    visualType: "avatar" as const,
  },
  {
    title: "Jérôme - coach de yoga",
    subtitle: "Demain - Mardi 9 janvier",
    dateLabel: "Séance",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-people/jerome.svg",
    amountLabel: "30 € HT",
    visualType: "avatar" as const,
  },
  {
    title: "Maxime - coach de yoga",
    subtitle: "Demain - Mardi 9 janvier",
    dateLabel: "Séance",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-people/maxime.svg",
    amountLabel: "30 € HT",
    visualType: "avatar" as const,
  },
];

export default function EtablissementPlanningSection() {
  return (
    <section className="rounded-2xl border border-border bg-white/40 p-4 md:p-6">
      <div className="mb-4">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          Mon planning
        </p>
      </div>

      <div className="space-y-3">
        {PLANNING.map((entry, index) => (
          <PlanningItem
            key={`${entry.title}-${index}`}
            title={entry.title}
            subtitle={entry.subtitle}
            dateLabel={entry.dateLabel}
            timeLabel={entry.timeLabel}
            logoSrc={entry.logoSrc}
            amountLabel={entry.amountLabel}
            visualType={entry.visualType}
          />
        ))}
      </div>
    </section>
  );
}
