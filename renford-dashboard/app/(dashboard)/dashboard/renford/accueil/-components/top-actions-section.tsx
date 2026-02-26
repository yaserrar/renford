"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Settings2, Share2, Zap } from "lucide-react";
import Link from "next/link";

const ACTIONS = [
  {
    label: "Nouvelles opportunités",
    href: "/dashboard/renford/missions",
    icon: Zap,
    highlighted: true,
  },
  {
    label: "Modifier mes préférences de missions",
    href: "/dashboard/renford/preferences",
    icon: Settings2,
  },
  {
    label: "Gérer mon planning",
    href: "/dashboard/renford/planning",
    icon: CalendarDays,
  },
  {
    label: "Parrainer un Renford",
    href: "/dashboard/renford/parrainage",
    icon: Share2,
  },
];

export default function RenfordTopActionsSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {ACTIONS.map((action) => (
        <Button
          key={action.label}
          asChild
          variant={action.highlighted ? "outline-primary" : "outline"}
          className="h-20 justify-center rounded-2xl text-sm text-center font-semibold"
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
