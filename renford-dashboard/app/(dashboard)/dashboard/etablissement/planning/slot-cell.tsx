type Props = {
  slots: Array<{ heureDebut: string; heureFin: string; missionId: string }>;
  onClick: (missionId: string) => void;
};

export default function SlotCell({ slots, onClick }: Props) {
  if (slots.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      {slots.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onClick(s.missionId)}
          className="cursor-pointer whitespace-nowrap rounded bg-blue-50 px-2 py-1 text-xs font-medium text-foreground hover:bg-blue-100 transition-colors"
        >
          {s.heureDebut} &gt; {s.heureFin}
        </button>
      ))}
    </div>
  );
}
