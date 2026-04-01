import { StatutMissionRenford } from "@/types/mission-renford";
import { cn } from "@/lib/utils";
import { STATUT_MISSION_RENFORD_LABELS } from "@/validations/mission-renford";

type MissionRenfordStatusBadgeProps = {
  status: StatutMissionRenford;
  className?: string;
};

const STATUS_TONE: Record<StatutMissionRenford, string> = {
  nouveau: "bg-secondary/10 text-secondary",
  vu: "bg-muted text-muted-foreground",
  refuse_par_renford: "bg-destructive/10 text-destructive",
  selection_en_cours: "bg-primary/30 text-primary-dark",
  attente_de_signature: "bg-purple-100 text-purple-600",
  refuse_par_etablissement: "bg-destructive/10 text-destructive",
  contrat_signe: "bg-secondary/10 text-secondary",
  mission_en_cours: "bg-secondary/10 text-secondary",
  mission_terminee: "bg-green-100 text-green-600",
  annule: "bg-destructive/10 text-destructive",
};

export default function MissionRenfordStatusBadge({
  status,
  className,
}: MissionRenfordStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-normal",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUT_MISSION_RENFORD_LABELS[status]}
    </span>
  );
}
