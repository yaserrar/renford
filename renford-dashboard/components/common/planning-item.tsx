"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";

type PlanningItemProps = {
  title: string;
  subtitle: string;
  dateLabel: string;
  timeLabel: string;
  logoSrc?: string;
  amountLabel?: string;
  visualType?: "logo" | "avatar";
  className?: string;
};

export default function PlanningItem({
  title,
  subtitle,
  dateLabel,
  timeLabel,
  logoSrc,
  amountLabel,
  visualType = "logo",
  className,
}: PlanningItemProps) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-white p-4", className)}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "overflow-hidden border border-border bg-gray-50 flex items-center justify-center",
            visualType === "avatar"
              ? "h-12 w-12 min-w-12 rounded-full"
              : "h-20 w-20 min-w-20 rounded-xl",
          )}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={title}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground text-center px-2">
              LOGO
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base md:text-lg font-semibold text-foreground">
              {title}
            </p>
            {amountLabel && (
              <p className="text-sm font-semibold text-foreground">
                {amountLabel}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          <div className="pt-1 flex flex-wrap items-center gap-4 text-sm text-secondary-dark">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {timeLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
