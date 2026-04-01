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
import { useGteEtablissementMissionsByTab } from "@/hooks/mission";
import { useProposerMission } from "@/hooks/favoris-renford";
import { DISCIPLINE_MISSION_LABELS } from "@/validations/mission";
import { formatFrenchDate } from "@/lib/utils";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Proposer une mission</DialogTitle>
          <DialogDescription>
            Sélectionnez une mission à proposer à {renfordName}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-72 space-y-2 overflow-y-auto py-2">
          {missionsQuery.isLoading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Chargement des missions...
            </p>
          )}

          {!missionsQuery.isLoading && missions.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune mission en recherche disponible
            </p>
          )}

          {missions.map((mission) => (
            <button
              key={mission.id}
              type="button"
              onClick={() => setSelectedMissionId(mission.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                selectedMissionId === mission.id
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-muted/50"
              }`}
            >
              <p className="font-medium text-foreground">
                {DISCIPLINE_MISSION_LABELS[mission.discipline] ??
                  mission.discipline}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Du {formatFrenchDate(mission.dateDebut)} au{" "}
                {formatFrenchDate(mission.dateFin)}
              </p>
            </button>
          ))}
        </div>

        <DialogFooter>
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
