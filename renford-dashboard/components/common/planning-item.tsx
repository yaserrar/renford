"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Clock3, List, MapPin } from "lucide-react";
import Image from "next/image";

type PlanningItemProps = {
  title: string;
  subtitle?: string;
  establishmentName?: string;
  establishmentAddress?: string;
  exercises?: string[];
  dateLabel?: string;
  timeLabel: string;
  logoSrc?: string;
  amountValue?: string;
  amountSuffix?: string;
  visualType?: "logo" | "avatar";
  hideDate?: boolean;
  className?: string;
};

export default function PlanningItem({
  title,
  subtitle,
  establishmentName,
  establishmentAddress,
  exercises,
  dateLabel,
  timeLabel,
  logoSrc,
  amountValue,
  amountSuffix,
  visualType = "logo",
  hideDate = false,
  className,
}: PlanningItemProps) {
  return (
    <div className={cn("border-t border-border bg-white py-4", className)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "overflow-hidden bg-gray-50 flex items-center justify-center",
            visualType === "avatar"
              ? "h-14 w-14 min-w-14 rounded-full"
              : "h-24 w-24 min-w-24 rounded-xl",
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
            {amountValue && (
              <p className="text-sm text-foreground">
                <span className="font-semibold">{amountValue}</span>
                {amountSuffix && (
                  <span className="ml-1 text-muted-foreground font-normal">
                    {amountSuffix}
                  </span>
                )}
              </p>
            )}
          </div>

          {establishmentName || establishmentAddress ? (
            <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="truncate">
                {establishmentName && (
                  <span className="font-semibold text-foreground">
                    {establishmentName}
                  </span>
                )}
                {establishmentName && establishmentAddress ? " · " : ""}
                {establishmentAddress}
              </p>
            </div>
          ) : (
            subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            )
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4 text-sm text-secondary-dark">
            {!hideDate && dateLabel && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {dateLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-2 font-semibold">
              <Clock3 className="h-4 w-4" />
              {timeLabel}
            </span>
          </div>

          {exercises && exercises.length > 0 && (
            <div className="flex items-start gap-2 pt-2">
              <List className="h-4 w-4 text-black" />
              <p className="text-sm">
                {exercises.map((exercise) => (
                  <li key={exercise} className="list-inside list-disc">
                    {exercise.toLowerCase()}
                  </li>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
