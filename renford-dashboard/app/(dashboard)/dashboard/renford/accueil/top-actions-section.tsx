"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Settings, Settings2, Share2, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ACTIONS = [
  {
    label: "Nouvelles opportunités",
    href: "/dashboard/renford/missions",
    icon: null,
    highlighted: true,
  },
  {
    label: "Modifier mes préférences de missions",
    href: "/dashboard/renford/preferences",
    icon: Settings,
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
          className="py-12 justify-center rounded-2xl text-sm text-center font-semibold text-black"
        >
          <Link href={action.href}>
            <div className="flex flex-col items-center justify-center gap-4 whitespace-normal leading-tight">
              {action.icon ? (
                <action.icon className="h-4 w-4" />
              ) : (
                <Image
                  src="/logo-dark.png"
                  alt="Nouvelles opportunités"
                  width={16}
                  height={16}
                />
              )}
              <span>{action.label}</span>
            </div>
          </Link>
        </Button>
      ))}
    </section>
  );
}
