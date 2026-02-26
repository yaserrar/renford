"use client";

import PlanningItem from "@/components/common/planning-item";

const PLANNING = [
  {
    title: "Yoga",
    subtitle: "Fitness park La Défense · 17 Pl. des Corolles, 92400 Courbevoie",
    dateLabel: "Aujourd'hui - Lundi 8 janvier",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-logos/fitness-park.svg",
    amountLabel: "30 € HT",
  },
  {
    title: "Yoga",
    subtitle: "Fitness park La Défense · 17 Pl. des Corolles, 92400 Courbevoie",
    dateLabel: "Demain - Mardi 9 janvier",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-logos/basic-fit.svg",
    amountLabel: "30 € HT",
  },
  {
    title: "Stretching",
    subtitle: "Fitness park La Défense · 17 Pl. des Corolles, 92400 Courbevoie",
    dateLabel: "Demain - Mardi 9 janvier",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-logos/mm-sport.svg",
    amountLabel: "30 € HT",
  },
];

export default function RenfordPlanningSection() {
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
          />
        ))}
      </div>
    </section>
  );
}
