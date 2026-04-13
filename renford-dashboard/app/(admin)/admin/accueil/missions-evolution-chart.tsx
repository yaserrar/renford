"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DateRangePicker from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useAdminDailyMissions } from "@/hooks/admin";
import { format } from "date-fns";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import { formatDate } from "@/lib/date";
import { Handshake } from "lucide-react";

const chartConfig: ChartConfig = {
  missions: {
    label: "Missions",
    color: "var(--primary)",
  },
};

const defaultRange: DateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 28)),
  to: new Date(),
};

const MissionsEvolutionChart = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultRange,
  );
  const from = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const to = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";
  const { data, isLoading, isError } = useAdminDailyMissions(from, to);

  const dailyData = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((p) => {
      const d = new Date(p.date + "T00:00:00Z");
      return { dayLabel: format(d, "dd/MM"), count: p.count };
    });
  }, [data]);

  if (isLoading) return <Loading className="h-60" />;
  if (isError || !data) return <Error className="h-60" />;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="font-medium text-secondary flex items-center gap-2">
            <div className="rounded-full bg-secondary-background p-2">
              <Handshake className="text-secondary" size={18} />
            </div>
            Évolution des missions
          </CardTitle>
          <CardDescription>
            Nouvelles missions créées par jour sur la période
          </CardDescription>
        </div>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px]">
          <LineChart
            accessibilityLayer
            data={dailyData}
            margin={{ top: 12, left: 12, right: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={[0, "dataMax + 1"]}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={24}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--primary)", r: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Période: {formatDate(dateRange?.from)} → {formatDate(dateRange?.to)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MissionsEvolutionChart;
