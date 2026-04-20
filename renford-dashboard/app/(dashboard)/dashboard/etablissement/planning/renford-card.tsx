import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SecureAvatarImage } from "@/components/common/secure-file";
import { PlanningRenford } from "@/types/mission";

type Props = {
  renford: PlanningRenford;
  selectedDayIso: string;
  onSlotClick: (missionId: string) => void;
};

export default function RenfordCard({
  renford,
  selectedDayIso,
  onSlotClick,
}: Props) {
  const daySlots = renford.slots.filter(
    (s) => s.date.slice(0, 10) === selectedDayIso,
  );

  if (daySlots.length === 0) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar className="size-12">
          <SecureAvatarImage chemin={renford.avatarChemin} />
          <AvatarFallback className="text-xs font-semibold">
            {renford.prenom?.[0]}
            {renford.nom?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-sm font-semibold">
            {renford.prenom} {renford.nom}
          </p>
          <p className="text-xs text-muted-foreground">
            {renford.titreProfil ?? "Renford"}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-end gap-1">
        {daySlots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSlotClick(s.missionId)}
            className="cursor-pointer whitespace-nowrap rounded bg-blue-50 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-blue-100 transition-colors"
          >
            {s.heureDebut} &gt; {s.heureFin}
          </button>
        ))}
      </div>
    </div>
  );
}
