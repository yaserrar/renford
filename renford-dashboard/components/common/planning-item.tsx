"use client";

import { useCurrentUser } from "@/hooks/utilisateur";
import { useFileUrl } from "@/hooks/use-file-url";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock3, List, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PlanningItemProps = {
  id: string;
  title: string;
  nameLabel?: string;
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
  id,
  title,
  nameLabel,
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
  const { data: currentUser } = useCurrentUser();
  const logoUrl = useFileUrl(logoSrc ?? null);

  return (
    <Link
      href={
        currentUser?.typeUtilisateur === "etablissement"
          ? `/dashboard/etablissement/missions/${id}`
          : `/dashboard/renford/missions/${id}`
      }
      className={cn(
        "border-t border-border bg-white py-4 cursor-pointer",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "overflow-hidden bg-gray-50 flex items-center justify-center",
            visualType === "avatar"
              ? "h-14 w-14 min-w-14 rounded-full"
              : "md:h-30 md:w-30 h-16 w-16 md:rounded-xl rounded-sm",
          )}
        >
          {logoSrc && logoUrl ? (
            <Image
              src={logoUrl}
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
            <p
              className={cn(
                "text-base md:text-lg text-foreground",
                nameLabel ? "font-normal" : "font-semibold",
              )}
            >
              {nameLabel && <span className="font-semibold">{nameLabel}</span>}
              {nameLabel && " - "}
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

          {(establishmentName || establishmentAddress) && (
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
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4 text-sm">
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
    </Link>
  );
}
