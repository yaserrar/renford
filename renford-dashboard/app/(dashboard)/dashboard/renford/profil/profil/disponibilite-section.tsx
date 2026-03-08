"use client";

import { Button } from "@/components/ui/button";
import { CurrentUser } from "@/types/utilisateur";
import {
  CRENEAUX_DISPONIBILITE,
  CRENEAUX_DISPONIBILITE_LABELS,
  JOUR_SEMAINE,
  JOUR_SEMAINE_LABELS,
} from "@/validations/profil-renford";
import { Pencil } from "lucide-react";
import { useState } from "react";
import DisponibiliteEditDialog from "./disponibilite-edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";

type DisponibiliteSectionProps = {
  me: CurrentUser | undefined;
};

export default function DisponibiliteSection({
  me,
}: DisponibiliteSectionProps) {
  const profil = me?.profilRenford;
  const [open, setOpen] = useState(false);

  const formatDate = (value: Date | string | null | undefined) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("fr-FR");
  };

  const disponibilites = {
    lundi: profil?.disponibilitesLundi ?? [],
    mardi: profil?.disponibilitesMardi ?? [],
    mercredi: profil?.disponibilitesMercredi ?? [],
    jeudi: profil?.disponibilitesJeudi ?? [],
    vendredi: profil?.disponibilitesVendredi ?? [],
    samedi: profil?.disponibilitesSamedi ?? [],
    dimanche: profil?.disponibilitesDimanche ?? [],
  } as const;

  return (
    <>
      <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
        <DisponibiliteEditDialog open={open} setOpen={setOpen} me={me} />
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Disponibilités</h3>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-xl border border-input p-4 text-sm flex items-center justify-between">
          <p className="text-muted-foreground">Mobilité</p>
          <p className="font-semibold">{profil?.zoneDeplacement ?? 0} km</p>
        </div>

        <p className="font-medium">Semaine type</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2"></th>
                {CRENEAUX_DISPONIBILITE.map((creneau) => (
                  <th key={creneau} className="text-center py-2 font-medium">
                    {CRENEAUX_DISPONIBILITE_LABELS[creneau]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {JOUR_SEMAINE.map((jour) => (
                <tr key={jour} className="">
                  <td className="py-2 font-medium">
                    {JOUR_SEMAINE_LABELS[jour]}
                  </td>
                  {CRENEAUX_DISPONIBILITE.map((creneau) => (
                    <td key={creneau} className="text-center py-2">
                      <Checkbox
                        checked={disponibilites[jour].includes(creneau)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-input p-4 space-y-2">
          {profil?.dureeIllimitee ? (
            <p className="text-sm font-medium">
              Je suis disponible pour une durée illimitée
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">À partir de</span>
                <span className="font-medium">
                  {formatDate(profil?.dateDebut)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Jusqu&apos;au</span>
                <span className="font-medium">
                  {formatDate(profil?.dateFin)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
