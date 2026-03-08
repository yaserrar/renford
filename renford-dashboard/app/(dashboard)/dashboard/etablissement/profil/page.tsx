"use client";

import Loading from "@/components/common/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/utilisateur";
import InformationsTabContent from "./informations-tab-content";
import PasswordTabContent from "./password-tab-content";
import ProfilTabContent from "./profil-tab-content";
import SitesTabContent from "./sites-tab-content";

export default function ProfileEtablissementPage() {
  const { data: me, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loading className="mt-12" />;
  }

  const profil = me?.profilEtablissement ?? null;
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
          <TabsTrigger value="password">Modifier mot de passe</TabsTrigger>
          <TabsTrigger value="sites">Gestion des sites</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <ProfilTabContent profil={profil} />
        </TabsContent>

        <TabsContent value="infos">
          <InformationsTabContent
            profil={profil}
            etablissementPrincipal={etablissementPrincipal}
          />
        </TabsContent>

        <TabsContent value="password">
          <PasswordTabContent />
        </TabsContent>

        <TabsContent value="sites">
          <SitesTabContent etablissements={etablissements} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
