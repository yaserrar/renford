"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useAdminAbonnementDetail,
  useAdminCancelAbonnement,
  useAdminPauseAbonnement,
  useAdminResumeAbonnement,
  useAdminUpdateQuota,
} from "@/hooks/abonnement";
import CenterState from "@/components/common/center-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/table/data-table";
import { ArrowLeft, CreditCard } from "lucide-react";
import UserMiniCard from "@/components/common/user-mini-card";
import { formatFrenchDate } from "@/lib/utils";
import type { StatutAbonnement, PlanAbonnement } from "@/types/abonnement";
import { abonnementEventColumns } from "./event-columns";

const STATUT_LABELS: Record<StatutAbonnement, string> = {
  actif: "Actif",
  annule: "Annulé",
  expire: "Expiré",
  en_pause: "En pause",
  en_attente: "En attente",
};

const STATUT_VARIANTS: Record<
  StatutAbonnement,
  "default" | "secondary" | "destructive" | "outline"
> = {
  actif: "default",
  annule: "destructive",
  expire: "secondary",
  en_pause: "outline",
  en_attente: "secondary",
};

const PLAN_LABELS: Record<PlanAbonnement, string> = {
  echauffement: "Échauffement",
  performance: "Performance",
  competition: "Compétition",
};

export default function AdminAbonnementDetailPage() {
  const { abonnementId } = useParams<{ abonnementId: string }>();
  const router = useRouter();
  const { data: abonnement, isLoading } =
    useAdminAbonnementDetail(abonnementId);
  const { mutateAsync: cancel, isPending: isCanceling } =
    useAdminCancelAbonnement(abonnementId);
  const { mutateAsync: pause, isPending: isPausing } =
    useAdminPauseAbonnement(abonnementId);
  const { mutateAsync: resume, isPending: isResuming } =
    useAdminResumeAbonnement(abonnementId);
  const { mutateAsync: updateQuota, isPending: isUpdatingQuota } =
    useAdminUpdateQuota(abonnementId);

  const [quotaInput, setQuotaInput] = useState<string>("");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <CenterState
          title="Chargement"
          description="Récupération des détails de l'abonnement..."
          isLoading
          className="min-h-[400px]"
        />
      </main>
    );
  }

  if (!abonnement) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <CenterState
          title="Abonnement introuvable"
          description="Cet abonnement n'existe pas ou a été supprimé."
          className="min-h-[400px]"
        />
      </main>
    );
  }

  const { utilisateur, etablissements } = abonnement.profilEtablissement;
  const etabNom = etablissements[0]?.nom;
  const isBusy = isCanceling || isPausing || isResuming;

  const handleCancel = async () => {
    await cancel();
  };

  const handlePause = async () => {
    await pause();
  };

  const handleResume = async () => {
    await resume();
  };

  const handleUpdateQuota = async () => {
    const val = parseInt(quotaInput, 10);
    if (Number.isNaN(val) || val < 0) return;
    await updateQuota(val);
    setQuotaInput("");
  };

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            Abonnement — {PLAN_LABELS[abonnement.plan]}
          </h1>
          <Badge variant={STATUT_VARIANTS[abonnement.statut]}>
            {STATUT_LABELS[abonnement.statut]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Left column: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Two info cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Détails de l&apos;abonnement
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Plan</p>
                  <p className="font-semibold uppercase">
                    {PLAN_LABELS[abonnement.plan]}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Statut</p>
                  <Badge variant={STATUT_VARIANTS[abonnement.statut]}>
                    {STATUT_LABELS[abonnement.statut]}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Quota missions</p>
                  <p className="font-medium">
                    {abonnement.quotaMissions === 0
                      ? "Illimité"
                      : `${abonnement.missionsUtilisees} utilisées / ${abonnement.quotaMissions}`}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Prix mensuel HT</p>
                  <p className="font-medium">
                    {Number(abonnement.prixMensuelHT).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date de début</p>
                  <p className="font-medium">
                    {formatFrenchDate(abonnement.dateDebut)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">
                    Prochain renouvellement
                  </p>
                  <p className="font-medium">
                    {abonnement.dateProchainRenouvellement
                      ? formatFrenchDate(abonnement.dateProchainRenouvellement)
                      : "—"}
                  </p>
                </div>
                {abonnement.dateFin && (
                  <div>
                    <p className="text-muted-foreground mb-1">Date de fin</p>
                    <p className="font-medium text-destructive">
                      {formatFrenchDate(abonnement.dateFin)}
                    </p>
                  </div>
                )}
                {abonnement.stripeSubscriptionId && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">
                      ID Stripe Subscription
                    </p>
                    <p className="font-mono text-xs break-all">
                      {abonnement.stripeSubscriptionId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Établissement info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Établissement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <UserMiniCard
                  userId={utilisateur.id}
                  name={etabNom ?? `${utilisateur.prenom} ${utilisateur.nom}`}
                  type="etablissement"
                  avatarPath={abonnement.profilEtablissement.avatarChemin}
                  subtitle={utilisateur.email}
                />

                {abonnement.profilEtablissement.stripeCustomerId && (
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>
                      {" "}
                      Customer:{" "}
                      {abonnement.profilEtablissement.stripeCustomerId}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Events history as DataTable */}
          <DataTable
            columns={abonnementEventColumns}
            data={abonnement.evenements}
            title={`Historique des événements (${abonnement.evenements.length})`}
            description="Audit trail de toutes les actions sur cet abonnement."
            exportFileName={`evenements-abonnement-${abonnementId}`}
            hidePadding
          />
        </div>

        {/* Right column: actions */}
        {/* <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {abonnement.statut === "actif" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePause}
                  disabled={isBusy}
                >
                  Mettre en pause
                </Button>
              )}
              {abonnement.statut === "en_pause" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResume}
                  disabled={isBusy}
                >
                  Reprendre
                </Button>
              )}
              {!["annule", "expire"].includes(abonnement.statut) && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isBusy}
                >
                  Annuler l'abonnement
                </Button>
              )}

              {["annule", "expire"].includes(abonnement.statut) && (
                <p className="text-sm text-muted-foreground text-center">
                  Aucune action disponible pour un abonnement{" "}
                  {STATUT_LABELS[abonnement.statut].toLowerCase()}.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Update quota (manual correction) 
          {abonnement.quotaMissions > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Correction quota</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Actuel : {abonnement.missionsUtilisees} /{" "}
                  {abonnement.quotaMissions}
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="quota-input" className="text-xs">
                    Nouveau nombre utilisé
                  </Label>
                  <Input
                    id="quota-input"
                    type="number"
                    min="0"
                    max={abonnement.quotaMissions}
                    value={quotaInput}
                    onChange={(e) => setQuotaInput(e.target.value)}
                    placeholder={String(abonnement.missionsUtilisees)}
                    className="text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleUpdateQuota}
                  disabled={isUpdatingQuota || !quotaInput}
                >
                  {isUpdatingQuota ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div> */}
      </div>
    </main>
  );
}
