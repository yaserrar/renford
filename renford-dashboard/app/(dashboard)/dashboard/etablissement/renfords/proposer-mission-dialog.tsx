"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SecureAvatarImage } from "@/components/common/secure-file";
import { useGteEtablissementMissionsByTab } from "@/hooks/mission";
import { useProposerMission } from "@/hooks/favoris-renford";
import {
  DISCIPLINE_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
  MODE_MISSION_LABELS,
} from "@/validations/mission";
import {
  formatAmount,
  formatDurationHours,
  formatFrenchDate,
  getInitials,
} from "@/lib/utils";
import { CalendarDays, Check, Clock3, MapPin } from "lucide-react";
import MissionStatusBadge from "@/components/common/mission-status-badge";

type ProposerMissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profilRenfordId: string;
  renfordName: string;
};

export default function ProposerMissionDialog({
  open,
  onOpenChange,
  profilRenfordId,
  renfordName,
}: ProposerMissionDialogProps) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    null,
  );
  const missionsQuery = useGteEtablissementMissionsByTab("en-recherche");
  const proposerMutation = useProposerMission();

  const missions = missionsQuery.data ?? [];

  const handleProposer = () => {
    if (!selectedMissionId) return;
    proposerMutation.mutate(
      { profilRenfordId, missionId: selectedMissionId },
      {
        onSuccess: () => {
          setSelectedMissionId(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-6 py-5 shrink-0">
          <DialogTitle>Proposer une mission</DialogTitle>
          <DialogDescription>
            Sélectionnez une mission à proposer à {renfordName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {missionsQuery.isLoading && (
            <div className="flex h-48 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Chargement des missions...
              </p>
            </div>
          )}

          {!missionsQuery.isLoading && missions.length === 0 && (
            <div className="flex h-48 flex-col items-center justify-center gap-2">
              <p className="text-sm font-medium text-foreground">
                Aucune mission disponible
              </p>
              <p className="text-xs text-muted-foreground">
                Aucune mission en recherche disponible
              </p>
            </div>
          )}

          {missions.map((mission) => {
            const isSelected = selectedMissionId === mission.id;
            const etab = mission.etablissement;

            const horaires = mission.PlageHoraireMission ?? [];
            const computedTotalHours = horaires.reduce((acc, slot) => {
              const [sh, sm] = slot.heureDebut.split(":").map(Number);
              const [eh, em] = slot.heureFin.split(":").map(Number);
              const start = sh * 60 + sm;
              const end = eh * 60 + em;
              if (Number.isNaN(start) || Number.isNaN(end) || end <= start)
                return acc;
              return acc + (end - start) / 60;
            }, 0);
            const totalHours =
              typeof mission.totalHours === "number"
                ? mission.totalHours
                : computedTotalHours;

            return (
              <button
                key={mission.id}
                type="button"
                onClick={() => setSelectedMissionId(mission.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-white hover:border-secondary/45 hover:bg-secondary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11 shrink-0 mt-0.5">
                    <SecureAvatarImage
                      chemin={etab?.avatarChemin}
                      alt={etab?.nom}
                    />
                    <AvatarFallback className="bg-secondary/10 text-secondary-dark text-xs font-medium">
                      {getInitials(etab?.nom)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {DISCIPLINE_MISSION_LABELS[mission.discipline] ??
                            mission.discipline}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {MODE_MISSION_LABELS[mission.modeMission]}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatFrenchDate(mission.dateDebut)} –{" "}
                        {formatFrenchDate(mission.dateFin)}
                      </span>
                      {totalHours > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDurationHours(totalHours)}
                        </span>
                      )}
                      {etab?.ville && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {etab.ville}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <MissionStatusBadge status={mission.statut} />
                      {mission.tarif && (
                        <p className="text-sm font-semibold text-foreground">
                          {formatAmount(mission.tarif)}
                          <span className="text-xs font-normal text-muted-foreground">
                            {" "}
                            {
                              METHODE_TARIFICATION_SUFFIXES[
                                mission.methodeTarification
                              ]
                            }{" "}
                            HT
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={proposerMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="dark"
            onClick={handleProposer}
            disabled={!selectedMissionId || proposerMutation.isPending}
          >
            Proposer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
