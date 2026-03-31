"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Video, CalendarDays, Clock3, Ellipsis, MapPin } from "lucide-react";
import DetailRow from "@/components/common/detail-row";
import DocumentCategoryCard from "@/components/common/document-category-card";
import MissionStatusBadge from "@/components/common/mission-status-badge";
import CenterState from "@/components/common/center-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEtablissementMissionDetails } from "@/hooks/mission";
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
import { STATUT_MISSION_RENFORD_LABELS } from "@/validations/mission-renford";

function formatTimeRange(value: string, fallback = "-") {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return fallback;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export default function EtablissementMissionDetailsPage() {
  const { missionId } = useParams<{ missionId: string }>();

  const missionQuery = useEtablissementMissionDetails(missionId);
  const mission = missionQuery.data;

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

  if (!mission) {
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

  const missionTitle =
    DISCIPLINE_MISSION_LABELS[mission.discipline] ?? "Mission";
  const firstMissionRenford = mission.missionsRenford?.[0];
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
          (materiel) => MATERIELS_MISSION_LABELS[materiel] ?? materiel,
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

  const renfordFullName = firstMissionRenford
    ? [
        firstMissionRenford.profilRenford.utilisateur.prenom,
        firstMissionRenford.profilRenford.utilisateur.nom,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const renfordStatusLabel = firstMissionRenford
    ? STATUT_MISSION_RENFORD_LABELS[firstMissionRenford.statut]
    : "";

  return (
    <main className="mt-8 space-y-6">
      <H2>Détail de la mission</H2>

      <Tabs defaultValue="details" className="w-full">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <TabsList>
            <TabsTrigger value="details" className="px-4">
              Détail
            </TabsTrigger>
            <TabsTrigger value="documents" className="px-4">
              Document & facture
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="px-5">
              Inviter un Renford favori
            </Button>
            <Button variant="outline" className="px-5">
              Annuler et Modifier
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Plus d'actions"
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-secondary-background m-1 min-h-[620px] rounded-3xl border p-4 md:p-6">
          <TabsContent value="details" className="space-y-4">
            {firstMissionRenford ? (
              <div className="rounded-full border border-input bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-12 w-12 border border-input">
                      <AvatarImage
                        src={
                          firstMissionRenford.profilRenford.avatarChemin
                            ? getUrl(
                                firstMissionRenford.profilRenford.avatarChemin,
                              )
                            : undefined
                        }
                        alt={renfordFullName}
                      />
                      <AvatarFallback>
                        {getInitials(renfordFullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-2xl font-semibold text-foreground">
                        {renfordFullName} {renfordStatusLabel}
                      </p>
                      <p className="truncate text-base text-muted-foreground">
                        {firstMissionRenford.profilRenford.titreProfil ||
                          missionTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" className="px-5">
                      <Link
                        href={`/dashboard/etablissement/renfords/${firstMissionRenford.profilRenford.id}`}
                      >
                        Voir le profil
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="px-5"
                      disabled={mission.modeMission === "flex"}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Demander une visio
                    </Button>
                    <Button variant="outline" className="px-5">
                      Refuser
                    </Button>
                    <Button variant="dark" className="px-5">
                      Accepter
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            <section className="rounded-3xl border border-border bg-white px-4 py-4 md:px-5 md:py-5">
              <div className="mb-5 space-y-2">
                <MissionStatusBadge status={mission.statut} />
                <h3 className="text-2xl font-semibold text-foreground">
                  {missionTitle}
                </h3>
                <p className="flex items-center gap-2 text-base text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Du {formatFrenchDate(mission.dateDebut)} au{" "}
                  {formatFrenchDate(mission.dateFin)}
                </p>
              </div>

              <DetailRow
                label="Site d'exécution de la mission"
                value={
                  <div>
                    <p className="font-semibold text-foreground">
                      {mission.etablissement?.nom ?? "-"}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {mission.etablissement
                        ? `${mission.etablissement.adresse}, ${mission.etablissement.codePostal} ${mission.etablissement.ville}`
                        : "-"}
                    </p>
                  </div>
                }
              />

              <DetailRow
                label="Jour & horaires"
                value={
                  <div>
                    {horaires.length > 0 ? (
                      horaires.map((line) => <p key={line}>{line}</p>)
                    ) : (
                      <p>-</p>
                    )}
                    <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <Clock3 className="h-4 w-4" />
                      {formatDurationHours(totalHours)}
                    </p>
                  </div>
                }
              />

              <DetailRow
                label="Niveau d'expérience minimum"
                value={niveauLabel}
              />

              <DetailRow
                label="Matériel nécessaire"
                value={
                  <div>
                    {materiels.map((materiel) => (
                      <p key={materiel}>{materiel}</p>
                    ))}
                  </div>
                }
              />

              <DetailRow
                label="Description de la mission"
                value={mission.description ?? "Aucune description renseignée."}
              />

              <DetailRow
                label="Tarification"
                className="border-b-0"
                value={`${formatAmount(mission.tarif)}${METHODE_TARIFICATION_SUFFIXES[mission.methodeTarification]} HT`}
              />

              <div className="mt-3 border-t border-border/70 pt-4">
                <div className="ml-auto grid w-full max-w-sm gap-2 text-right text-base">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-foreground">
                      Total HT
                    </span>
                    <span className="text-xl font-semibold text-foreground">
                      {formatAmount(totalHt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-muted-foreground">
                    <span>frais de service inclus HT</span>
                    <span>{formatAmount(serviceFees)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-muted-foreground">
                    <span>Total TTC</span>
                    <span>{formatAmount(totalTtc)}</span>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {documentGroups.map((group) => (
              <DocumentCategoryCard
                key={group.title}
                title={group.title}
                documents={group.documents}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
