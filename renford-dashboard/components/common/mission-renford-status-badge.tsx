import { StatutMissionRenford } from "@/types/mission-renford";
import { cn } from "@/lib/utils";
import { STATUT_MISSION_RENFORD_LABELS } from "@/validations/mission-renford";

type MissionRenfordStatusBadgeProps = {
  status: StatutMissionRenford;
  className?: string;
};

const STATUS_TONE: Record<StatutMissionRenford, string> = {
  nouveau: "bg-primary/30 text-primary-dark",
  vu: "bg-muted text-muted-foreground",
  refuse_par_renford: "bg-destructive/10 text-destructive",
  selection_en_cours: "bg-amber-100 text-amber-800",
  attente_de_signature: "bg-secondary/20 text-secondary-dark",
  refuse_par_etablissement: "bg-destructive/10 text-destructive",
  contrat_signe: "bg-secondary/10 text-secondary",
  mission_en_cours: "bg-secondary/10 text-secondary",
  mission_terminee: "bg-primary/20 text-primary-dark",
  annule: "bg-destructive/10 text-destructive",
};

export default function MissionRenfordStatusBadge({
  status,
  className,
}: MissionRenfordStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUT_MISSION_RENFORD_LABELS[status]}
    </span>
  );
}
