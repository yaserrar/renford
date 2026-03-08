"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileRenfordPage() {
  return (
    <main className="container mx-auto mt-8 space-y-4">
      <h1 className="text-3xl font-semibold">Mon compte</h1>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent
          value="profil"
          className="bg-white rounded-2xl border border-input p-6"
        />
        <TabsContent
          value="infos"
          className="bg-white rounded-2xl border border-input p-6"
        />
        <TabsContent
          value="notifications"
          className="bg-white rounded-2xl border border-input p-6"
        />
      </Tabs>
    </main>
  );
}
