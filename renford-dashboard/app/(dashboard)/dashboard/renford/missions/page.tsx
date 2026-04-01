"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import { useRenfordMissions } from "@/hooks/mission";
import {
  MissionRenfordListItem,
  RenfordMissionsTab,
  StatutMissionRenford,
} from "@/types/mission-renford";
import {
  RENFORD_MISSIONS_STATUS_GROUPS,
  RENFORD_MISSIONS_TAB,
  RENFORD_MISSIONS_TAB_LABELS,
} from "@/validations/mission-renford";
import RenfordMissionsPanel from "./renford-missions-panel";

export default function RenfordMissionsPage() {
  const missionsQuery = useRenfordMissions();

  const allMissions = missionsQuery.data ?? [];

  const missionsByTab = useMemo(
    () =>
      (RENFORD_MISSIONS_TAB as readonly RenfordMissionsTab[]).reduce(
        (acc, tab) => {
          const statuses = RENFORD_MISSIONS_STATUS_GROUPS[
            tab
          ] as readonly StatutMissionRenford[];

          acc[tab] = allMissions.filter((item) =>
            statuses.includes(item.statut),
          );

          return acc;
        },
        {
          opportunites: [],
          candidatures: [],
          validees: [],
        } as Record<RenfordMissionsTab, MissionRenfordListItem[]>,
      ),
    [allMissions],
  );

  return (
    <main className="mt-8 space-y-6">
      <div className="w-full space-y-4">
        <H2>Mes missions</H2>

        <Tabs defaultValue="opportunites" className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              {RENFORD_MISSIONS_TAB.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="px-4">
                  {RENFORD_MISSIONS_TAB_LABELS[tab]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="bg-secondary-background m-1 h-full min-h-[520px] rounded-3xl border p-4 md:p-6">
            {RENFORD_MISSIONS_TAB.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <RenfordMissionsPanel
                  missions={missionsByTab[tab]}
                  isLoading={missionsQuery.isLoading}
                  isError={missionsQuery.isError}
                  tab={tab}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </main>
  );
}
