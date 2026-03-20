"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MissionFilters = {
  siteId: string;
  fromDate: string;
  toDate: string;
};

type MissionSiteOption = {
  id: string;
  label: string;
};

type MissionFiltersDialogProps = {
  sites: MissionSiteOption[];
  filters: MissionFilters;
  onChange: (next: MissionFilters) => void;
  onReset: () => void;
};

const parseFilterDate = (value: string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
};

const toFilterDateValue = (value?: Date): string => {
  if (!value) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function MissionFiltersDialog({
  sites,
  filters,
  onChange,
  onReset,
}: MissionFiltersDialogProps) {
  const fromDate = parseFilterDate(filters.fromDate);
  const toDate = parseFilterDate(filters.toDate);

  const activeFiltersCount =
    Number(Boolean(filters.siteId)) +
    Number(Boolean(filters.fromDate)) +
    Number(Boolean(filters.toDate));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
          {activeFiltersCount > 0 ? (
            <span className="bg-secondary-dark text-secondary-background ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold">
              {activeFiltersCount}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[760px] rounded-[36px] border bg-white px-6 py-8 sm:px-10">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl">Filtres</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Site d&apos;exécution de la mission</Label>

            <Select
              value={filters.siteId || "all"}
              onValueChange={(value) =>
                onChange({
                  ...filters,
                  siteId: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Tous les sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label>A partir de</Label>
              <DatePicker
                value={fromDate}
                toDate={toDate}
                placeholder="Début"
                onChange={(date) =>
                  onChange({
                    ...filters,
                    fromDate: toFilterDateValue(date),
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Jusqu&apos;au</Label>
              <DatePicker
                value={toDate}
                fromDate={fromDate}
                placeholder="Fin"
                onChange={(date) =>
                  onChange({
                    ...filters,
                    toDate: toFilterDateValue(date),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              className="text-muted-foreground hover:text-black"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
