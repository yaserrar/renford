"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminStats } from "@/hooks/admin";
import {
  Building2,
  Handshake,
  Loader2,
  Mail,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatMois } from "./format-mois";
import { StatCard } from "./stat-card";
import { StatRow } from "./stat-row";

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
            icon={<Users className="size-5 text-blue-600" />}
          />
          <StatCard
            title="Missions postées"
            value={stats.missions.total}
            description={`${stats.missions.nouvelles30j} nouvelles (30j)`}
            icon={<Handshake className="size-5 text-purple-600" />}
          />
          <StatCard
            title="Taux d'acceptation"
            value={`${stats.missions.tauxAcceptation}%`}
            description="Candidatures acceptées"
            icon={<TrendingUp className="size-5 text-green-600" />}
          />
          <StatCard
            title="Messages non traités"
            value={stats.messagesContactNonTraites}
            description="Support à traiter"
            icon={<Mail className="size-5 text-orange-600" />}
          />
        </div>

        {/* Détail utilisateurs & missions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Utilisateurs</CardTitle>
              <CardDescription>
                Répartition et statut des comptes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-blue-500" />
                    <span className="text-sm">Établissements</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.utilisateurs.etablissements}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-purple-500" />
                    <span className="text-sm">Renfords</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.utilisateurs.renfords}
                  </span>
                </div>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="size-4 text-green-500" />
                      <span className="text-sm">Actifs</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {stats.utilisateurs.actifs}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserX className="size-4 text-red-500" />
                      <span className="text-sm">Suspendus</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {stats.utilisateurs.suspendus}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Missions</CardTitle>
              <CardDescription>
                État des missions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatRow
                  label="En recherche"
                  value={stats.missions.enRecherche}
                  color="text-blue-500"
                />
                <StatRow
                  label="En cours"
                  value={stats.missions.enCours}
                  color="text-green-500"
                />
                <StatRow
                  label="Terminées"
                  value={stats.missions.terminees}
                  color="text-gray-500"
                />
                <StatRow
                  label="Annulées"
                  value={stats.missions.annulees}
                  color="text-red-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Évolution */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Évolution des inscriptions
              </CardTitle>
              <CardDescription>6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.evolution.utilisateurs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune donnée disponible.
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.evolution.utilisateurs.map((item) => (
                    <div
                      key={item.mois}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {formatMois(item.mois)}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{
                            width: `${Math.max(
                              8,
                              (item.total /
                                Math.max(
                                  ...stats.evolution.utilisateurs.map(
                                    (u) => u.total,
                                  ),
                                  1,
                                )) *
                                120,
                            )}px`,
                          }}
                        />
                        <span className="font-medium w-8 text-right">
                          {item.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Évolution des missions</CardTitle>
              <CardDescription>6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.evolution.missions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune donnée disponible.
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.evolution.missions.map((item) => (
                    <div
                      key={item.mois}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {formatMois(item.mois)}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{
                            width: `${Math.max(
                              8,
                              (item.total /
                                Math.max(
                                  ...stats.evolution.missions.map(
                                    (m) => m.total,
                                  ),
                                  1,
                                )) *
                                120,
                            )}px`,
                          }}
                        />
                        <span className="font-medium w-8 text-right">
                          {item.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
