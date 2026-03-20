"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import Pagination from "@/components/common/pagination";
import {
  EtablissementMissionsTab,
  MissionEtablissement,
} from "@/types/mission";
import EtablissementMissionCard from "./etablissement-mission-card";

type EtablissementMissionsPanelProps = {
  missions: MissionEtablissement[];
  isLoading?: boolean;
  isError?: boolean;
  tab: EtablissementMissionsTab;
};

const MISSIONS_PER_PAGE = 4;

type CenterStateProps = {
  title: string;
  description: string;
};

function CenterState({ title, description }: CenterStateProps) {
  return (
    <div className="flex min-h-[360px] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary-dark">
          <Briefcase className="h-6 w-6" />
        </div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

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
        title="Chargement des missions"
        description="Nous récupérons les dernières missions de cet onglet."
      />
    );
  }

  if (isError) {
    return (
      <CenterState
        title="Impossible de charger les missions"
        description="Réessayez dans quelques instants ou actualisez la page."
      />
    );
  }

  if (missions.length === 0) {
    return (
      <CenterState
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
