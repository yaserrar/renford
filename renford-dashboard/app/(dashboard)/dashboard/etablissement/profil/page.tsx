"use client";

import Loading from "@/components/common/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/utilisateur";
import InformationsTabContent from "./informations-tab-content";
import ProfilTabContent from "./profil-tab-content";
import SitesTabContent from "./sites-tab-content";
import { H2 } from "@/components/ui/typography";

export default function ProfileEtablissementPage() {
  const { data: me, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loading className="mt-12" />;
  }

  const profil = me?.profilEtablissement ?? null;
  const etablissements = profil?.etablissements ?? [];

  return (
    <main className="mt-8 space-y-6">
      <H2>Mon compte</H2>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="infos">Etablissement</TabsTrigger>
          {/* <TabsTrigger value="password">Modifier mot de passe</TabsTrigger> */}
          <TabsTrigger value="sites">Sites</TabsTrigger>
        </TabsList>
        <div className="bg-secondary-background rounded-3xl border m-1 p-6 h-full">
          <TabsContent value="profil">
            <ProfilTabContent me={me} />
          </TabsContent>

          <TabsContent value="infos">
            <InformationsTabContent me={me} />
          </TabsContent>

          {/* <TabsContent value="password">
          <PasswordTabContent />
        </TabsContent> */}

          <TabsContent value="sites">
            <SitesTabContent
              etablissements={etablissements}
              defaultSiret={profil?.siret}
              defaultTypeEtablissement={profil?.typeEtablissement ?? null}
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
