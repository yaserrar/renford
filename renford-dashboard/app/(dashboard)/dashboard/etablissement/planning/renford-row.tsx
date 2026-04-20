import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SecureAvatarImage } from "@/components/common/secure-file";
import { PlanningRenford } from "@/types/mission";
import SlotCell from "./slot-cell";

export type DayInfo = {
  date: Date;
  iso: string;
  label: string;
  labelShort: string;
  dayNumber: string;
};

type Props = {
  renford: PlanningRenford;
  days: DayInfo[];
  onSlotClick: (missionId: string) => void;
};

export default function RenfordRow({ renford, days, onSlotClick }: Props) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="sticky left-0 z-10 bg-white py-3 pl-4 pr-6">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <SecureAvatarImage chemin={renford.avatarChemin} />
            <AvatarFallback className="text-xs font-semibold">
              {renford.prenom?.[0]}
              {renford.nom?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{renford.prenom}</p>
            <p className="text-xs text-muted-foreground truncate">
              {renford.titreProfil ?? "Renford"}
            </p>
          </div>
        </div>
      </td>
      {days.map((day) => {
        const daySlots = renford.slots.filter(
          (s) => s.date.slice(0, 10) === day.iso,
        );
        return (
          <td key={day.iso} className="px-2 py-3 align-top">
            <SlotCell slots={daySlots} onClick={onSlotClick} />
          </td>
        );
      })}
    </tr>
  );
}
