"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateIndisponibilite,
  useDeleteIndisponibilite,
  useIndisponibilites,
} from "@/hooks/mission";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import type { RepetitionIndisponibilite } from "@/types/mission";

// ─── Time options ────────────────────────────────────────────

const TIME_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

type Props = {
  children: React.ReactNode;
};

export default function IndisponibilitesDialog({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [journeeEntiere, setJourneeEntiere] = useState(true);
  const [dateDebut, setDateDebut] = useState<Date | undefined>();
  const [dateFin, setDateFin] = useState<Date | undefined>();
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("18:00");
  const [repeter, setRepeter] = useState(false);
  const [repetition, setRepetition] =
    useState<RepetitionIndisponibilite>("aucune");

  const { data: indisponibilites } = useIndisponibilites();
  const createMutation = useCreateIndisponibilite();
  const deleteMutation = useDeleteIndisponibilite();

  const resetForm = () => {
    setJourneeEntiere(true);
    setDateDebut(undefined);
    setDateFin(undefined);
    setHeureDebut("08:00");
    setHeureFin("18:00");
    setRepeter(false);
    setRepetition("aucune");
  };

  const handleSubmit = () => {
    if (!dateDebut || !dateFin) return;

    createMutation.mutate(
      {
        dateDebut: format(dateDebut, "yyyy-MM-dd"),
        dateFin: format(dateFin, "yyyy-MM-dd"),
        heureDebut: journeeEntiere ? undefined : heureDebut,
        heureFin: journeeEntiere ? undefined : heureFin,
        journeeEntiere,
        repetition: repeter ? repetition : "aucune",
      },
      { onSuccess: resetForm },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-lg font-semibold">
            Mes indisponibilités
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          {/* Journée entière toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="journee-entiere" className="text-sm font-medium">
              Journée entière
            </Label>
            <Switch
              id="journee-entiere"
              checked={journeeEntiere}
              onCheckedChange={setJourneeEntiere}
            />
          </div>

          {/* Date de début */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-muted-foreground">
              A Partir de
            </Label>
            <DatePickerField
              date={dateDebut}
              onSelect={setDateDebut}
              placeholder="début"
            />
            {!journeeEntiere && (
              <TimeSelect
                value={heureDebut}
                onChange={setHeureDebut}
                placeholder="Horaire de début"
              />
            )}
          </div>

          {/* Date de fin */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Jusqu&apos;au
            </Label>
            <DatePickerField
              date={dateFin}
              onSelect={setDateFin}
              placeholder="fin..."
            />
            {!journeeEntiere && (
              <TimeSelect
                value={heureFin}
                onChange={setHeureFin}
                placeholder="Horaire de fin"
              />
            )}
          </div>

          {/* Répétition toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="repeter" className="text-sm font-medium">
                Répété l&apos;indisponibilité
              </Label>
              <Switch
                id="repeter"
                checked={repeter}
                onCheckedChange={(checked) => {
                  setRepeter(checked);
                  if (!checked) setRepetition("aucune");
                  else setRepetition("tous_les_jours");
                }}
              />
            </div>

            {repeter && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRepetition("tous_les_jours")}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
                    repetition === "tous_les_jours"
                      ? "bg-foreground text-white border-foreground"
                      : "bg-white text-foreground border-border hover:bg-secondary/50",
                  )}
                >
                  Tous les jours
                </button>
                <button
                  type="button"
                  onClick={() => setRepetition("toutes_les_semaines")}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
                    repetition === "toutes_les_semaines"
                      ? "bg-foreground text-white border-foreground"
                      : "bg-white text-foreground border-border hover:bg-secondary/50",
                  )}
                >
                  Toutes les semaines
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!dateDebut || !dateFin || createMutation.isPending}
            className="w-full rounded-xl"
            variant="dark"
          >
            {createMutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>

          {/* Existing indisponibilités */}
          {indisponibilites && indisponibilites.length > 0 && (
            <div className="space-y-3 border-t border-border pt-5">
              <p className="text-sm font-semibold text-foreground">
                Indisponibilités enregistrées
              </p>
              <div className="space-y-2">
                {indisponibilites.map((indispo) => (
                  <div
                    key={indispo.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-secondary-background px-4 py-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {format(new Date(indispo.dateDebut), "dd MMM yyyy", {
                          locale: fr,
                        })}{" "}
                        →{" "}
                        {format(new Date(indispo.dateFin), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                      {!indispo.journeeEntiere && indispo.heureDebut && (
                        <p className="text-xs text-muted-foreground">
                          {indispo.heureDebut} – {indispo.heureFin}
                        </p>
                      )}
                      {indispo.repetition !== "aucune" && (
                        <p className="text-xs text-muted-foreground">
                          {indispo.repetition === "tous_les_jours"
                            ? "Tous les jours"
                            : "Toutes les semaines"}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(indispo.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Date picker sub-component ──────────────────────────────

function DatePickerField({
  date,
  onSelect,
  placeholder,
}: {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm transition-colors hover:bg-secondary/30",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-left">
            {date ? format(date, "dd MMM yyyy", { locale: fr }) : placeholder}
          </span>
          <svg
            className="h-4 w-4 text-muted-foreground shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            setOpen(false);
          }}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}

// ─── Time select sub-component ──────────────────────────────

function TimeSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full rounded-xl border-border bg-white px-4 py-3 h-auto text-sm [&>svg]:hidden">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
