import { Button } from "@/components/ui/button";
import { formatAmount, formatFrenchDate } from "@/lib/utils";
import { MissionEtablissement } from "@/types/mission";
import {
  DISCIPLINE_MISSION_OPTIONS,
  getSpecialitesOptionsByDiscipline,
  MATERIELS_MISSION_OPTIONS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import { Clock3, Copy, List, MapPin } from "lucide-react";

type MissionHistoryCardProps = {
  mission: MissionEtablissement;
  onDuplicate: (mission: MissionEtablissement) => void;
};

function normalizeDate(value: unknown): Date | undefined {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return undefined;
}

export default function MissionHistoryCard({
  mission,
  onDuplicate,
}: MissionHistoryCardProps) {
  const disciplineLabel =
    DISCIPLINE_MISSION_OPTIONS.find(
      (option) => option.value === mission.discipline,
    )?.label ?? mission.discipline;

  const specialiteLabel =
    getSpecialitesOptionsByDiscipline(mission.discipline).find(
      (option) => option.value === mission.specialitePrincipale,
    )?.label ?? mission.specialitePrincipale;

  const missionTarif =
    typeof mission.tarif === "number"
      ? mission.tarif
      : typeof mission.tarif === "string"
        ? Number(mission.tarif)
        : 0;

  const sortedPlages = [...(mission.PlageHoraireMission ?? [])].sort((a, b) => {
    const dateDiff =
      (normalizeDate(a.date)?.getTime() ?? 0) -
      (normalizeDate(b.date)?.getTime() ?? 0);
    if (dateDiff !== 0) {
      return dateDiff;
    }
    return a.heureDebut.localeCompare(b.heureDebut);
  });

  const materielsLabels = (mission.materielsRequis ?? [])
    .map(
      (materiel) =>
        MATERIELS_MISSION_OPTIONS.find((option) => option.value === materiel)
          ?.label ?? materiel,
    )
    .slice(0, 3);

  return (
    <article className="rounded-3xl border border-input bg-white p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-lg leading-tight font-semibold text-foreground">
            {specialiteLabel}
          </h4>
          <p className="mt-1 text-base text-muted-foreground">
            {disciplineLabel}
          </p>
        </div>

        <p className="shrink-0 text-xl font-semibold">
          {formatAmount(Number.isFinite(missionTarif) ? missionTarif : 0)}
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            {METHODE_TARIFICATION_SUFFIXES[mission.methodeTarification]} HT
          </span>
        </p>
      </div>

      {mission.etablissement ? (
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>{mission.etablissement.nom}</strong>
            {` - ${mission.etablissement.adresse}, ${mission.etablissement.codePostal} ${mission.etablissement.ville}`}
          </span>
        </p>
      ) : null}

      {sortedPlages.length > 0 ? (
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          {sortedPlages.slice(0, 2).map((slot, index) => (
            <p
              key={`${mission.id}-${slot.id}-${index}`}
              className="flex items-center gap-2"
            >
              <Clock3 className="h-4 w-4" />
              <span>
                {formatFrenchDate(normalizeDate(slot.date))} {slot.heureDebut} -{" "}
                {slot.heureFin}
              </span>
            </p>
          ))}
        </div>
      ) : null}

      {materielsLabels.length > 0 ? (
        <div className="flex items-start gap-2 pt-2">
          <List className="h-4 w-4 text-black" />
          <div className="text-sm text-muted-foreground">
            {materielsLabels.map((label) => (
              <p key={`${mission.id}-${label}`}>• {label}</p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="outline-secondary"
          className="h-10 px-5"
          onClick={() => onDuplicate(mission)}
        >
          <Copy className="h-4 w-4" />
          Dupliquer
        </Button>
      </div>
    </article>
  );
}
