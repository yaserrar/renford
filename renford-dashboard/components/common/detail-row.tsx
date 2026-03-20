import { cn } from "@/lib/utils";

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export default function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "grid gap-3 border-b border-border/70 py-4 md:grid-cols-[280px_1fr] md:gap-6",
        className,
      )}
    >
      <p className="text-base font-semibold text-foreground">{label}</p>
      <div className="text-base text-foreground">{value}</div>
    </div>
  );
}
