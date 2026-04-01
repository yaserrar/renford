"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  useCreateIndisponibilite,
  useDeleteIndisponibilite,
  useIndisponibilites,
} from "@/hooks/mission";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { RepetitionIndisponibilite } from "@/types/mission";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Mes indisponibilités
            </DialogTitle>
            <DialogClose asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
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
          <div className="space-y-2">
            <Label className="text-sm font-medium">A Partir de</Label>
            <div className="flex gap-2">
              <DatePickerField
                date={dateDebut}
                onSelect={setDateDebut}
                placeholder="Sélectionner une date"
              />
              {!journeeEntiere && (
                <Input
                  type="time"
                  value={heureDebut}
                  onChange={(e) => setHeureDebut(e.target.value)}
                  className="w-auto"
                />
              )}
            </div>
          </div>

          {/* Date de fin */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Jusqu&apos;au</Label>
            <div className="flex gap-2">
              <DatePickerField
                date={dateFin}
                onSelect={setDateFin}
                placeholder="Sélectionner une date"
              />
              {!journeeEntiere && (
                <Input
                  type="time"
                  value={heureFin}
                  onChange={(e) => setHeureFin(e.target.value)}
                  className="w-auto"
                />
              )}
            </div>
          </div>

          {/* Répétition toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="repeter" className="text-sm font-medium">
                Répéter l&apos;indisponibilité
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
                    "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                    repetition === "tous_les_jours"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-foreground border-border hover:bg-secondary",
                  )}
                >
                  Tous les jours
                </button>
                <button
                  type="button"
                  onClick={() => setRepetition("toutes_les_semaines")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                    repetition === "toutes_les_semaines"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-foreground border-border hover:bg-secondary",
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
            className="w-full"
          >
            {createMutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>

          {/* Existing indisponibilités */}
          {indisponibilites && indisponibilites.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-sm font-medium text-muted-foreground">
                Indisponibilités enregistrées
              </p>
              {indisponibilites.map((indispo) => (
                <div
                  key={indispo.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="text-sm">
                    <p className="font-medium">
                      {format(new Date(indispo.dateDebut), "dd MMM yyyy", {
                        locale: fr,
                      })}{" "}
                      →{" "}
                      {format(new Date(indispo.dateFin), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                    {!indispo.journeeEntiere && indispo.heureDebut && (
                      <p className="text-muted-foreground text-xs">
                        {indispo.heureDebut} – {indispo.heureFin}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(indispo.id)}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
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
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd MMM yyyy", { locale: fr }) : placeholder}
        </Button>
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
