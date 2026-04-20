"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SecureAvatarImage } from "@/components/common/secure-file";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/utilisateur";
import { cn, getInitials } from "@/lib/utils";
import { RenfordPlanningSlot } from "@/types/mission";
import {
  DISCIPLINE_MISSION_LABELS,
  MATERIELS_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import { Clock3, MapPin, List, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  slot: RenfordPlanningSlot;
  className?: string;
};

export default function MissionCard({ slot, className }: Props) {
  const router = useRouter();

  const disciplineLabel =
    DISCIPLINE_MISSION_LABELS[slot.discipline] ?? slot.discipline;

  const address = `${slot.etablissement.adresse}, ${slot.etablissement.codePostal} ${slot.etablissement.ville}`;

  const tarifLabel = slot.tarif
    ? `${slot.tarif} €${METHODE_TARIFICATION_SUFFIXES[slot.methodeTarification] ?? ""}`
    : null;

  const materiels = slot.materielsRequis.map(
    (m) => MATERIELS_MISSION_LABELS[m] ?? m,
  );

  return (
    <div
      className={cn("border-t border-border py-4 cursor-pointer", className)}
    >
      <Link
        className="flex md:flex-row flex-col items-start gap-4"
        href={`/dashboard/renford/missions/${slot.missionId}`}
      >
        {/* Avatar */}
        <Avatar className="mt-0.5 md:h-30 md:w-30 h-16 w-16 shrink-0 rounded-sm md:rounded-xl">
          <SecureAvatarImage
            chemin={slot.etablissement.avatarChemin}
            alt={slot.etablissement.nom}
            className="rounded-md"
          />
          <AvatarFallback className="rounded-md text-sm font-medium">
            {getInitials(slot.etablissement.nom)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base md:text-lg font-semibold text-foreground">
              {disciplineLabel}
            </p>
            {tarifLabel && (
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                {tarifLabel}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="line-clamp-2">
              <span className="font-semibold text-foreground">
                {slot.etablissement.nom}
              </span>
              {" · "}
              {address}
            </p>
          </div>

          {/* Time */}
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock3 className="h-4 w-4" />
            <span>
              {slot.heureDebut} – {slot.heureFin} · {slot.totalHours}h
            </span>
          </div>

          {/* Materiels */}
          {materiels.length > 0 && (
            <div className="mt-2 flex items-start gap-2 text-sm text-foreground">
              <List className="h-4 w-4 mt-0.5 shrink-0" />
              <ul>
                {materiels.map((m) => (
                  <li key={m} className="list-inside list-disc lowercase">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Link>

      {/* Un problème? */}
      <div className="my-2 flex justify-end">
        <Link
          className={buttonVariants({ variant: "dark" })}
          href={`/dashboard/support?tab=contact`}
        >
          Un problème ?
        </Link>
      </div>
    </div>
  );
}
