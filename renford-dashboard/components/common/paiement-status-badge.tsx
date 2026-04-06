import { StatutPaiement } from "@/types/paiement";
import { cn } from "@/lib/utils";
import { STATUT_PAIEMENT_LABELS } from "@/validations/paiement";

type PaiementStatusBadgeProps = {
  status: StatutPaiement;
  className?: string;
};

const STATUS_TONE: Record<StatutPaiement, string> = {
  en_attente: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  en_cours: "bg-blue-50 text-blue-700 border border-blue-200",
  bloque: "bg-orange-50 text-orange-700 border border-orange-200",
  libere: "bg-green-50 text-green-700 border border-green-200",
  rembourse: "bg-purple-50 text-purple-700 border border-purple-200",
  echoue: "bg-red-50 text-red-700 border border-red-200",
  conteste: "bg-red-50 text-red-700 border border-red-200",
};

export default function PaiementStatusBadge({
  status,
  className,
}: PaiementStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-normal",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUT_PAIEMENT_LABELS[status]}
    </span>
  );
}
