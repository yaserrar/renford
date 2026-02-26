"use client";

import PlanningItem from "@/components/common/planning-item";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PLANNING = [
  {
    dateGroup: "Aujourd'hui - Lundi 8 janvier",
    title: "Jessica - coach de yoga",
    subtitle: "Aujourd'hui - Lundi 8 janvier",
    dateLabel: "Séance",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-people/jessica.svg",
    amountValue: "30 €",
    amountSuffix: "HT",
    visualType: "avatar" as const,
  },
  {
    dateGroup: "Demain - Mardi 9 janvier",
    title: "Jérôme - coach de yoga",
    subtitle: "Demain - Mardi 9 janvier",
    dateLabel: "Séance",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-people/jerome.svg",
    amountValue: "30 €",
    amountSuffix: "HT",
    visualType: "avatar" as const,
  },
  {
    dateGroup: "Demain - Mardi 9 janvier",
    title: "Maxime - coach de yoga",
    subtitle: "Demain - Mardi 9 janvier",
    dateLabel: "Séance",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-people/maxime.svg",
    amountValue: "30 €",
    amountSuffix: "HT",
    visualType: "avatar" as const,
  },
];

const groupedPlanning = PLANNING.reduce<
  Array<{ dateGroup: string; items: (typeof PLANNING)[number][] }>
>((groups, entry) => {
  const existingGroup = groups.find((group) => group.dateGroup === entry.dateGroup);

  if (existingGroup) {
    existingGroup.items.push(entry);
  } else {
    groups.push({
      dateGroup: entry.dateGroup,
      items: [entry],
    });
  }

  return groups;
}, []);

export default function EtablissementPlanningSection() {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          Mon planning
        </p>
        <Link
          href="/dashboard/etablissement/planning"
          className={cn(
            buttonVariants({
              variant: "link",
            }),
            "px-0 text-black",
          )}
        >
          Voir tous
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-5">
        {groupedPlanning.map((group) => (
          <div key={group.dateGroup} className="space-y-2">
            <p className="text-sm md:text-base font-semibold text-foreground text-left">
              {group.dateGroup}
            </p>
            <div className="space-y-3">
              {group.items.map((entry, index) => (
                <PlanningItem
                  key={`${group.dateGroup}-${entry.title}-${index}`}
                  title={entry.title}
                  subtitle={entry.subtitle}
                  dateLabel={entry.dateLabel}
                  timeLabel={entry.timeLabel}
                  logoSrc={entry.logoSrc}
                  amountValue={entry.amountValue}
                  amountSuffix={entry.amountSuffix}
                  visualType={entry.visualType}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
