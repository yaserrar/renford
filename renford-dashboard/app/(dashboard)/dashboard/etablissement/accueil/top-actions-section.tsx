"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ACTIONS = [
  {
    label: "Demande de mission",
    href: "/dashboard/etablissement/missions/nouvelle",
    icon: Plus,
    highlighted: true,
  },
  {
    label: "Gérer les sites / établissements",
    href: "/dashboard/etablissement/profil?tab=sites",
    icon: Settings,
  },
  {
    label: "Gérer mon planning",
    href: "/dashboard/etablissement/planning",
    icon: CalendarDays,
  },
];

export default function EtablissementTopActionsSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {ACTIONS.map((action) => (
        <Button
          key={action.label}
          asChild
          variant={action.highlighted ? "outline-primary" : "outline"}
          className="py-12 justify-center rounded-2xl text-sm text-center font-semibold text-black"
        >
          <Link href={action.href}>
            <div className="flex flex-col items-center justify-center gap-4 whitespace-normal leading-tight">
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </div>
          </Link>
        </Button>
      ))}
    </section>
  );
}
