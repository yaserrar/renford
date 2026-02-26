"use client";

import PlanningItem from "@/components/common/planning-item";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PLANNING = [
  {
    dateGroup: "Aujourd'hui - Lundi 8 janvier",
    title: "Yoga",
    establishmentName: "Fitness Park",
    establishmentAddress: "17 Pl. des Corolles, 92400 Courbevoie",
    exercises: ["Vinyasa", "Mobilité", "Respiration"],
    dateLabel: "Aujourd'hui - Lundi 8 janvier",
    timeLabel: "8h00 - 10h00 · 2h",
    logoSrc: "/planning-logos/fitness-park.png",
    amountValue: "30 €",
    amountSuffix: "HT",
  },
  {
    dateGroup: "Demain - Mardi 9 janvier",
    title: "Renforcement",
    establishmentName: "Basic Fit",
    establishmentAddress: "61 Rue de Longchamp, 92200 Neuilly-sur-Seine",
    exercises: ["Circuit training", "Gainage", "Étirements"],
    dateLabel: "Demain - Mardi 9 janvier",
    timeLabel: "10h30 - 12h00 · 1h30",
    logoSrc: "/planning-logos/basic-fit.png",
    amountValue: "30 €",
    amountSuffix: "HT",
  },
  {
    dateGroup: "Mercredi - 10 janvier",
    title: "Pilates",
    establishmentName: "Liberty Gym",
    establishmentAddress: "5 Rue des Fleurs, 92100 Boulogne-Billancourt",
    exercises: ["Matwork", "Core", "Posture"],
    dateLabel: "Mercredi - 10 janvier",
    timeLabel: "9h00 - 10h30 · 1h30",
    logoSrc: "/planning-logos/liberty-gym.png",
    amountValue: "30 €",
    amountSuffix: "HT",
  },
  {
    dateGroup: "Jeudi - 11 janvier",
    title: "Cardio",
    establishmentName: "Easy Gym",
    establishmentAddress: "22 Av. Victor Hugo, 75016 Paris",
    exercises: ["HIIT", "Cardio boxe", "Cooldown"],
    dateLabel: "Jeudi - 11 janvier",
    timeLabel: "18h00 - 19h00 · 1h",
    logoSrc: "/planning-logos/easy-gym.png",
    amountValue: "30 €",
    amountSuffix: "HT",
  },
];

const groupedPlanning = PLANNING.reduce<
  Array<{ dateGroup: string; items: (typeof PLANNING)[number][] }>
>((groups, entry) => {
  const existingGroup = groups.find(
    (group) => group.dateGroup === entry.dateGroup,
  );

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

export default function RenfordPlanningSection() {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          Mon planning
        </p>
        <Link
          href="/dashboard/renford/planning"
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
                  establishmentName={entry.establishmentName}
                  establishmentAddress={entry.establishmentAddress}
                  exercises={entry.exercises}
                  dateLabel={entry.dateLabel}
                  timeLabel={entry.timeLabel}
                  logoSrc={entry.logoSrc}
                  amountValue={entry.amountValue}
                  amountSuffix={entry.amountSuffix}
                  hideDate
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
