"use client";

import Loading from "@/components/common/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/utilisateur";
import { useRouter, useSearchParams } from "next/navigation";
import InformationsTabContent from "./informations-tab-content";
import NotificationsTabContent from "./notifications-tab-content";
import PasswordTabContent from "./password-tab-content";
import ProfilTabContent from "./profil/profil-tab-content";
import { H2 } from "@/components/ui/typography";
import DeleteAccountSection from "@/components/common/delete-account-section";

const TABS = ["profil", "infos", "notifications"] as const;

export default function ProfileRenfordPage() {
  const { data: me, isLoading } = useCurrentUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const activeTab = TABS.includes(tabParam as any)
    ? (tabParam as string)
    : "profil";

  const onTabChange = (value: string) => {
    router.replace(`?tab=${value}`, { scroll: false });
  };

  if (isLoading) {
    return <Loading className="mt-12" />;
  }

  return (
    <main className="mt-8 space-y-6">
      <H2>Mon compte</H2>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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

      <DeleteAccountSection />
    </main>
  );
}
