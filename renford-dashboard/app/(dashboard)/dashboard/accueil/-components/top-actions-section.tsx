"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

export type TopAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  highlighted?: boolean;
};

type TopActionsSectionProps = {
  actions: TopAction[];
};

export default function TopActionsSection({ actions }: TopActionsSectionProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          asChild
          variant={action.highlighted ? "outline-primary" : "outline"}
          className={cn(
            "h-20 justify-center rounded-2xl text-sm text-center font-semibold",
            action.highlighted && "border-2",
          )}
        >
          <Link href={action.href}>
            <div className="flex flex-col items-center justify-center gap-2 whitespace-normal leading-tight">
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </div>
          </Link>
        </Button>
      ))}
    </section>
  );
}
