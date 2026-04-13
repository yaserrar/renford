"use client";

import { useAdminStats } from "@/hooks/admin";
import { Handshake, Loader2, Mail, TrendingUp, Users } from "lucide-react";
import { StatCard } from "./stat-card";
import MissionsStatusChart from "./missions-status-chart";
import UsersStatusChart from "./users-status-chart";
import InscriptionsChart from "./inscriptions-chart";
import MissionsEvolutionChart from "./missions-evolution-chart";

export default function AdminAccueilPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <div className="py-20 text-center text-muted-foreground">
          Impossible de charger les statistiques.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Utilisateurs"
            value={stats.utilisateurs.total}
            description={`${stats.utilisateurs.nouveaux30j} nouveaux (30j)`}
            icon={<Users className="size-5 text-secondary" />}
          />
          <StatCard
            title="Missions postées"
            value={stats.missions.total}
            description={`${stats.missions.nouvelles30j} nouvelles (30j)`}
            icon={<Handshake className="size-5 text-secondary" />}
          />
          <StatCard
            title="Taux d'acceptation"
            value={`${stats.missions.tauxAcceptation}%`}
            description="Candidatures acceptées"
            icon={<TrendingUp className="size-5 text-secondary" />}
          />
          <StatCard
            title="Messages non traités"
            value={stats.messagesContactNonTraites}
            description="Support à traiter"
            icon={<Mail className="size-5 text-secondary" />}
          />
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MissionsStatusChart />
          <UsersStatusChart />
        </div>

        {/* Evolution Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InscriptionsChart />
          <MissionsEvolutionChart />
        </div>
      </div>
    </main>
  );
}
