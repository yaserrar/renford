"use client";

import Loading from "@/components/common/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/utilisateur";
import InformationsTabContent from "./informations-tab-content";
import NotificationsTabContent from "./notifications-tab-content";
import PasswordTabContent from "./password-tab-content";
import ProfilTabContent from "./profil/profil-tab-content";
import { H2 } from "@/components/ui/typography";

export default function ProfileRenfordPage() {
  const { data: me, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loading className="mt-12" />;
  }

  return (
    <main className="mt-8 space-y-4">
      <H2>Mon compte</H2>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
          {/* <TabsTrigger value="password">Modifier mot de passe</TabsTrigger> */}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
          <TabsContent value="notifications">
            <NotificationsTabContent me={me} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
