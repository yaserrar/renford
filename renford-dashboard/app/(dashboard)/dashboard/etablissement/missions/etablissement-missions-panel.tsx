"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/common/pagination";
import {
  EtablissementMissionsTab,
  MissionEtablissement,
} from "@/types/mission";
import EtablissementMissionCard from "./etablissement-mission-card";
import CenterState from "@/components/common/center-state";

type EtablissementMissionsPanelProps = {
  missions: MissionEtablissement[];
  isLoading?: boolean;
  isError?: boolean;
  tab: EtablissementMissionsTab;
};

const MISSIONS_PER_PAGE = 4;

export default function EtablissementMissionsPanel({
  missions,
  isLoading,
  isError,
  tab,
}: EtablissementMissionsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(missions.length / MISSIONS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedMissions = useMemo(() => {
    const startIndex = (currentPage - 1) * MISSIONS_PER_PAGE;
    return missions.slice(startIndex, startIndex + MISSIONS_PER_PAGE);
  }, [currentPage, missions]);

  if (isLoading) {
    return (
      <CenterState
        className="border-0"
        title="Chargement des missions"
        description="Nous récupérons les dernières missions de cet onglet."
        isLoading
      />
    );
  }

  if (isError) {
    return (
      <CenterState
        className="border-0"
        title="Impossible de charger les missions"
        description="Réessayez dans quelques instants ou actualisez la page."
      />
    );
  }

  if (missions.length === 0) {
    return (
      <CenterState
        className="border-0"
        title="Aucune mission pour le moment"
        description="Publiez une nouvelle mission ou revenez plus tard pour voir les mises a jour."
      />
    );
  }

  return (
    <div className="space-y-4">
      {paginatedMissions.map((mission) => (
        <EtablissementMissionCard key={mission.id} mission={mission} />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
