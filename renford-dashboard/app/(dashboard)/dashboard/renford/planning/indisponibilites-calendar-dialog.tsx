"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  useDeleteIndisponibilite,
  useIndisponibilitesByMonth,
} from "@/hooks/indisponibilite";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import CreateIndisponibiliteDialog from "./indisponibilites-dialog";

// ─── Helpers ─────────────────────────────────────────────────

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─── Component ───────────────────────────────────────────────

type Props = {
  children: React.ReactNode;
};

export default function IndisponibilitesCalendarDialog({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [displayMonth, setDisplayMonth] = useState(new Date());

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth() + 1; // 1-based

  const { data: indisponibilites } = useIndisponibilitesByMonth(year, month);
  const deleteMutation = useDeleteIndisponibilite();

  // Build a Set of date strings (YYYY-MM-DD) that have indisponibilités
  const indispoDatesSet = useMemo(() => {
    const set = new Set<string>();
    if (indisponibilites) {
      for (const ind of indisponibilites) {
        set.add(ind.date.slice(0, 10));
      }
    }
    return set;
  }, [indisponibilites]);

  // Indisponibilités for the selected date
  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;
  const selectedIndispos = useMemo(() => {
    if (!selectedDateStr || !indisponibilites) return [];
    return indisponibilites.filter(
      (i) => i.date.slice(0, 10) === selectedDateStr,
    );
  }, [indisponibilites, selectedDateStr]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="md:max-w-sm rounded-2xl overflow-y-auto max-h-[90vh] p-0">
          <DialogHeader className="border-b border-border px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              Mes indisponibilités
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 pt-2 pb-5 space-y-4">
            {/* Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={displayMonth}
              onMonthChange={setDisplayMonth}
              locale={fr}
              modifiers={{
                indisponible: (date) =>
                  indispoDatesSet.has(format(date, "yyyy-MM-dd")),
              }}
              modifiersClassNames={{
                indisponible: "indisponible-day",
              }}
              className="w-full"
            />

            {/* Selected date details */}
            {selectedDate && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground capitalize">
                  {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                </p>

                {selectedIndispos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucune indisponibilité ce jour
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedIndispos.map((indispo) => (
                      <div
                        key={indispo.id}
                        className="flex items-center justify-between rounded-xl border-border bg-secondary-background px-4 py-2"
                      >
                        <div className="space-y-0.5">
                          {indispo.journeeEntiere ? (
                            <p className="text-sm font-medium text-foreground">
                              Journée entière
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-foreground">
                              {indispo.heureDebut != null &&
                                minutesToTime(indispo.heureDebut)}
                              {" – "}
                              {indispo.heureFin != null &&
                                minutesToTime(indispo.heureFin)}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost-destructive"
                          onClick={() => deleteMutation.mutate(indispo.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add button */}
            <Button
              variant="dark"
              className="w-full gap-2 rounded-xl"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Ajouter une indisponibilité
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateIndisponibiliteDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}
