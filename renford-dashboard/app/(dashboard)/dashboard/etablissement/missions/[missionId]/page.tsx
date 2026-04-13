"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Video,
  CalendarDays,
  Clock3,
  Ellipsis,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import DetailRow from "@/components/common/detail-row";
import DocumentCategoryCard from "@/components/common/document-category-card";
import MissionStatusBadge from "@/components/common/mission-status-badge";
import SignatureContratDialog from "@/components/common/signature-contrat-dialog";
import NoterRenfordDialog from "@/components/common/noter-renford-dialog";
import StarRating from "@/components/common/star-rating";
import InviterFavoriDialog from "@/components/common/inviter-favori-dialog";
import CenterState from "@/components/common/center-state";
import TerminerMissionDialog from "./terminer-mission-dialog";
import CloturerMissionDialog from "./cloturer-mission-dialog";
import AnnulerMissionDialog from "./annuler-mission-dialog";
import ConfirmRenfordResponseDialog from "./confirm-renford-response-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useActivatePendingMissions,
  useCancelMissionByEtablissement,
  useClotureMissionByEtablissement,
  useDownloadMissionDocumentByEtablissement,
  useEtablissementMissionDetails,
  useMarkMissionTermineeByEtablissement,
  useRespondToMissionRenford,
  useSignContractByEtablissement,
  useTriggerManualMissionSearchByEtablissement,
} from "@/hooks/mission";
import { useCreateEvaluation } from "@/hooks/evaluation";
import {
  useCreateCheckoutSession,
  useMissionPaymentStatus,
} from "@/hooks/paiement";
import { STATUT_PAIEMENT_LABELS } from "@/validations/paiement";
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
  SPECIALITES_BY_DISCIPLINE,
} from "@/validations/mission";
import { STATUT_MISSION_RENFORD_LABELS } from "@/validations/mission-renford";
import { PLATFORM_COMMISSION_PERCENT } from "@/lib/env";
import { TYPE_MISSION_LABELS } from "@/validations/profil-renford";

