"use client";

import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import { DIPLOME_LABELS } from "@/validations/profil-renford";
import { Award, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DiplomesEditDialog from "./diplomes-edit-dialog";

type CertificationsSectionProps = {
  me: CurrentUser | undefined;
};

export default function CertificationsSection({
  me,
}: CertificationsSectionProps) {
  const profil = me?.profilRenford;
  const [editOpen, setEditOpen] = useState(false);

  const diplomes = profil?.renfordDiplomes ?? [];

  return (
    <>
      <DiplomesEditDialog open={editOpen} setOpen={setEditOpen} me={me} />

      <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            Certifications & Formations
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

        {diplomes.length ? (
          <div className="space-y-3">
            {diplomes.map((diplome) => (
              <a
                key={diplome.id}
                href={
                  diplome.justificatifDiplomeChemin
                    ? getUrl(diplome.justificatifDiplomeChemin)
                    : undefined
                }
                target={
                  diplome.justificatifDiplomeChemin ? "_blank" : undefined
                }
                rel={
                  diplome.justificatifDiplomeChemin
                    ? "noopener noreferrer"
                    : undefined
                }
                className="rounded-2xl border border-input p-4 flex items-center justify-between gap-3"
                aria-disabled={!diplome.justificatifDiplomeChemin}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {DIPLOME_LABELS[diplome.typeDiplome]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {diplome.anneeObtention
                        ? `Obtenu en ${diplome.anneeObtention}`
                        : "Année non renseignée"}
                    </p>
                  </div>
                </div>

                <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">-</p>
        )}
      </div>
    </>
  );
}
