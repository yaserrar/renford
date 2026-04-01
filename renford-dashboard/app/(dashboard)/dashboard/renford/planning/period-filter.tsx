"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = {
  from: Date | undefined;
  to: Date | undefined;
  onRangeChange: (from: Date | undefined, to: Date | undefined) => void;
  onClear: () => void;
};

export default function PeriodFilter({
  from,
  to,
  onRangeChange,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<"from" | "to">("from");

  const hasFilter = from !== undefined && to !== undefined;

  const label = hasFilter
    ? `${format(from, "dd MMM", { locale: fr })} – ${format(to, "dd MMM yyyy", { locale: fr })}`
    : "Toutes les périodes";

  const handleClear = () => {
    onClear();
  };

  const handlePrev = () => {
    if (!from || !to) return;
    const diff = to.getTime() - from.getTime();
    onRangeChange(
      new Date(from.getTime() - diff),
      new Date(to.getTime() - diff),
    );
  };

  const handleNext = () => {
    if (!from || !to) return;
    const diff = to.getTime() - from.getTime();
    onRangeChange(
      new Date(from.getTime() + diff),
      new Date(to.getTime() + diff),
    );
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
      {hasFilter && (
        <button
          type="button"
          onClick={handlePrev}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="text-sm font-medium whitespace-nowrap"
          >
            {!hasFilter && (
              <ChevronLeft className="inline size-4 mr-1 text-muted-foreground" />
            )}
            {label}
            {!hasFilter && (
              <ChevronRight className="inline size-4 ml-1 text-muted-foreground" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 space-y-3" align="start">
          <div className="flex gap-2 text-sm">
            <Button
              variant={selecting === "from" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelecting("from")}
            >
              Début{from ? `: ${format(from, "dd/MM", { locale: fr })}` : ""}
            </Button>
            <Button
              variant={selecting === "to" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelecting("to")}
            >
              Fin{to ? `: ${format(to, "dd/MM", { locale: fr })}` : ""}
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={selecting === "from" ? from : to}
            onSelect={(d) => {
              if (selecting === "from") {
                onRangeChange(d, to);
                setSelecting("to");
              } else {
                onRangeChange(from, d);
                setOpen(false);
              }
            }}
            locale={fr}
          />
          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                handleClear();
                setOpen(false);
              }}
            >
              Réinitialiser
            </Button>
          )}
        </PopoverContent>
      </Popover>

      {hasFilter && (
        <button
          type="button"
          onClick={handleNext}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
