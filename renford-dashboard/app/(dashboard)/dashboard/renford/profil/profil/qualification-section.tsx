"use client";

import { Button } from "@/components/ui/button";
import { formatAmount, getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import { NIVEAU_EXPERIENCE_LABELS } from "@/validations/profil-renford";
import { ExternalLink, FileText, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import QualificationEditDialog from "./qualification-edit-dialog";

type QualificationSectionProps = {
  me: CurrentUser | undefined;
};

export default function QualificationSection({
  me,
}: QualificationSectionProps) {
  const profil = me?.profilRenford;
  const [editOpen, setEditOpen] = useState(false);

  const justificatifName = useMemo(() => {
    if (!profil?.justificatifCarteProfessionnelleChemin) return null;
    return profil.justificatifCarteProfessionnelleChemin.split("/").pop();
  }, [profil?.justificatifCarteProfessionnelleChemin]);

  return (
    <>
      <QualificationEditDialog open={editOpen} setOpen={setEditOpen} me={me} />

      <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Qualifications</h3>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setEditOpen(true)}
          >
            <Pencil />
          </Button>
        </div>

        <div className="rounded-xl border border-input p-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Niveau d&apos;expérience
          </p>
          <p className="font-semibold text-sm">
            {profil?.niveauExperience
              ? NIVEAU_EXPERIENCE_LABELS[profil.niveauExperience]
              : "-"}
          </p>
        </div>

        <div className="rounded-xl border border-input p-4 flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Justificatif carte professionnelle
            </p>
            {profil?.justificatifCarteProfessionnelleChemin ? (
              <a
                href={getUrl(profil.justificatifCarteProfessionnelleChemin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                {justificatifName || "Ouvrir le document"}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-input p-4 space-y-2">
          <p className="text-sm font-semibold">Tarification</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tarif horaire</span>
            <span className="font-medium">
              {formatAmount(profil?.tarifHoraire)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tarif journée</span>
            <span className="font-medium">
              {profil?.proposeJournee
                ? formatAmount(profil?.tarifJournee)
                : "Non proposé"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tarif demi-journée</span>
            <span className="font-medium">
              {profil?.proposeDemiJournee
                ? formatAmount(profil?.tarifDemiJournee)
                : "Non proposé"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
