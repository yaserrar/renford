"use client";

import { MapPin, Receipt, Clock, type LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface OptionCardProps {
  name: string;
  icon: React.ReactNode;
  details: { icon: LucideIcon; label: string; highlight?: boolean }[];
  buttonLabel: string;
  href: string;
}

export default function OptionCard({
  name,
  icon,
  details,
  buttonLabel,
  href,
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

      <Link
        className={buttonVariants({ variant: "dark" }) + " w-fit md:px-10"}
        href={href}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

export { MapPin, Receipt, Clock };
