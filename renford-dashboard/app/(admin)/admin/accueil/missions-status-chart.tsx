"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdminMissionsByStatus } from "@/hooks/admin";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import { Handshake } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  brouillon: "#94a3b8", // muted slate
  ajouter_mode_paiement: "#fb923c", // orange – action required
  en_recherche: "#fcb726", // primary-dark amber
  candidatures_disponibles: "#4295ff", // secondary blue
  attente_de_signature: "#9333ea", // purple-600
  mission_en_cours: "#22c55e", // green – active
  remplacement_en_cours: "#ef4444", // destructive red
  en_litige: "#dc2626", // red-600
  mission_terminee: "#16a34a", // green-600
  archivee: "#6b7280", // gray-500
  annulee: "#f43f5e", // rose-500
};

const LABELS: Record<string, string> = {
  en_recherche: "En recherche",
  candidatures_disponibles: "Candidatures",
  attente_de_signature: "Attente signature",
  mission_en_cours: "En cours",
  mission_terminee: "Terminées",
  annulee: "Annulées",
  brouillon: "Brouillon",
  archivee: "Archivées",
  ajouter_mode_paiement: "Paiement requis",
  remplacement_en_cours: "Remplacement",
  en_litige: "En litige",
};

const chartConfig: ChartConfig = Object.fromEntries(
  Object.entries(LABELS).map(([key, label]) => [
    key,
    { label, color: STATUS_COLORS[key] },
  ]),
);

const MissionsStatusChart = () => {
  const { data, isLoading, isError } = useAdminMissionsByStatus();

  const chartData = Object.entries(data || {})
    .filter(([, count]) => (count as number) > 0)
    .map(([statut, count]) => ({
      statut,
      count: count as number,
      fill: STATUS_COLORS[statut] || "#94a3b8",
    }));

  if (isLoading) return <Loading className="h-60" />;
  if (isError || !data) return <Error className="h-60" />;

  return (
    <Card className="flex flex-col bg-white">
      <CardHeader>
        <CardTitle className="font-medium text-secondary flex items-center gap-2">
          <div className="rounded-full bg-secondary-background p-2">
            <Handshake className="text-secondary" size={18} />
          </div>
          État des missions
        </CardTitle>
        <CardDescription>
          Répartition par statut sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] pb-0 [&>svg]:overflow-visible"
        >
          <PieChart margin={{ top: 24, right: 24, bottom: 0, left: 24 }}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="statut"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((slice) => (
                <Cell key={slice.statut} fill={slice.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="statut" />}
              className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MissionsStatusChart;
