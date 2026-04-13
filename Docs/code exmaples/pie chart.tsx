"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useGetAnnoncesByStatut } from "@/hooks/dashboard";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import { Megaphone } from "lucide-react";

// Colors mapping: en_attente_paiement -> amber-500, publiee -> primary,
// terminee -> green-500, archivee -> red-500
const STATUS_COLORS: Record<string, string> = {
  en_attente_paiement: "#f59e0b", // amber-500
  publiee: "var(--primary)", // primary
  terminee: "#22c55e", // green-500
  archivee: "#ef4444", // red-500
};

const LABELS: Record<string, string> = {
  en_attente_paiement: "En attente paiement",
  publiee: "Publiées",
  archivee: "Archivées",
  terminee: "Terminées",
};

const chartConfig: ChartConfig = {
  annonces: { label: "Annonces" },
  en_attente_paiement: {
    label: LABELS.en_attente_paiement,
    color: STATUS_COLORS.en_attente_paiement,
  },
  publiee: { label: LABELS.publiee, color: STATUS_COLORS.publiee },
  archivee: { label: LABELS.archivee, color: STATUS_COLORS.archivee },
  terminee: { label: LABELS.terminee, color: STATUS_COLORS.terminee },
};

const AnnoncesChart = () => {
  const { data, isLoading, isError } = useGetAnnoncesByStatut();

  const chartData = Object.entries(data || {}).map(([statut, count]) => ({
    statut,
    count: count as number,
    fill: STATUS_COLORS[statut] || "hsl(var(--primary))",
  }));

  const total = chartData.reduce((a, b) => a + b.count, 0);

  if (isLoading) {
    return <Loading className="h-60" />;
  }

  if (isError || !data) {
    return <Error className="h-60" />;
  }

  return (
    <Card className="flex flex-col bg-white">
      <CardHeader className="">
        <CardTitle className="font-medium text-primary-dark flex items-center gap-2">
          <div className="bg-primary-background rounded-full p-2">
            <Megaphone className="text-primary" size={18} />
          </div>
          Annonces par Statut
        </CardTitle>
        <CardDescription>Répartition actuelle des annonces</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="statut"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              height={400}
              width={400}
              label={(entry) => `${LABELS[entry.statut]}`}
            >
              {chartData.map((slice) => (
                <Cell
                  key={slice.statut}
                  fill={slice.fill}
                  height={400}
                  width={400}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="statut" />}
              className="flex-wrap gap-2 [&>*]:basis-1/5 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AnnoncesChart;

("use client");

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A pie chart with stacked sections";

const desktopData = [
  { month: "january", desktop: 186, fill: "var(--color-january)" },
  { month: "february", desktop: 305, fill: "var(--color-february)" },
  { month: "march", desktop: 237, fill: "var(--color-march)" },
  { month: "april", desktop: 173, fill: "var(--color-april)" },
  { month: "may", desktop: 209, fill: "var(--color-may)" },
];

const mobileData = [
  { month: "january", mobile: 80, fill: "var(--color-january)" },
  { month: "february", mobile: 200, fill: "var(--color-february)" },
  { month: "march", mobile: 120, fill: "var(--color-march)" },
  { month: "april", mobile: 190, fill: "var(--color-april)" },
  { month: "may", mobile: 130, fill: "var(--color-may)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
  march: {
    label: "March",
    color: "var(--chart-3)",
  },
  april: {
    label: "April",
    color: "var(--chart-4)",
  },
  may: {
    label: "May",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPieStacked() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Stacked</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="visitors"
                  nameKey="month"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    return chartConfig[
                      payload?.[0].dataKey as keyof typeof chartConfig
                    ].label;
                  }}
                />
              }
            />
            <Pie data={desktopData} dataKey="desktop" outerRadius={60} />
            <Pie
              data={mobileData}
              dataKey="mobile"
              innerRadius={70}
              outerRadius={90}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
