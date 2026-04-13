"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import TimePicker from "@/components/common/time-picker";
import { useCreateIndisponibilite } from "@/hooks/indisponibilite";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateIndisponibiliteDialog({
  open,
  onOpenChange,
}: Props) {
  const [journeeEntiere, setJourneeEntiere] = useState(true);
  const [dateDebut, setDateDebut] = useState<Date | undefined>();
  const [dateFin, setDateFin] = useState<Date | undefined>();
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("18:00");
  const [repeter, setRepeter] = useState(false);
  const [repetition, setRepetition] = useState<
    "aucune" | "tous_les_jours" | "toutes_les_semaines"
  >("aucune");

  const createMutation = useCreateIndisponibilite();

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
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-lg font-semibold">
            Ajouter une indisponibilité
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
            <DatePicker
              value={dateDebut}
              onChange={setDateDebut}
              placeholder="début"
            />
            {!journeeEntiere && (
              <TimePicker
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
            <DatePicker
              value={dateFin}
              onChange={setDateFin}
              placeholder="fin..."
            />
            {!journeeEntiere && (
              <TimePicker
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
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!dateDebut || !dateFin || createMutation.isPending}
              variant="dark"
            >
              {createMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
