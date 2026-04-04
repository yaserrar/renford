"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MissionStatusBadge from "@/components/common/mission-status-badge";
import { MissionEtablissement } from "@/types/mission";
import {
  DISCIPLINE_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import {
  formatAmount,
  formatDurationHours,
  formatFrenchDate,
  getInitials,
  getUrl,
} from "@/lib/utils";

type EtablissementMissionCardProps = {
  mission: MissionEtablissement;
};

export default function EtablissementMissionCard({
  mission,
}: EtablissementMissionCardProps) {
  const router = useRouter();

  const missionTitle =
    DISCIPLINE_MISSION_LABELS[mission.discipline] ?? "Mission";
  const horaires = mission.PlageHoraireMission ?? [];

  // Avatar logic: show renford avatar if assigned, otherwise etablissement avatar
  const renford = mission.renfordAssigne;
  const avatarSrc = renford ? getUrl(renford.avatarChemin) : "";
  const avatarInitials = renford
    ? getInitials(`${renford.prenom} ${renford.nom}`)
    : getInitials(mission.etablissement?.nom);
  const avatarSubtext = renford
    ? `${renford.prenom} ${renford.nom}`
    : "Aucun renford assigné";

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
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={avatarSrc} alt={avatarSubtext} />
              <AvatarFallback className="bg-secondary/10 text-secondary-dark text-sm font-medium">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-1">
              <p className="text-xl leading-tight font-semibold text-foreground">
                {missionTitle}
              </p>
              <p className="text-base text-muted-foreground">{avatarSubtext}</p>
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
