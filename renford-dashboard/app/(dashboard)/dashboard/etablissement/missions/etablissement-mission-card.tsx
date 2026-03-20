"use client";

import { CalendarDays, Clock3, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MissionStatusBadge from "@/components/common/mission-status-badge";
import { MissionEtablissement, StatutMission } from "@/types/mission";
import {
  DISCIPLINE_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import {
  cn,
  formatAmount,
  formatDurationHours,
  formatFrenchDate,
} from "@/lib/utils";

type EtablissementMissionCardProps = {
  mission: MissionEtablissement;
};

const EN_RECHERCHE_STATUSES: StatutMission[] = [
  "en_attente_paiement",
  "envoyee",
  "en_cours_de_matching",
  "proposee",
  "acceptee",
];

export default function EtablissementMissionCard({
  mission,
}: EtablissementMissionCardProps) {
  const router = useRouter();

  const missionTitle =
    DISCIPLINE_MISSION_LABELS[mission.discipline] ?? "Mission";
  const isEnRecherche = EN_RECHERCHE_STATUSES.includes(mission.statut);
  const horaires = mission.PlageHoraireMission ?? [];

  const computedTotalHours = horaires.reduce((acc, slot) => {
    const [startHour, startMinute] = slot.heureDebut.split(":").map(Number);
    const [endHour, endMinute] = slot.heureFin.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return acc;
    }

    return acc + (end - start) / 60;
  }, 0);

  const totalHours =
    typeof mission.totalHours === "number"
      ? mission.totalHours
      : computedTotalHours;

  const goToDetails = () => {
    router.push(`/dashboard/etablissement/missions/${mission.id}`);
  };

  return (
    <article
      className="cursor-pointer rounded-3xl border border-border bg-white px-4 py-4 transition-colors duration-200 hover:border-secondary/45 md:px-5 md:py-5"
      onClick={goToDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToDetails();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Voir le détail de la mission"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "mt-0.5 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                isEnRecherche
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary/10 text-secondary-dark",
              )}
              aria-hidden
            >
              <User className="h-6 w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-xl leading-tight font-semibold text-foreground">
                {missionTitle}
              </p>
              <p className="text-base text-muted-foreground">
                {isEnRecherche ? "Aucun renford assigné" : "Renford assigné"}
              </p>
            </div>
          </div>
          <div className="pt-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Mission du {formatFrenchDate(mission.dateDebut)} au{" "}
              {formatFrenchDate(mission.dateFin)}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              {formatDurationHours(totalHours)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-3 md:flex-col md:items-end">
          <MissionStatusBadge status={mission.statut} />

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-lg font-semibold">
                {formatAmount(mission.tarif)}
              </span>
              <span className="text-sm text-muted-foreground">
                {METHODE_TARIFICATION_SUFFIXES[mission.methodeTarification]} HT
              </span>
            </div>

            <Button variant="dark" className="md:flex hidden" type="button">
              Détail
            </Button>
          </div>
        </div>

        <Button variant="dark" className="md:hidden flex w-full" type="button">
          Détail
        </Button>
      </div>
    </article>
  );
}
