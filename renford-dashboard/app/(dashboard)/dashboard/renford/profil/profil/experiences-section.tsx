"use client";

import { CurrentUser } from "@/types/utilisateur";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ExperiencesEditDialog from "./experiences-edit-dialog";
import { formatYear } from "@/lib/utils";

type ExperiencesSectionProps = {
  me: CurrentUser | undefined;
};

export default function ExperiencesSection({ me }: ExperiencesSectionProps) {
  const profil = me?.profilRenford;
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <ExperiencesEditDialog open={editOpen} setOpen={setEditOpen} me={me} />

      <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Expériences Professionnelles
          </h3>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setEditOpen(true)}
          >
            <Pencil />
          </Button>
        </div>

        {(profil?.experiencesProfessionnelles ?? []).length ? (
          <div className="space-y-3">
            {profil?.experiencesProfessionnelles.map((experience) => (
              <div
                key={experience.id}
                className="rounded-xl border border-input p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-base">{experience.nom}</p>
                  <p className="text-xs font-medium text-secondary whitespace-nowrap">
                    {formatYear(experience.dateDebut)} -{" "}
                    {formatYear(experience.dateFin) !== "-"
                      ? formatYear(experience.dateFin)
                      : "Présent"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-muted-foreground mt-1">
                  {experience.etablissement}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {experience.missions}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">-</p>
        )}
      </div>
    </>
  );
}
