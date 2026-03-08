"use client";

import Loading from "@/components/common/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/utilisateur";
import InformationsTabContent from "./informations-tab-content";
import NotificationsTabContent from "./notifications-tab-content";
import PasswordTabContent from "./password-tab-content";
import ProfilTabContent from "./profil-tab-content";

export default function ProfileRenfordPage() {
  const { data: me, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loading className="mt-12" />;
  }

  return (
    <main className="container mx-auto mt-8 space-y-4">
      <h1 className="text-3xl font-semibold">Mon compte</h1>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
          <TabsTrigger value="password">Modifier mot de passe</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <ProfilTabContent me={me} />
        </TabsContent>
        <TabsContent value="infos">
          <InformationsTabContent me={me} />
        </TabsContent>
        <TabsContent value="password">
          <PasswordTabContent />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTabContent me={me} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
