"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Heure",
  className,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const parts = value ? value.split(":") : ["08", "00"];
  const hh = parts[0] ?? "08";
  const mm = parts[1] ?? "00";

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Scroll selected values into view when the popover opens
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      hoursRef.current
        ?.querySelector<HTMLElement>("[data-selected=true]")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      minutesRef.current
        ?.querySelector<HTMLElement>("[data-selected=true]")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 60);
    return () => clearTimeout(timer);
  }, [open]);

  const setHour = (h: string) => onChange(`${h}:${mm}`);
  const setMinute = (m: string) => {
    onChange(`${hh}:${m}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm transition-colors hover:bg-secondary/30",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-left">{value || placeholder}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-36 p-2" align="start">
        <div className="flex gap-1 items-start">
          {/* Hours column */}
          <div
            ref={hoursRef}
            className="flex-1 h-44 overflow-y-auto overscroll-contain scroll-smooth space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                data-selected={h === hh}
                onClick={() => setHour(h)}
                className={cn(
                  "w-full rounded-lg px-2 py-1.5 text-sm text-center transition-colors cursor-pointer",
                  h === hh
                    ? "bg-foreground text-white font-semibold"
                    : "hover:bg-secondary text-foreground",
                )}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Separator */}
          <span className="pt-1.5 text-muted-foreground text-sm font-medium select-none">
            :
          </span>

          {/* Minutes column */}
          <div
            ref={minutesRef}
            className="flex-1 h-44 overflow-y-auto overscroll-contain scroll-smooth space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                data-selected={m === mm}
                onClick={() => setMinute(m)}
                className={cn(
                  "w-full rounded-lg px-2 py-1.5 text-sm text-center transition-colors cursor-pointer",
                  m === mm
                    ? "bg-foreground text-white font-semibold"
                    : "hover:bg-secondary text-foreground",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
