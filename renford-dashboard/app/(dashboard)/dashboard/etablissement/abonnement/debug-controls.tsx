"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export type DebugPlan = "none" | "echauffement" | "performance" | "competition";

interface DebugControlsProps {
  plan: DebugPlan;
  onPlanChange: (plan: DebugPlan) => void;
  missionsUsed: number;
  onMissionsChange: (value: number) => void;
  maxMissions: number;
}

export default function DebugControls({
  plan,
  onPlanChange,
  missionsUsed,
  onMissionsChange,
  maxMissions,
}: DebugControlsProps) {
  return (
    <div className="rounded-2xl border border-dashed border-destructive/50 bg-destructive/5 p-4 space-y-4">
      <p className="text-xs font-semibold text-destructive uppercase tracking-wide">
        Debug Controls
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-1.5 flex-1">
          <label className="text-xs font-medium text-muted-foreground">
            Abonnement actuel
          </label>
          <Select
            value={plan}
            onValueChange={(v) => onPlanChange(v as DebugPlan)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun abonnement</SelectItem>
              <SelectItem value="echauffement">ÉCHAUFFEMENT</SelectItem>
              <SelectItem value="performance">PERFORMANCE</SelectItem>
              <SelectItem value="competition">COMPÉTITION</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex-1">
          <label className="text-xs font-medium text-muted-foreground">
            Missions postées ce mois : {missionsUsed} /{" "}
            {maxMissions === 0 ? "∞" : maxMissions}
          </label>
          <Slider
            value={[missionsUsed]}
            onValueChange={([v]) => onMissionsChange(v ?? 0)}
            min={0}
            max={maxMissions === 0 ? 100 : maxMissions}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
