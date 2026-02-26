"use client";

import { cn } from "@/lib/utils";
import { CalendarX2 } from "lucide-react";

type PlanningEmptyProps = {
  role: "renford" | "etablissement";
  className?: string;
};

const SUBTITLES: Record<PlanningEmptyProps["role"], string> = {
  renford:
    "Ajoute tes disponibilités pour recevoir tes premières missions et remplir ton planning.",
  etablissement:
    "Crée une demande de mission pour commencer à organiser les prochaines interventions.",
};

export default function PlanningEmpty({ role, className }: PlanningEmptyProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center",
        className,
      )}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary-dark">
        <CalendarX2 className="h-6 w-6" />
      </div>
      <p className="text-lg font-semibold text-foreground">
        Aucun élément au planning
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{SUBTITLES[role]}</p>
    </div>
  );
}
