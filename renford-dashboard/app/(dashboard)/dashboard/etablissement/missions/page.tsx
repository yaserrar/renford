"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import { useGteEtablissementMissionsByTab } from "@/hooks/mission";
import {
  EtablissementMissionsTab,
  MissionEtablissement,
} from "@/types/mission";
import { ETABLISSEMENT_MISSIONS_STATUS_GROUPS } from "@/validations/mission";
import EtablissementMissionsPanel from "./etablissement-missions-panel";
import MissionFiltersDialog, { MissionFilters } from "./mission-filters-dialog";

const DEFAULT_FILTERS: MissionFilters = {
  siteId: "",
  fromDate: "",
  toDate: "",
};

const parseInputDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseMissionDate = (
  value: Date | string | null | undefined,
): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isMissionMatchingFilters = (
  mission: MissionEtablissement,
  filters: MissionFilters,
): boolean => {
  if (filters.siteId && mission.etablissement?.id !== filters.siteId) {
    return false;
  }

  const fromDate = parseInputDate(filters.fromDate);
  const missionStartDate = parseMissionDate(mission.dateDebut);
  if (fromDate && missionStartDate && missionStartDate < fromDate) {
    return false;
  }

  const toDate = parseInputDate(filters.toDate);
  if (toDate) {
    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);

    const missionEndDate = parseMissionDate(mission.dateFin);

    if (missionEndDate && missionEndDate > endOfDay) {
      return false;
    }
  }

  return true;
};

export default function EtablissementMissionsPage() {
  const missionsQuery = useGteEtablissementMissionsByTab();
  const [filters, setFilters] = useState<MissionFilters>(DEFAULT_FILTERS);

  const allMissions = missionsQuery.data ?? [];

  const siteOptions = useMemo(() => {
    const map = new Map<string, string>();

    allMissions.forEach((mission) => {
      if (mission.etablissement?.id && mission.etablissement.nom) {
        map.set(mission.etablissement.id, mission.etablissement.nom);
      }
    });

    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [allMissions]);

  const filteredMissionsByTab = useMemo(
    () =>
      (
        Object.keys(
          ETABLISSEMENT_MISSIONS_STATUS_GROUPS,
        ) as EtablissementMissionsTab[]
      ).reduce(
        (acc, tab) => {
          const statuses = ETABLISSEMENT_MISSIONS_STATUS_GROUPS[
            tab
          ] as readonly MissionEtablissement["statut"][];

          acc[tab] = allMissions.filter(
            (mission) =>
              statuses.includes(mission.statut) &&
              isMissionMatchingFilters(mission, filters),
          );

          return acc;
        },
        {
          "en-recherche": [],
          confirmees: [],
          terminees: [],
        } as Record<EtablissementMissionsTab, MissionEtablissement[]>,
      ),
    [allMissions, filters],
  );

  return (
    <main className="mt-8 space-y-6">
      <div className="w-full space-y-4">
        <H2>Liste des missions</H2>

        <Tabs defaultValue="en-recherche" className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="en-recherche" className="px-4">
                En recherche
              </TabsTrigger>
              <TabsTrigger value="confirmees" className="px-4">
                Confirmées
              </TabsTrigger>
              <TabsTrigger value="terminees" className="px-4">
                Terminées
              </TabsTrigger>
            </TabsList>

            <MissionFiltersDialog
              sites={siteOptions}
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>

          <div className="bg-secondary-background m-1 h-full min-h-[520px] rounded-3xl border p-4 md:p-6">
            <TabsContent value="en-recherche">
              <EtablissementMissionsPanel
                missions={filteredMissionsByTab["en-recherche"]}
                isLoading={missionsQuery.isLoading}
                isError={missionsQuery.isError}
                tab="en-recherche"
              />
            </TabsContent>

            <TabsContent value="confirmees">
              <EtablissementMissionsPanel
                missions={filteredMissionsByTab.confirmees}
                isLoading={missionsQuery.isLoading}
                isError={missionsQuery.isError}
                tab="confirmees"
              />
            </TabsContent>

            <TabsContent value="terminees">
              <EtablissementMissionsPanel
                missions={filteredMissionsByTab.terminees}
                isLoading={missionsQuery.isLoading}
                isError={missionsQuery.isError}
                tab="terminees"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
