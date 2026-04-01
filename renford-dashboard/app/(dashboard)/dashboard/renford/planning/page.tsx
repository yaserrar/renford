"use client";

import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import { H2 } from "@/components/ui/typography";
import { useRenfordPlanning } from "@/hooks/mission";
import { RenfordPlanningSlot } from "@/types/mission";
import { format, isToday, isTomorrow } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarOff, Info } from "lucide-react";
import { useMemo, useState } from "react";
import IndisponibilitesDialog from "./indisponibilites-dialog";
import MissionCard from "./mission-card";

// ─── Helpers ─────────────────────────────────────────────────

function formatDayHeading(dateStr: string) {
  const d = new Date(dateStr);
  let prefix = "";
  if (isToday(d)) prefix = "Aujourd'hui – ";
  else if (isTomorrow(d)) prefix = "Demain – ";

  const formatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);

  return `${prefix}${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}`;
}

function groupByDate(slots: RenfordPlanningSlot[]) {
  const map = new Map<string, RenfordPlanningSlot[]>();
  for (const slot of slots) {
    const key = slot.date.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(slot);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, items }));
}

// ─── Page ────────────────────────────────────────────────────

export default function RenfordPlanningPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const fromStr = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined;
  const toStr = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { data: slots, isLoading } = useRenfordPlanning(fromStr, toStr);

  const grouped = useMemo(() => groupByDate(slots ?? []), [slots]);

  return (
    <main className="mt-8 space-y-6">
      <div className="w-full space-y-4">
        <H2>Planning</H2>

        {/* Header actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          <IndisponibilitesDialog>
            <Button variant="outline" className="gap-2">
              <CalendarOff className="h-4 w-4" />
              Mes indisponibilités
            </Button>
          </IndisponibilitesDialog>
        </div>
      </div>

      <div className="bg-secondary-background min-h-[620px] rounded-3xl border m-1 p-4 md:p-6">
        {/* Info banner */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="h-5 w-5 shrink-0" />
          <p>
            Merci de venir légèrement en avance pour faciliter la prise de
            poste.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center rounded-3xl border border-border bg-white">
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-3xl border border-border bg-white">
            <p className="text-sm text-muted-foreground">
              Aucune mission sur cette période
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <section key={group.date} className="space-y-3">
                <h2 className="text-base md:text-lg font-semibold text-foreground capitalize">
                  {formatDayHeading(group.date)}
                </h2>
                <div className="space-y-3">
                  {group.items.map((slot) => (
                    <MissionCard key={slot.id} slot={slot} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
