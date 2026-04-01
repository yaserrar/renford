"use client";

import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MissionRenfordStatusBadge from "@/components/common/mission-renford-status-badge";
import {
  MissionRenfordListItem,
  StatutMissionRenford,
} from "@/types/mission-renford";
import {
  DISCIPLINE_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import {
  cn,
  formatAmount,
  formatDurationHours,
  formatFrenchDate,
  getInitials,
  getUrl,
} from "@/lib/utils";
import { useRespondToMissionProposal } from "@/hooks/mission";

type RenfordMissionCardProps = {
  item: MissionRenfordListItem;
};

const OPPORTUNITE_STATUSES: StatutMissionRenford[] = ["nouveau", "vu"];

export default function RenfordMissionCard({ item }: RenfordMissionCardProps) {
  const router = useRouter();
  const respondMutation = useRespondToMissionProposal();

  const mission = item.mission;
  const etablissement = mission.etablissement;
  const missionTitle =
    DISCIPLINE_MISSION_LABELS[mission.discipline] ?? "Mission";
  const isOpportunite = OPPORTUNITE_STATUSES.includes(item.statut);
  const horaires = mission.PlageHoraireMission ?? [];

  const firstSlot = horaires[0];
  const lastSlot = horaires[horaires.length - 1];

  const timeRange =
    firstSlot && lastSlot
      ? `${firstSlot.heureDebut} - ${lastSlot.heureFin}`
      : "-";

  const goToDetails = () => {
    router.push(`/dashboard/renford/missions/${mission.id}`);
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    respondMutation.mutate({
      missionId: mission.id,
      response: "selection_en_cours",
    });
  };

  const handleRefuse = (e: React.MouseEvent) => {
    e.stopPropagation();
    respondMutation.mutate({
      missionId: mission.id,
      response: "refuse_par_renford",
    });
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
            <Avatar
              className={cn("mt-0.5 h-16 w-16 shrink-0 border border-input")}
            >
              <AvatarImage
                src={
                  etablissement?.avatarChemin
                    ? getUrl(etablissement.avatarChemin)
                    : undefined
                }
                alt={etablissement?.nom ?? "Établissement"}
              />
              <AvatarFallback className="text-sm font-medium">
                {getInitials(etablissement?.nom)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-1">
              <p className="text-xl leading-tight font-semibold text-foreground">
                {missionTitle}
              </p>
              {etablissement && (
                <p className="flex items-center gap-1.5 text-base text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {etablissement.adresse}, {etablissement.codePostal}{" "}
                  {etablissement.ville}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Du {formatFrenchDate(mission.dateDebut)} au{" "}
              {formatFrenchDate(mission.dateFin)}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              {timeRange} · {formatDurationHours(mission.totalHours)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-3 md:flex-col md:items-end">
          <MissionRenfordStatusBadge status={item.statut} />

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-lg font-semibold">
                {formatAmount(mission.tarif)}
              </span>
              <span className="text-sm text-muted-foreground">
                {METHODE_TARIFICATION_SUFFIXES[mission.methodeTarification]} HT
              </span>
            </div>

            {isOpportunite ? (
              <div className="hidden items-center gap-2 md:flex">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleRefuse}
                  disabled={respondMutation.isPending}
                >
                  Refuser
                </Button>
                <Button
                  variant="dark"
                  type="button"
                  onClick={handleAccept}
                  disabled={respondMutation.isPending}
                >
                  Accepter
                </Button>
              </div>
            ) : (
              <Button variant="dark" className="hidden md:flex" type="button">
                Détail
              </Button>
            )}
          </div>
        </div>

        {isOpportunite ? (
          <div className="flex w-full items-center gap-2 md:hidden">
            <Button
              variant="outline"
              className="flex-1"
              type="button"
              onClick={handleRefuse}
              disabled={respondMutation.isPending}
            >
              Refuser
            </Button>
            <Button
              variant="dark"
              className="flex-1"
              type="button"
              onClick={handleAccept}
              disabled={respondMutation.isPending}
            >
              Accepter
            </Button>
          </div>
        ) : (
          <Button
            variant="dark"
            className="flex w-full md:hidden"
            type="button"
          >
            Détail
          </Button>
        )}
      </div>
    </article>
  );
}
