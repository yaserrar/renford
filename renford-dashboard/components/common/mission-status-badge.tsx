import { StatutMission } from "@/types/mission";
import { cn } from "@/lib/utils";
import { STATUT_MISSION_LABELS } from "@/validations/mission";

type MissionStatusBadgeProps = {
  status: StatutMission;
  className?: string;
};

const STATUS_TONE: Record<StatutMission, string> = {
  brouillon: "bg-muted text-muted-foreground",
  ajouter_mode_paiement: "bg-destructive/10 text-destructive",
  en_recherche: "bg-primary/30 text-primary-dark",
  candidatures_disponibles: "bg-primary/30 text-primary-dark",
  attente_de_signature: "bg-secondary/20 text-secondary-dark",
  mission_en_cours: "bg-secondary/10 text-secondary",
  remplacement_en_cours: "bg-secondary/10 text-secondary",
  en_litige: "bg-amber-100 text-amber-800",
  mission_terminee: "bg-primary/20 text-primary-dark",
  archivee: "bg-primary/20 text-primary-dark",
  annulee: "bg-destructive/10 text-destructive",
};

export default function MissionStatusBadge({
  status,
  className,
}: MissionStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUT_MISSION_LABELS[status]}
    </span>
  );
}
