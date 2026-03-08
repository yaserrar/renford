"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/utilisateur";
import { getUrl } from "@/lib/utils";
import { Loader2, MapPin } from "lucide-react";

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4 border-t border-input text-sm">
    <p className="font-medium text-black">{label}</p>
    <p className="md:col-span-2 text-black whitespace-pre-wrap">
      {value || "-"}
    </p>
  </div>
);

export default function ProfileEtablissementPage() {
  const { data: me, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-64 mt-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profil = me?.profilEtablissement;
  const etablissements = profil?.etablissements ?? [];
  const etablissementPrincipal =
    etablissements.find((site) => site.roleEtablissement === "principal") ??
    etablissements[0];

  return (
    <main className="container mx-auto mt-8 space-y-4">
      <h1 className="text-3xl font-semibold">Mon compte</h1>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
          <TabsTrigger value="sites">Gestion des sites</TabsTrigger>
        </TabsList>

        <TabsContent
          value="profil"
          className="bg-white rounded-2xl border border-input overflow-hidden"
        >
          <div className="h-52 w-full bg-gray-100 overflow-hidden">
            {profil?.imageCouvertureChemin ? (
              <img
                src={getUrl(profil.imageCouvertureChemin)}
                alt="Couverture établissement"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="p-6 border-b border-input flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden">
              {profil?.avatarChemin ? (
                <img
                  src={getUrl(profil.avatarChemin)}
                  alt={profil.raisonSociale}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <p className="text-2xl font-semibold">
              {profil?.raisonSociale || "-"}
            </p>
          </div>

          <div className="p-6">
            <Row
              label="Type d’établissement"
              value={profil?.typeEtablissement?.replaceAll("_", " ") || "-"}
            />
            <Row label="Activités proposés" value="-" />
            <Row label="A propos" value={profil?.aPropos || "-"} />
          </div>
        </TabsContent>

        <TabsContent
          value="infos"
          className="bg-white rounded-2xl border border-input p-6"
        >
          <Row label="Raison Sociale" value={profil?.raisonSociale || "-"} />
          <Row label="Numéro Siret" value={profil?.siret || "-"} />
          <Row
            label="Adresse de l’établissement principal"
            value={profil?.adresse || "-"}
          />
          <Row
            label="Type d’établissement"
            value={profil?.typeEtablissement?.replaceAll("_", " ") || "-"}
          />
          <Row
            label="Contact principal"
            value={
              [
                etablissementPrincipal?.prenomContactPrincipal,
                etablissementPrincipal?.nomContactPrincipal,
              ]
                .filter(Boolean)
                .join(" ") || "-"
            }
          />
          <Row
            label="Téléphone"
            value={etablissementPrincipal?.telephonePrincipal || "-"}
          />
          <Row
            label="Email"
            value={etablissementPrincipal?.emailPrincipal || "-"}
          />
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </main>
  );
}
