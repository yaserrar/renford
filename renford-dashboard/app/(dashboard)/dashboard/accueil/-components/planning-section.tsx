"use client";

import PlanningEmpty from "@/components/common/planning-empty";
import PlanningItem from "@/components/common/planning-item";

export type PlanningEntry = {
  title: string;
  subtitle: string;
  dateLabel: string;
  timeLabel: string;
  logoSrc?: string;
  amountLabel?: string;
  visualType?: "logo" | "avatar";
};

type PlanningSectionProps = {
  role: "renford" | "etablissement";
  entries: PlanningEntry[];
};

export default function PlanningSection({
  role,
  entries,
}: PlanningSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-white/40 p-4 md:p-6">
      <div className="mb-4">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          Planning
        </p>
        <p className="text-sm text-muted-foreground">
          Retrouvez ici vos prochains créneaux et missions à venir.
        </p>
      </div>

      {entries.length === 0 ? (
        <PlanningEmpty role={role} />
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
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
      )}
    </section>
  );
}
