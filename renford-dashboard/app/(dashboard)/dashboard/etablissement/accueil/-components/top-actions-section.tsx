"use client";

import { Button } from "@/components/ui/button";
import { Handshake, Heart, Plus } from "lucide-react";
import Link from "next/link";

const ACTIONS = [
  {
    label: "Demande de mission",
    href: "/dashboard/etablissement/missions/nouvelle",
    icon: Plus,
    highlighted: true,
  },
  {
    label: "Mes missions",
    href: "/dashboard/etablissement/missions",
    icon: Handshake,
  },
  {
    label: "Mes Renfords",
    href: "/dashboard/etablissement/mes-renfords",
    icon: Heart,
  },
];

export default function EtablissementTopActionsSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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
