"use client";

import { useParams } from "next/navigation";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import DocumentCategoryCard from "@/components/common/document-category-card";
import MissionRenfordStatusBadge from "@/components/common/mission-renford-status-badge";
import CenterState from "@/components/common/center-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import {
  useRenfordMissionDetails,
  useRespondToMissionProposal,
} from "@/hooks/mission";
import { formatWeekdayDayMonth } from "@/lib/date";
import {
  formatAmount,
  formatDurationHours,
  formatFrenchDate,
  getInitials,
  getUrl,
} from "@/lib/utils";
import {
  DISCIPLINE_MISSION_LABELS,
  MATERIELS_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
  NIVEAU_EXPERIENCE_MISSION_LABELS,
} from "@/validations/mission";
import type { StatutMissionRenford } from "@/types/mission-renford";

function formatTimeRange(value: string, fallback = "-") {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return fallback;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

const SIGNABLE_STATUSES: StatutMissionRenford[] = ["attente_de_signature"];
const OPPORTUNITE_STATUSES: StatutMissionRenford[] = ["nouveau", "vu"];

export default function RenfordMissionDetailsPage() {
  const { missionId } = useParams<{ missionId: string }>();

  const missionQuery = useRenfordMissionDetails(missionId);
  const respondMutation = useRespondToMissionProposal();
  const missionRenford = missionQuery.data;

  const isLoading = missionQuery.isLoading;
  const isError = missionQuery.isError;

  if (isLoading) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Détail de la mission</H2>
        <CenterState
          title="Chargement de la mission"
          description="Nous récupérons les détails de cette mission."
          isLoading
        />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Détail de la mission</H2>
        <CenterState
          title="Impossible de charger cette mission"
          description="Réessayez dans quelques instants ou actualisez la page."
        />
      </main>
    );
  }

  if (!missionRenford) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Détail de la mission</H2>
        <CenterState
          title="Mission introuvable"
          description="Cette mission n'existe pas ou n'est plus accessible."
        />
      </main>
    );
  }

  const mission = missionRenford.mission;
  const etablissement = mission.etablissement;
  const missionTitle =
    DISCIPLINE_MISSION_LABELS[mission.discipline] ?? "Mission";

  const totalHours =
    typeof mission.totalHours === "number" && mission.totalHours > 0
      ? mission.totalHours
      : (mission.PlageHoraireMission ?? []).reduce((acc, slot) => {
          const [startHour, startMinute] = slot.heureDebut
            .split(":")
            .map(Number);
          const [endHour, endMinute] = slot.heureFin.split(":").map(Number);

          if (
            Number.isNaN(startHour) ||
            Number.isNaN(startMinute) ||
            Number.isNaN(endHour) ||
            Number.isNaN(endMinute)
          ) {
            return acc;
          }

          const start = startHour * 60 + startMinute;
          const end = endHour * 60 + endMinute;

          if (end <= start) return acc;
          return acc + (end - start) / 60;
        }, 0);

  const tarifNumeric =
    typeof mission.tarif === "string" ? Number(mission.tarif) : mission.tarif;
  const hasHourlyRate =
    mission.methodeTarification === "horaire" && Number.isFinite(tarifNumeric);

  const totalHt =
    hasHourlyRate && totalHours > 0
      ? (tarifNumeric as number) * totalHours
      : (tarifNumeric ?? 0);
  const serviceFees = totalHt * 0.03;
  const totalTtc = totalHt + serviceFees;

  const horaires = (mission.PlageHoraireMission ?? []).map((slot) => {
    const weekdayDate = formatWeekdayDayMonth(slot.date);

    return `${weekdayDate} - ${formatTimeRange(slot.heureDebut)} à ${formatTimeRange(slot.heureFin)}`;
  });

  const niveauLabel =
    mission.niveauExperienceRequis &&
    NIVEAU_EXPERIENCE_MISSION_LABELS[mission.niveauExperienceRequis]
      ? NIVEAU_EXPERIENCE_MISSION_LABELS[mission.niveauExperienceRequis]
      : "-";

  const materiels =
    mission.materielsRequis.length > 0
      ? mission.materielsRequis.map(
          (materiel) =>
            MATERIELS_MISSION_LABELS[
              materiel as keyof typeof MATERIELS_MISSION_LABELS
            ] ?? materiel,
        )
      : ["Aucun matériel requis"];

  const documentDate = formatFrenchDate(mission.dateCreation, "01/01/2025");

  const documentGroups = [
    {
      title: "Factures",
      documents: [
        {
          id: "invoice-service",
          label: "Facture de la prestation",
          date: documentDate,
        },
        {
          id: "invoice-platform",
          label: "Facture des frais de services Renford",
          date: documentDate,
        },
      ],
    },
    {
      title: "Contrat",
      documents: [
        {
          id: "contract-service",
          label: "Contrat de prestation de services",
          date: documentDate,
        },
        {
          id: "contract-certificate",
          label: "Attestation de mission",
          date: documentDate,
        },
      ],
    },
  ];

  const isOpportunite = OPPORTUNITE_STATUSES.includes(missionRenford.statut);
  const isSignable = SIGNABLE_STATUSES.includes(missionRenford.statut);

  return (
    <main className="mt-8 space-y-6">
      <H2>Détail de la mission</H2>

      <div className="bg-secondary-background rounded-3xl border m-1 p-6 h-full">
        <div className="space-y-6">
          <section className="rounded-3xl border border-input bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3">
                <MissionRenfordStatusBadge status={missionRenford.statut} />
                <h3 className="text-2xl font-semibold text-foreground">
                  {missionTitle}
                </h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Du {formatFrenchDate(mission.dateDebut)} au{" "}
                  {formatFrenchDate(mission.dateFin)}
                </p>
              </div>

              {isOpportunite && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="px-5"
                    onClick={() =>
                      respondMutation.mutate({
                        missionId: mission.id,
                        response: "refuse_par_renford",
                      })
                    }
                    disabled={respondMutation.isPending}
                  >
                    Refuser
                  </Button>
                  <Button
                    variant="dark"
                    className="px-5"
                    onClick={() =>
                      respondMutation.mutate({
                        missionId: mission.id,
                        response: "selection_en_cours",
                      })
                    }
                    disabled={respondMutation.isPending}
                  >
                    Accepter
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-input pt-6">
              <Avatar className="h-12 w-12 border border-input">
                <AvatarImage
                  src={
                    etablissement?.avatarChemin
                      ? getUrl(etablissement.avatarChemin)
                      : undefined
                  }
                  alt={etablissement?.nom ?? "Établissement"}
                />
                <AvatarFallback>
                  {getInitials(etablissement?.nom)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {etablissement?.nom ?? "-"}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {etablissement
                    ? `${etablissement.adresse}, ${etablissement.codePostal} ${etablissement.ville}`
                    : "-"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Jour & horaires
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              {horaires.length > 0 ? (
                horaires.map((line) => (
                  <p key={line} className="text-foreground">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">-</p>
              )}
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                {formatDurationHours(totalHours)}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">Détails</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">
                  Niveau d&apos;expérience minimum
                </span>
                <span className="font-medium text-foreground">
                  {niveauLabel}
                </span>
              </div>
              <div className="rounded-2xl border border-input p-4">
                <p className="text-muted-foreground">Matériel nécessaire</p>
                <div className="mt-1">
                  {materiels.map((materiel) => (
                    <p key={materiel} className="font-medium text-foreground">
                      {materiel}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Description
            </h3>
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {mission.description ?? "Aucune description renseignée."}
            </p>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Tarification
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">Tarif</span>
                <span className="font-medium text-foreground">
                  {formatAmount(mission.tarif)}
                  {
                    METHODE_TARIFICATION_SUFFIXES[mission.methodeTarification]
                  }{" "}
                  HT
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">Total HT</span>
                <span className="text-xl font-semibold text-foreground">
                  {formatAmount(totalHt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">
                  Frais de service inclus HT
                </span>
                <span className="font-medium text-foreground">
                  {formatAmount(serviceFees)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">Total TTC</span>
                <span className="font-medium text-foreground">
                  {formatAmount(totalTtc)}
                </span>
              </div>

              {isSignable && (
                <div className="mt-3 flex justify-end">
                  <Button variant="dark" className="px-8">
                    Signer le contrat
                  </Button>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Documents & Factures
            </h3>
            <div className="mt-4 space-y-4">
              {documentGroups.map((group) => (
                <DocumentCategoryCard
                  key={group.title}
                  title={group.title}
                  documents={group.documents}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
