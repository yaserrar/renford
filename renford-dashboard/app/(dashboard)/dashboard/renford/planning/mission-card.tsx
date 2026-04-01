"use client";

import { cn } from "@/lib/utils";
import { RenfordPlanningSlot } from "@/types/mission";
import {
  DISCIPLINE_MISSION_LABELS,
  MATERIELS_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import { Clock3, MapPin, List, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  slot: RenfordPlanningSlot;
  className?: string;
};

export default function MissionCard({ slot, className }: Props) {
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
      className={cn(
        "rounded-2xl border border-border bg-white p-4 md:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="hidden sm:flex h-20 w-20 min-w-20 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
          {slot.etablissement.avatarChemin ? (
            <Image
              src={slot.etablissement.avatarChemin}
              alt={slot.etablissement.nom}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">LOGO</span>
          )}
        </div>

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

          {/* Un problème? */}
          <div className="mt-3 flex justify-end">
            <Link
              href={`/dashboard/renford/missions/${slot.missionId}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Un problème ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
