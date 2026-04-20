"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminMissionDetail } from "@/hooks/admin";
import CenterState from "@/components/common/center-state";
import MissionStatusBadge from "@/components/common/mission-status-badge";
import MissionRenfordStatusBadge from "@/components/common/mission-renford-status-badge";
import UserMiniCard from "@/components/common/user-mini-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SecureAvatarImage } from "@/components/common/secure-file";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";
import { formatDate } from "@/lib/date";
import { getInitials } from "@/lib/utils";
import {
  DISCIPLINE_MISSION_LABELS,
  MODE_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
  STATUT_MISSION_LABELS,
} from "@/validations/mission";
import { TYPE_MISSION_LABELS } from "@/validations/profil-renford";
import type { AdminMissionRenford } from "@/types/admin";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STATUT_MISSION_RENFORD_LABELS } from "@/validations/mission-renford";

function formatTimeRange(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "-";
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export default function AdminMissionDetailPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const router = useRouter();
  const { data: mission, isLoading } = useAdminMissionDetail(missionId);
  const [selectedCandidature, setSelectedCandidature] =
    useState<AdminMissionRenford | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <CenterState
          title="Chargement"
          description="Récupération des détails de la mission..."
          isLoading
          className="min-h-[400px]"
        />
      </main>
    );
  }

  if (!mission) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <CenterState
          title="Mission introuvable"
          description="Cette mission n'existe pas ou a été supprimée."
          className="min-h-[400px]"
        />
      </main>
    );
  }

  const tariffSuffix =
    METHODE_TARIFICATION_SUFFIXES[mission.methodeTarification];

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/missions")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">
                {DISCIPLINE_MISSION_LABELS[mission.discipline]}
              </h1>
              <MissionStatusBadge status={mission.statut} />
              <Badge variant="outline" className="capitalize">
                {MODE_MISSION_LABELS[mission.modeMission]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Créée le {formatDate(mission.dateCreation)}
            </p>
          </div>
        </div>

        {/* Grid: Info + Établissement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                label="Spécialité principale"
                value={TYPE_MISSION_LABELS[mission.specialitePrincipale]}
              />
              {mission.specialitesSecondaires.length > 0 && (
                <InfoRow
                  label="Spécialités secondaires"
                  value={mission.specialitesSecondaires
                    .map((s) => TYPE_MISSION_LABELS[s])
                    .join(", ")}
                />
              )}
              <InfoRow
                label="Date de début"
                value={formatDate(mission.dateDebut)}
              />
              {mission.dateFin && (
                <InfoRow
                  label="Date de fin"
                  value={formatDate(mission.dateFin)}
                />
              )}
              {mission.tarif && (
                <InfoRow
                  label="Tarif"
                  value={`${Number(mission.tarif).toFixed(2)} €${tariffSuffix}`}
                />
              )}
              {mission.montantHT && (
                <InfoRow
                  label="Montant HT"
                  value={`${Number(mission.montantHT).toFixed(2)} €`}
                />
              )}
              {mission.montantTTC && (
                <InfoRow
                  label="Montant TTC"
                  value={`${Number(mission.montantTTC).toFixed(2)} €`}
                />
              )}
              {mission.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {mission.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Établissement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Établissement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {mission.etablissement.profilEtablissement?.utilisateurId ? (
                  <UserMiniCard
                    userId={
                      mission.etablissement.profilEtablissement.utilisateurId
                    }
                    name={mission.etablissement.nom}
                    type="etablissement"
                    avatarPath={
                      mission.etablissement.profilEtablissement.avatarChemin
                    }
                    subtitle={
                      mission.etablissement.profilEtablissement.raisonSociale
                    }
                  />
                ) : (
                  <>
                    <Avatar className="h-12 w-12">
                      <SecureAvatarImage
                        chemin={
                          mission.etablissement.profilEtablissement
                            ?.avatarChemin
                        }
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {mission.etablissement.nom}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    {mission.etablissement.adresse},{" "}
                    {mission.etablissement.codePostal}{" "}
                    {mission.etablissement.ville}
                  </span>
                </div>
                {mission.etablissement.emailPrincipal && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{mission.etablissement.emailPrincipal}</span>
                  </div>
                )}
                {mission.etablissement.telephonePrincipal && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{mission.etablissement.telephonePrincipal}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planning */}
        {mission.PlageHoraireMission.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mission.PlageHoraireMission.map((plage) => (
                  <div
                    key={plage.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{formatDate(plage.date)}</p>
                      <p className="text-muted-foreground">
                        <Clock3 className="inline h-3 w-3 mr-1" />
                        {formatTimeRange(plage.heureDebut)} -{" "}
                        {formatTimeRange(plage.heureFin)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidatures */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Candidatures ({mission.missionsRenford.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mission.missionsRenford.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aucune candidature pour cette mission.
              </p>
            ) : (
              <div className="divide-y">
                {mission.missionsRenford.map((mr) => {
                  const renford = mr.profilRenford;
                  const user = renford.utilisateur;
                  const fullName =
                    `${user.prenom} ${user.nom}`.trim() || "Renford";
                  return (
                    <button
                      key={mr.id}
                      type="button"
                      onClick={() => setSelectedCandidature(mr)}
                      className="w-full flex items-center gap-4 py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Avatar className="h-10 w-10">
                        <SecureAvatarImage chemin={renford.avatarChemin} />
                        <AvatarFallback className="bg-secondary-background text-secondary text-sm">
                          {getInitials(fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{fullName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {renford.titreProfil || user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {renford.noteMoyenne !== null && (
                          <div className="flex items-center gap-1 text-sm text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{renford.noteMoyenne.toFixed(1)}</span>
                          </div>
                        )}
                        <MissionRenfordStatusBadge status={mr.statut} />
                        <a
                          href={`/admin/utilisateurs/${user.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Voir le profil"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Candidature detail dialog */}
      <CandidatureDetailDialog
        candidature={selectedCandidature}
        onClose={() => setSelectedCandidature(null)}
      />
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <p className="text-sm text-muted-foreground shrink-0">{label}</p>
      <p className="text-sm font-medium text-right">{value}</p>
    </div>
  );
}

function CandidatureDetailDialog({
  candidature,
  onClose,
}: {
  candidature: AdminMissionRenford | null;
  onClose: () => void;
}) {
  if (!candidature) return null;

  const renford = candidature.profilRenford;
  const user = renford.utilisateur;
  const fullName = `${user.prenom} ${user.nom}`.trim() || "Renford";

  return (
    <Dialog open={!!candidature} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de la candidature</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Renford profile */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <SecureAvatarImage chemin={renford.avatarChemin} />
              <AvatarFallback className="bg-secondary-background text-secondary">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg">{fullName}</p>
              {renford.titreProfil && (
                <p className="text-sm text-muted-foreground">
                  {renford.titreProfil}
                </p>
              )}
            </div>
            <a
              href={`/admin/utilisateurs/${user.id}`}
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
              title="Voir le profil utilisateur"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Contact info */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.telephone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.telephone}</span>
              </div>
            )}
            {renford.noteMoyenne !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>{renford.noteMoyenne.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Candidature status */}
          <div className="space-y-3 rounded-lg border p-4">
            <h4 className="font-medium text-sm">Informations candidature</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Statut</p>
                <MissionRenfordStatusBadge
                  status={candidature.statut}
                  className="mt-1"
                />
              </div>
              <div>
                <p className="text-muted-foreground">Date de proposition</p>
                <p className="font-medium mt-1">
                  {formatDate(candidature.dateProposition)}
                </p>
              </div>
              {candidature.dateReponse && (
                <div>
                  <p className="text-muted-foreground">Date de réponse</p>
                  <p className="font-medium mt-1">
                    {formatDate(candidature.dateReponse)}
                  </p>
                </div>
              )}
              {candidature.dateContratSigne && (
                <div>
                  <p className="text-muted-foreground">Contrat signé le</p>
                  <p className="font-medium mt-1">
                    {formatDate(candidature.dateContratSigne)}
                  </p>
                </div>
              )}
              {candidature.tarifNegocie && (
                <div>
                  <p className="text-muted-foreground">Tarif négocié</p>
                  <p className="font-medium mt-1">
                    {Number(candidature.tarifNegocie).toFixed(2)} €
                  </p>
                </div>
              )}
              {candidature.ordreShortlist !== null && (
                <div>
                  <p className="text-muted-foreground">Position shortlist</p>
                  <p className="font-medium mt-1">
                    #{candidature.ordreShortlist}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation */}
          {candidature.evaluation && (
            <div className="space-y-2 rounded-lg border p-4">
              <h4 className="font-medium text-sm">Évaluation</h4>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < candidature.evaluation!.note
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm font-medium ml-1">
                  {candidature.evaluation.note}/5
                </span>
              </div>
              {candidature.evaluation.commentaire && (
                <p className="text-sm text-muted-foreground">
                  {candidature.evaluation.commentaire}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
