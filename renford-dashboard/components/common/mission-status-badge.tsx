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
  candidatures_disponibles: "bg-secondary/10 text-secondary",
  attente_de_signature: "bg-purple-100 text-purple-600",
  mission_en_cours: "bg-secondary/10 text-secondary",
  remplacement_en_cours: "bg-destructive/10 text-destructive",
  en_litige: "bg-destructive/10 text-destructive",
  mission_terminee: "bg-green-100 text-green-600",
  archivee: "bg-muted text-muted-foreground",
  annulee: "bg-destructive/10 text-destructive",
};

export default function MissionStatusBadge({
  status,
  className,
}: MissionStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-normal",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUT_MISSION_LABELS[status]}
    </span>
  );
}
