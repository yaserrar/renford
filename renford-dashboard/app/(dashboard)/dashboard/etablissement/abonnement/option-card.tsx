"use client";

import { MapPin, Receipt, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptionCardProps {
  name: string;
  icon: React.ReactNode;
  details: { icon: LucideIcon; label: string; highlight?: boolean }[];
  buttonLabel: string;
  onButtonClick?: () => void;
}

export default function OptionCard({
  name,
  icon,
  details,
  buttonLabel,
  onButtonClick,
}: OptionCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-input bg-card p-6">
      {/* Header with title and icon */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">{name}</h3>
        <span className="text-muted-foreground">{icon}</span>
      </div>

      {/* Detail rows */}
      <div className="space-y-2">
        {details.map((detail, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <detail.icon className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{detail.label}</span>
          </div>
        ))}
      </div>

      {/* Button */}
      <Button variant="dark" onClick={onButtonClick} className="w-fit md:px-10">
        {buttonLabel}
      </Button>
    </div>
  );
}

export { MapPin, Receipt, Clock };
