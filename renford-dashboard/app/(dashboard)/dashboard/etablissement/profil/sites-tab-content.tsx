"use client";

import { Button } from "@/components/ui/button";
import { Etablissement } from "@/types/etablissement";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import SiteFormDialog from "./site-form-dialog";

type SitesTabContentProps = {
  etablissements: Etablissement[];
  defaultSiret?: string;
  defaultTypeEtablissement?: Etablissement["typeEtablissement"] | null;
};

export default function SitesTabContent({
  etablissements,
  defaultSiret,
  defaultTypeEtablissement,
}: SitesTabContentProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);

  const editingSite = useMemo(
    () => etablissements.find((site) => site.id === editingSiteId),
    [editingSiteId, etablissements]
  );

  return (
    <>
      <SiteFormDialog
        open={createOpen}
        setOpen={setCreateOpen}
        mode="create"
        defaultSiret={defaultSiret}
        defaultTypeEtablissement={defaultTypeEtablissement}
      />

      <SiteFormDialog
        open={Boolean(editingSiteId)}
        setOpen={(open) => {
          if (!open) setEditingSiteId(null);
        }}
        mode="edit"
        site={editingSite}
        defaultSiret={defaultSiret}
        defaultTypeEtablissement={defaultTypeEtablissement}
      />

      <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCreateOpen(true)}
        >
          Ajouter un établissement
        </Button>
      </div>

      {etablissements.map((site) => (
        <div
          key={site.id}
          className="bg-white rounded-2xl border border-input p-4 flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-xl font-semibold">{site.nom}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {site.adresse}, {site.codePostal} {site.ville}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setEditingSiteId(site.id)}
          >
            Modifier
          </Button>
        </div>
      ))}

      {etablissements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-input p-6 text-center text-sm text-muted-foreground">
          Aucun établissement ajouté pour le moment.
        </div>
      ) : null}
    </div>
    </>
  );
}