function formatTimeRange(value: string, fallback = "-") {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return fallback;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export default function EtablissementMissionDetailsPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const missionQuery = useEtablissementMissionDetails(missionId);
  const respondMutation = useRespondToMissionRenford();
  const manualSearchMutation = useTriggerManualMissionSearchByEtablissement();
  const activateMutation = useActivatePendingMissions();
  const cancelMutation = useCancelMissionByEtablissement();
  const markTermineeMutation = useMarkMissionTermineeByEtablissement();
  const clotureMutation = useClotureMissionByEtablissement();
  const signMutation = useSignContractByEtablissement();
  const evaluationMutation = useCreateEvaluation();
  const downloadDocumentMutation = useDownloadMissionDocumentByEtablissement();
  const checkoutMutation = useCreateCheckoutSession();
  const paymentStatusQuery = useMissionPaymentStatus(missionId);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [terminerDialogOpen, setTerminerDialogOpen] = useState(false);
  const [cloturerDialogOpen, setCloturerDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [annulerDialogOpen, setAnnulerDialogOpen] = useState(false);
  const [noterDialogOpen, setNoterDialogOpen] = useState(false);
  const [noterMissionRenfordId, setNoterMissionRenfordId] = useState<
    string | null
  >(null);
  const [noterRenfordPrenom, setNoterRenfordPrenom] = useState("");
  const [confirmRenfordDialogOpen, setConfirmRenfordDialogOpen] =
    useState(false);
  const [pendingRenfordAction, setPendingRenfordAction] = useState<{
    missionRenfordId: string;
    response: "attente_de_signature" | "refuse_par_etablissement";
  } | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const mission = missionQuery.data;

  useEffect(() => {
    if (searchParams.get("paiement") === "requis") {
      toast.info(
        "Configurez votre mode de paiement pour activer la recherche de Renfords",
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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
  const missionSubtitle =
    TYPE_MISSION_LABELS[mission.specialitePrincipale] ?? "Mission";

  const prioritizedMissionRenford = (mission.missionsRenford ?? []).find(
    (assignment) =>
      [
        "attente_de_signature",
        "contrat_signe",
        "mission_en_cours",
        "mission_terminee",
      ].includes(assignment.statut),
  );
  const firstMissionRenford =
    prioritizedMissionRenford ?? mission.missionsRenford?.[0];
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
          (materiel) => MATERIELS_MISSION_LABELS[materiel] ?? materiel,
        )
      : ["Aucun matériel requis"];

  const documentDate = formatFrenchDate(mission.dateCreation, "01/01/2025");

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
  const selectionAssignments = (mission.missionsRenford ?? []).filter(
    (assignment) => assignment.statut === "selection_en_cours",
  );
  const activeAssignment = (mission.missionsRenford ?? []).find((assignment) =>
    [
      "attente_de_signature",
      "contrat_signe",
      "mission_en_cours",
      "mission_terminee",
    ].includes(assignment.statut),
  );
  const displayedAssignments =
    mission.modeMission === "coach" && activeAssignment
      ? [activeAssignment]
      : mission.modeMission === "coach" && selectionAssignments.length > 0
        ? selectionAssignments
        : firstMissionRenford
          ? [firstMissionRenford]
          : [];

  const isMissionStarted = [
    "mission_en_cours",
    "remplacement_en_cours",
    "en_litige",
    "mission_terminee",
    "archivee",
  ].includes(mission.statut);

  const canRequestVisio = !isMissionStarted && mission.modeMission !== "flex";
  const canRunManualSearch = mission.statut === "en_recherche";
  const lastSearchMs = mission.dateDerniereRechercheRenford
    ? new Date(mission.dateDerniereRechercheRenford).getTime()
    : null;
  const cooldownRemainingMs = lastSearchMs
    ? Math.max(0, 60_000 - (nowMs - lastSearchMs))
    : 0;
  const cooldownRemainingSeconds = Math.ceil(cooldownRemainingMs / 1000);
  const manualSearchDisabled =
    !canRunManualSearch ||
    manualSearchMutation.isPending ||
    cooldownRemainingMs > 0;
  const isMissionPaid = paymentStatusQuery.data?.paiement?.statut === "libere";
  const canContinuePayment =
    mission.statut === "mission_terminee" &&
    ["en_attente", "echoue"].includes(
      paymentStatusQuery.data?.paiement?.statut ?? "",
    );
  return (
    <main className="mt-8 space-y-6">
      <H2>Détail de la mission</H2>

      {mission.statut === "ajouter_mode_paiement" && (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">
                Mode de paiement requis
              </p>
              <p className="mt-1 text-sm text-amber-700">
                La recherche de Renfords est en pause. Configurez votre mode de
                paiement pour activer cette mission et lancer la recherche.
              </p>
            </div>
          </div>
          <Button
            variant="dark"
            className="shrink-0 px-5"
            disabled={activateMutation.isPending}
            onClick={() => activateMutation.mutate()}
          >
            {activateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activation...
              </>
            ) : (
              "Configurer le paiement"
            )}
          </Button>
        </div>
      )}

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
            {!isMissionStarted &&
              mission.statut !== "ajouter_mode_paiement" && (
                <Button
                  variant="outline"
                  className="px-5"
                  onClick={() => setInviteDialogOpen(true)}
                >
                  Inviter un Renford favori
                </Button>
              )}
            {!isMissionStarted &&
              mission.statut !== "ajouter_mode_paiement" && (
                <Button
                  variant="outline"
                  className="px-5"
                  disabled={cancelMutation.isPending}
                  onClick={() => setAnnulerDialogOpen(true)}
                >
                  Annuler et Modifier
                </Button>
              )}
            {mission.statut === "mission_en_cours" && (
              <Button
                variant="dark"
                className="px-5"
                disabled={markTermineeMutation.isPending}
                onClick={() => setTerminerDialogOpen(true)}
              >
                Terminer la mission
              </Button>
            )}
            {mission.statut === "mission_terminee" && isMissionPaid && (
              <Button
                variant="dark"
                className="px-5"
                disabled={clotureMutation.isPending}
                onClick={() => setCloturerDialogOpen(true)}
              >
                Clôturer la mission
              </Button>
            )}
            {mission.statut === "mission_terminee" &&
              !paymentStatusQuery.data?.hasPaiement && (
                <Button
                  variant="dark"
                  className="px-5"
                  disabled={checkoutMutation.isPending}
                  onClick={() => checkoutMutation.mutate(mission.id)}
                >
                  {checkoutMutation.isPending
                    ? "Redirection..."
                    : "Procéder au paiement"}
                </Button>
              )}
            {canContinuePayment && (
              <Button
                variant="dark"
                className="px-5"
                disabled={checkoutMutation.isPending}
                onClick={() => checkoutMutation.mutate(mission.id)}
              >
                {checkoutMutation.isPending
                  ? "Redirection..."
                  : paymentStatusQuery.data?.paiement?.statut === "echoue"
                    ? "Réessayer le paiement"
                    : "Continuer le paiement"}
              </Button>
            )}
            {paymentStatusQuery.data?.hasPaiement &&
              paymentStatusQuery.data.paiement && (
                <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
                  <span className="text-muted-foreground">Paiement :</span>
                  <span className="font-medium">
                    {
                      STATUT_PAIEMENT_LABELS[
                        paymentStatusQuery.data.paiement.statut
                      ]
                    }
                  </span>
                </div>
              )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  aria-label="Plus d'actions"
                >
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/support?tab=contact")}
                >
                  Signaler un problème
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/dashboard/etablissement/missions/nouvelle")
                  }
                >
                  Dupliquer la demande de mission
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-secondary-background m-1 min-h-[620px] rounded-3xl border p-4 md:p-6">
          <TabsContent value="details" className="space-y-4">
            {displayedAssignments.map((assignment) => {
              const assignmentFullName = [
                assignment.profilRenford.utilisateur.prenom,
                assignment.profilRenford.utilisateur.nom,
              ]
                .filter(Boolean)
                .join(" ");
              const assignmentStatusLabel =
                STATUT_MISSION_RENFORD_LABELS[assignment.statut];

              return (
                <div
                  key={assignment.id}
                  className="rounded-3xl border border-border bg-white px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-12 w-12 border border-input">
                        <AvatarImage
                          src={
                            assignment.profilRenford.avatarChemin
                              ? getUrl(assignment.profilRenford.avatarChemin)
                              : undefined
                          }
                          alt={assignmentFullName}
                        />
                        <AvatarFallback>
                          {getInitials(assignmentFullName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-foreground">
                          {assignmentFullName}
                          {/* {assignmentStatusLabel} */}
                        </p>
                        <p className="truncate text-base text-muted-foreground">
                          {assignment.profilRenford.titreProfil || missionTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" className="px-5">
                        <Link
                          href={`/dashboard/etablissement/renfords/${assignment.profilRenford.id}`}
                        >
                          Voir le profil
                        </Link>
                      </Button>

                      {canRequestVisio && (
                        <Button variant="outline" className="px-5">
                          <Video className="mr-2 h-4 w-4" />
                          Demander une visio
                        </Button>
                      )}

                      {assignment.statut === "selection_en_cours" && (
                        <>
                          <Button
                            variant="outline"
                            className="px-5"
                            disabled={respondMutation.isPending}
                            onClick={() => {
                              setPendingRenfordAction({
                                missionRenfordId: assignment.id,
                                response: "refuse_par_etablissement",
                              });
                              setConfirmRenfordDialogOpen(true);
                            }}
                          >
                            Refuser
                          </Button>

                          <Button
                            variant="dark"
                            className="px-5"
                            disabled={respondMutation.isPending}
                            onClick={() => {
                              setPendingRenfordAction({
                                missionRenfordId: assignment.id,
                                response: "attente_de_signature",
                              });
                              setConfirmRenfordDialogOpen(true);
                            }}
                          >
                            Accepter
                          </Button>
                        </>
                      )}

                      {assignment.statut === "attente_de_signature" && (
                        <Button
                          variant="outline"
                          className="px-5"
                          disabled={respondMutation.isPending}
                          onClick={() => {
                            setPendingRenfordAction({
                              missionRenfordId: assignment.id,
                              response: "refuse_par_etablissement",
                            });
                            setConfirmRenfordDialogOpen(true);
                          }}
                        >
                          Refuser
                        </Button>
                      )}

                      {assignment.statut === "contrat_signe" && (
                        <Button
                          variant="dark"
                          className="px-8"
                          onClick={() => setSignDialogOpen(true)}
                        >
                          Signer le contrat
                        </Button>
                      )}

                      {/* Noter le renford */}
                      {assignment.statut === "mission_terminee" &&
                        (mission.statut === "mission_terminee" ||
                          mission.statut === "archivee") &&
                        !assignment.evaluation && (
                          <Button
                            className="px-5"
                            onClick={() => {
                              setNoterMissionRenfordId(assignment.id);
                              setNoterRenfordPrenom(
                                assignment.profilRenford.utilisateur.prenom,
                              );
                              setNoterDialogOpen(true);
                            }}
                          >
                            Noter {assignment.profilRenford.utilisateur.prenom}
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Évaluation existante */}
                  {assignment.evaluation && (
                    <div className="mt-3 flex items-center gap-3 border-t pt-3">
                      <StarRating
                        rating={assignment.evaluation.note}
                        size={18}
                      />
                      {assignment.evaluation.commentaire && (
                        <p className="text-sm text-muted-foreground">
                          {assignment.evaluation.commentaire}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <section className="rounded-3xl border border-border bg-white px-4 py-4 md:px-5 md:py-5">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <MissionStatusBadge status={mission.statut} />
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
                {canRunManualSearch && (
                  <Button
                    variant="outline"
                    className="px-5"
                    disabled={manualSearchDisabled}
                    onClick={() =>
                      manualSearchMutation.mutate({ missionId: mission.id })
                    }
                  >
                    {manualSearchMutation.isPending
                      ? "Recherche..."
                      : cooldownRemainingMs > 0
                        ? `Nouvelle recherche dans ${cooldownRemainingSeconds}s`
                        : "Relancer la recherche"}
                  </Button>
                )}
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
                  toast.error("En cours de création");
                }}
                //      onDownload={(documentId) => {
                // downloadDocumentMutation.mutate({
                //   missionId: mission.id,
                //   documentType: documentId as
                //     | "facture_prestation"
                //     | "facture_commission"
                //     | "contrat_prestation"
                // });
                isDownloading={downloadDocumentMutation.isPending}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>

      {firstMissionRenford?.statut === "contrat_signe" && (
        <SignatureContratDialog
          open={signDialogOpen}
          onOpenChange={setSignDialogOpen}
          signerRole="etablissement"
          contractData={{
            missionTitle: missionTitle,
            discipline: mission.discipline,
            dateDebut: mission.dateDebut,
            dateFin: mission.dateFin,
            methodeTarification: mission.methodeTarification,
            tarif: mission.tarif,
            totalHours,
            horaires,
            etablissementNom: mission.etablissement?.nom ?? "-",
            etablissementAdresse: mission.etablissement
              ? `${mission.etablissement.adresse}, ${mission.etablissement.codePostal} ${mission.etablissement.ville}`
              : "-",
            renfordNom: renfordFullName,
            description: mission.description,
          }}
          onSign={(signatureImage) => {
            signMutation.mutate(
              {
                missionId: mission.id,
                missionRenfordId: firstMissionRenford.id,
                signatureImage,
              },
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

      {!isMissionStarted && (
        <InviterFavoriDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          missionId={missionId}
        />
      )}

      <TerminerMissionDialog
        open={terminerDialogOpen}
        onOpenChange={setTerminerDialogOpen}
        onConfirm={() => markTermineeMutation.mutate({ missionId: mission.id })}
        isPending={markTermineeMutation.isPending}
      />

      <CloturerMissionDialog
        open={cloturerDialogOpen}
        onOpenChange={setCloturerDialogOpen}
        onConfirm={() => clotureMutation.mutate({ missionId: mission.id })}
        isPending={clotureMutation.isPending}
      />

      <AnnulerMissionDialog
        open={annulerDialogOpen}
        onOpenChange={setAnnulerDialogOpen}
        onConfirm={() => cancelMutation.mutate({ missionId: mission.id })}
        isPending={cancelMutation.isPending}
      />

      <ConfirmRenfordResponseDialog
        open={confirmRenfordDialogOpen && !!pendingRenfordAction}
        onOpenChange={(open) => {
          setConfirmRenfordDialogOpen(open);
          if (!open) {
            setPendingRenfordAction(null);
          }
        }}
        action={pendingRenfordAction?.response ?? "attente_de_signature"}
        onConfirm={() => {
          if (!pendingRenfordAction) return;
          respondMutation.mutate({
            missionId: mission.id,
            missionRenfordId: pendingRenfordAction.missionRenfordId,
            response: pendingRenfordAction.response,
          });
        }}
        isPending={respondMutation.isPending}
      />

      <NoterRenfordDialog
        open={noterDialogOpen}
        onOpenChange={setNoterDialogOpen}
        renfordPrenom={noterRenfordPrenom}
        isPending={evaluationMutation.isPending}
        onSubmit={(data) => {
          if (!noterMissionRenfordId) return;
          evaluationMutation.mutate(
            {
              missionRenfordId: noterMissionRenfordId,
              note: data.note,
              commentaire: data.commentaire,
            },
            { onSuccess: () => setNoterDialogOpen(false) },
          );
        }}
      />
    </main>
  );
}
