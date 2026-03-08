"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrentUser } from "@/types/utilisateur";
import { TYPE_MISSION_LABELS } from "@/validations/profil-renford";
import { Pencil } from "lucide-react";
import { useState } from "react";
import ProfilInfosEditDialog from "./profil-infos-edit-dialog";

type ExpertisesSectionProps = {
  me: CurrentUser | undefined;
};

export default function ExpertisesSection({ me }: ExpertisesSectionProps) {
  const profil = me?.profilRenford;
  const [infosDialogOpen, setInfosDialogOpen] = useState(false);

  const missionLabels = (profil?.typeMission ?? []).map(
    (mission) => TYPE_MISSION_LABELS[mission]
  );

  return (
    <>
      <ProfilInfosEditDialog
        open={infosDialogOpen}
        setOpen={setInfosDialogOpen}
        me={me}
      />

      <div className="bg-white rounded-3xl border border-input p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Expertises</h3>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setInfosDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {missionLabels.length ? (
            missionLabels.map((label) => <Badge key={label}>{label}</Badge>)
          ) : (
            <p className="text-sm text-muted-foreground">-</p>
          )}
        </div>
      </div>
    </>
  );
}
