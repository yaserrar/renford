"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Clock3, Lock, MapPin } from "lucide-react";
import { toast } from "sonner";
import DetailRow from "@/components/common/detail-row";
import DocumentCategoryCard from "@/components/common/document-category-card";
import MissionRenfordStatusBadge from "@/components/common/mission-renford-status-badge";
import SignatureContratDialog from "@/components/common/signature-contrat-dialog";
import CenterState from "@/components/common/center-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDownloadMissionDocumentByRenford,
  useRenfordMissionDetails,
  useRespondToMissionProposal,
  useSignContractByRenford,
} from "@/hooks/mission";
import { formatWeekdayDayMonth } from "@/lib/date";
import {
  formatAmount,
  formatDurationHours,
  formatFrenchDate,
  getInitials,
  getUrl,
  canApplyForMission,
} from "@/lib/utils";
import {
  DISCIPLINE_MISSION_LABELS,
  MATERIELS_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
  NIVEAU_EXPERIENCE_MISSION_LABELS,
} from "@/validations/mission";
import type { StatutMissionRenford } from "@/types/mission-renford";
import { PLATFORM_COMMISSION_PERCENT } from "@/lib/env";
import { TYPE_MISSION_LABELS } from "@/validations/profil-renford";
import { useCurrentUser } from "@/hooks/utilisateur";

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
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const profileComplete = canApplyForMission(currentUser);

  const missionQuery = useRenfordMissionDetails(missionId);
  const respondMutation = useRespondToMissionProposal();
  const signMutation = useSignContractByRenford();
  const downloadDocumentMutation = useDownloadMissionDocumentByRenford();
  const [signDialogOpen, setSignDialogOpen] = useState(false);
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
  const missionSubtitle =
    TYPE_MISSION_LABELS[mission.specialitePrincipale] ?? "Mission";

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

  const totalHt = Number(mission.montantHT ?? 0);
  const fraisHt = Number(mission.montantFraisService ?? 0);
  const tvaFrais = Math.round(fraisHt * 0.2 * 100) / 100;
  const totalTtc = Number(mission.montantTTC ?? 0);

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
  const isOpportunite = OPPORTUNITE_STATUSES.includes(missionRenford.statut);
  const isSignable = SIGNABLE_STATUSES.includes(missionRenford.statut);

  const documentGroups = [
    {
      title: "Factures",
      documents: [
        {
          id: "facture_prestation",
          label: "Facture de la prestation",
          date: documentDate,
        },
        {
          id: "facture_commission",
          label: "Facture des frais de services Renford",
          date: documentDate,
        },
      ],
    },
    {
      title: "Contrat",
      documents: [
        {
          id: "contrat_prestation",
          label: "Contrat de prestation de services",
          date: documentDate,
        },
      ],
    },
  ];

  const etablissementName = etablissement?.nom ?? "-";

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

          {isOpportunite && (
            <div className="flex flex-wrap items-center gap-2">
              {profileComplete ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="dark"
                  className="px-5 w-full md:w-fit"
                  onClick={() => router.push("/dashboard/renford/profil")}
                >
                  <Lock className="h-4 w-4" />
                  Complète ton profil pour accepter
                </Button>
              )}
            </div>
          )}

          {isSignable && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="dark"
                className="px-8"
                onClick={() => setSignDialogOpen(true)}
              >
                Signer le contrat
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary-background m-1 min-h-[620px] rounded-3xl border p-4 md:p-6">
          <TabsContent value="details" className="space-y-4">
            <div className="rounded-full border border-border bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-12 w-12 border border-input">
                    <AvatarImage
                      src={
                        etablissement?.avatarChemin
                          ? getUrl(etablissement.avatarChemin)
                          : undefined
                      }
                      alt={etablissementName}
                    />
                    <AvatarFallback>
                      {getInitials(etablissementName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-foreground">
                      {etablissementName}
                    </p>
                    <p className="truncate text-base text-muted-foreground">
                      {etablissement
                        ? `${etablissement.adresse}, ${etablissement.codePostal} ${etablissement.ville}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-border bg-white px-4 py-4 md:px-5 md:py-5">
              <div className="mb-5">
                <MissionRenfordStatusBadge status={missionRenford.statut} />
                <h3 className="text-2xl font-semibold text-foreground">
                  {missionTitle}
                </h3>
                <h4 className="text-base text-muted-foreground mb-2">
                  {missionSubtitle}
                </h4>
                <p className="flex items-center gap-2 text-base text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {mission.dateFin
                    ? `Du ${formatFrenchDate(mission.dateDebut)} au ${formatFrenchDate(mission.dateFin)}`
                    : `Le ${formatFrenchDate(mission.dateDebut)}`}
                </p>
              </div>

              <DetailRow
                label="Site d'exécution de la mission"
                value={
                  <div>
                    <p className="font-semibold text-foreground">
                      {etablissementName}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {etablissement
                        ? `${etablissement.adresse}, ${etablissement.codePostal} ${etablissement.ville}`
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
                    <span>
                      Frais de service HT ({PLATFORM_COMMISSION_PERCENT}
                      %)
                    </span>
                    <span>{formatAmount(fraisHt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-muted-foreground">
                    <span>TVA sur frais de service (20%)</span>
                    <span>{formatAmount(tvaFrais)}</span>
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
                onDownload={() => {
                  toast.error(
                    "Merci de nous fournir le modèle de ce document au format PDF ou Word.",
                  );
                }}
                //      onDownload={(documentId) => {
                // downloadDocumentMutation.mutate({
                //   missionId: mission.id,
                //   documentType: documentId as
                //     | "facture_prestation"
                //     | "facture_commission"
                //     | "contrat_prestation",
                // });
                isDownloading={downloadDocumentMutation.isPending}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>

      {isSignable && (
        <SignatureContratDialog
          open={signDialogOpen}
          onOpenChange={setSignDialogOpen}
          signerRole="renford"
          contractData={{
            missionTitle: missionTitle,
            discipline: mission.discipline,
            dateDebut: mission.dateDebut,
            dateFin: mission.dateFin,
            methodeTarification: mission.methodeTarification,
            tarif: mission.tarif,
            totalHours,
            horaires,
            etablissementNom: etablissementName,
            etablissementAdresse: etablissement
              ? `${etablissement.adresse}, ${etablissement.codePostal} ${etablissement.ville}`
              : "-",
            renfordNom: "Votre nom",
            description: mission.description,
          }}
          onSign={(signatureImage) => {
            signMutation.mutate(
              { missionId: mission.id, signatureImage },
              {
                onSuccess: () => {
                  setSignDialogOpen(false);
                  toast.success("Contrat signé avec succès");
                },
              },
            );
          }}
          isPending={signMutation.isPending}
        />
      )}
    </main>
  );
}
