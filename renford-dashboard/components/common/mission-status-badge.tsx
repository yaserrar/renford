import { StatutMission } from "@/types/mission";
import { cn } from "@/lib/utils";
import { STATUT_MISSION_LABELS } from "@/validations/mission";

type MissionStatusBadgeProps = {
  status: StatutMission;
  className?: string;
};

const STATUS_TONE: Record<StatutMission, string> = {
  brouillon: "bg-muted text-muted-foreground",
  en_attente_paiement: "bg-destructive/10 text-destructive",
  envoyee: "bg-primary/30 text-primary-dark",
  en_cours_de_matching: "bg-primary/30 text-primary-dark",
  proposee: "bg-secondary/10 text-secondary",
  acceptee: "bg-secondary/20 text-secondary-dark",
  contrat_signe: "bg-secondary/10 text-secondary",
  payee: "bg-secondary/10 text-secondary",
  en_cours: "bg-secondary/10 text-secondary",
  a_valider: "bg-primary/20 text-primary-dark",
  validee: "bg-primary/20 text-primary-dark",
  terminee: "bg-primary/20 text-primary-dark",
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
