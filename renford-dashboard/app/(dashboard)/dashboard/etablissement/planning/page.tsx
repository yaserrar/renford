"use client";

import PlanningEmptyState from "@/components/common/planning-empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H2 } from "@/components/ui/typography";
import { useEtablissementPlanning } from "@/hooks/mission";
import { cn } from "@/lib/utils";
import { addDays, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CenterState from "@/components/common/center-state";
import RenfordCard from "./renford-card";
import RenfordRow from "./renford-row";
import { Button } from "@/components/ui/button";

// ─── Helpers ─────────────────────────────────────────────────

function getMonday(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function formatWeekRange(monday: Date) {
  const sunday = addDays(monday, 6);
  return `${format(monday, "dd/MM/yyyy")} – ${format(sunday, "dd/MM/yyyy")}`;
}

const DAY_ABBR = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

function getDaysOfWeek(monday: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    return {
      date: d,
      iso: format(d, "yyyy-MM-dd"),
      label: `${DAY_ABBR[i]} ${format(d, "dd/MM")}`,
      labelShort: DAY_ABBR[i]!,
      dayNumber: format(d, "dd"),
    };
  });
}

// ─── Main page ───────────────────────────────────────────────

export default function EtablissementPlanningPage() {
  const router = useRouter();
  const [currentMonday, setCurrentMonday] = useState(() =>
    getMonday(new Date()),
  );
  const [selectedEtab, setSelectedEtab] = useState<string>("all");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const days = useMemo(() => getDaysOfWeek(currentMonday), [currentMonday]);
  const fromStr = format(currentMonday, "yyyy-MM-dd");
  const toStr = format(addDays(currentMonday, 6), "yyyy-MM-dd");

  const { data, isLoading } = useEtablissementPlanning(
    fromStr,
    toStr,
    selectedEtab === "all" ? undefined : selectedEtab,
  );

  const planning = data?.planning ?? [];
  const etablissements = data?.etablissements ?? [];

  const goToPrevWeek = () => setCurrentMonday((m) => addDays(m, -7));
  const goToNextWeek = () => setCurrentMonday((m) => addDays(m, 7));

  const handleSlotClick = (missionId: string) => {
    router.push(`/dashboard/etablissement/missions/${missionId}`);
  };

  return (
    <main className="mt-8 space-y-6">
      <div className="w-full space-y-4">
        <H2>Planning</H2>

        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Week navigator */}
          <div className="inline-flex items-center rounded-full border bg-white p-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={goToPrevWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium">
              {formatWeekRange(currentMonday)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={goToNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Établissement filter */}
          <Select value={selectedEtab} onValueChange={setSelectedEtab}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Lieu de la mission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sites</SelectItem>
              {etablissements.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-secondary-background min-h-[620px] rounded-3xl border m-1 p-4 md:p-6">
        {/* ── Desktop table ─────────────────────────────────── */}
        <div className="hidden md:block">
          {isLoading ? (
            <CenterState
              title="Chargement du planning"
              description="Nous récupérons le planning de la semaine."
              isLoading
              className="border-0 min-h-[360px] rounded-3xl"
            />
          ) : planning.length === 0 ? (
            <PlanningEmptyState
              description="Postez une mission et recevez vos premiers profils dès aujourd'hui."
              ctaLabel="Nouvelle mission"
              ctaHref="/dashboard/etablissement/missions/nouvelle"
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[800px] table-fixed">
                <thead>
                  <tr className="border-b border-border">
                    <th className="sticky left-0 z-10 bg-white w-[200px] py-3 pl-4 pr-6 text-left text-sm font-semibold text-foreground">
                      Renford
                    </th>
                    {days.map((day) => (
                      <th
                        key={day.iso}
                        className="px-2 py-3 text-left text-sm font-semibold text-foreground"
                      >
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {planning.map((renford) => (
                    <RenfordRow
                      key={renford.id}
                      renford={renford}
                      days={days}
                      onSlotClick={handleSlotClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Mobile view ───────────────────────────────────── */}
        <div className="md:hidden space-y-4">
          {/* Day tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-2">
            {days.map((day, i) => (
              <button
                key={day.iso}
                type="button"
                onClick={() => setSelectedDayIndex(i)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-xs font-medium transition-colors min-w-[48px]",
                  selectedDayIndex === i
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50",
                )}
              >
                <span>{day.labelShort}</span>
                <span className="text-sm font-semibold">{day.dayNumber}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          {isLoading ? (
            <CenterState
              title="Chargement"
              description="Nous récupérons le planning de la semaine."
              isLoading
              className="border-0 min-h-[200px] rounded-3xl"
            />
          ) : planning.length === 0 ? (
            <PlanningEmptyState
              description="Postez une mission et recevez vos premiers profils dès aujourd'hui."
              ctaLabel="Nouvelle mission"
              ctaHref="/dashboard/etablissement/missions/nouvelle"
            />
          ) : (
            <div className="space-y-3">
              {planning.map((renford) => (
                <RenfordCard
                  key={renford.id}
                  renford={renford}
                  selectedDayIso={days[selectedDayIndex]!.iso}
                  onSlotClick={handleSlotClick}
                />
              ))}
              {planning.every(
                (r) =>
                  r.slots.filter(
                    (s) => s.date.slice(0, 10) === days[selectedDayIndex]!.iso,
                  ).length === 0,
              ) && (
                <div className="flex h-[120px] items-center justify-center rounded-2xl bg-white">
                  <p className="text-sm text-muted-foreground">
                    Aucune mission ce jour
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
