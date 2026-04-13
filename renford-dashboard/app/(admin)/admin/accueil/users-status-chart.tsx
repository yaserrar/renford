"use client";

import { Cell, Pie, PieChart } from "recharts";
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
import { useAdminUsersByStatus } from "@/hooks/admin";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import { Users } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  etablissement: "#3b82f6",
  renford: "#8b5cf6",
};

const TYPE_LABELS: Record<string, string> = {
  etablissement: "Établissements",
  renford: "Renfords",
};

const chartConfig: ChartConfig = {
  value: { label: "Comptes" },
  ...Object.fromEntries(
    Object.entries(TYPE_LABELS).map(([key, label]) => [
      key,
      { label, color: TYPE_COLORS[key] },
    ]),
  ),
};

const UsersStatusChart = () => {
  const { data, isLoading, isError } = useAdminUsersByStatus();

  if (isLoading) return <Loading className="h-60" />;
  if (isError || !data) return <Error className="h-60" />;

  const typeData = data.byType.map((r) => ({
    key: r.type,
    label: TYPE_LABELS[r.type] ?? r.type,
    value: r.count,
    fill: TYPE_COLORS[r.type] || "#94a3b8",
  }));

  return (
    <Card className="flex flex-col bg-white">
      <CardHeader>
        <CardTitle className="font-medium text-secondary flex items-center gap-2">
          <div className="rounded-full bg-secondary-background p-2">
            <Users className="text-secondary" size={18} />
          </div>
          Répartition des comptes
        </CardTitle>
        <CardDescription>Établissements vs Renfords</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="key" indicator="dot" />}
            />
            <Pie
              data={typeData}
              dataKey="value"
              nameKey="key"
              innerRadius={60}
              outerRadius={100}
            >
              {typeData.map((slice) => (
                <Cell key={slice.key} fill={slice.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="key" />}
              className="flex gap-4 justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UsersStatusChart;
