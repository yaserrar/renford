import { Etablissement } from "@/types/etablissement";
import { MapPin } from "lucide-react";

type SitesTabContentProps = {
  etablissements: Etablissement[];
};

export default function SitesTabContent({
  etablissements,
}: SitesTabContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="h-10 px-4 rounded-full border border-input bg-white text-sm"
        >
          Ajouter un établissement
        </button>
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
          <button
            type="button"
            className="h-10 px-4 rounded-full bg-black text-white text-sm"
          >
            Modifier
          </button>
        </div>
      ))}
    </div>
  );
}
