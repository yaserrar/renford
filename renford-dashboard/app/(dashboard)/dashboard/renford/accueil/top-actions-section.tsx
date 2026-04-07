"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Settings, Share2 } from "lucide-react";
import InviterRenfordDialog from "@/components/common/inviter-renford-dialog";
import Image from "next/image";
import Link from "next/link";

const ACTIONS = [
  {
    key: "opportunites",
    label: "Nouvelles opportunités",
    href: "/dashboard/renford/missions",
    icon: null,
    highlighted: true,
  },
  {
    key: "preferences",
    label: "Modifier mes préférences de missions",
    href: "/dashboard/renford/profil?tab=profil",
    icon: Settings,
  },
  {
    key: "planning",
    label: "Gérer mon planning",
    href: "/dashboard/renford/planning",
    icon: CalendarDays,
  },
  {
    key: "parrainage",
    label: "Inviter un Renford",
    href: "#",
    icon: Share2,
    isDialog: true,
  },
];

export default function RenfordTopActionsSection({
  nouvellesOpportunites,
}: {
  nouvellesOpportunites?: number;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ACTIONS.map((action) => {
          const content = (
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
              <span>
                {action.highlighted &&
                  nouvellesOpportunites != null &&
                  nouvellesOpportunites > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-destructive text-white text-xs font-semibold mr-2">
                      {nouvellesOpportunites}
                    </span>
                  )}
                {action.label}
              </span>
            </div>
          );

          if (action.isDialog) {
            return (
              <Button
                key={action.key}
                variant="outline"
                className="py-12 justify-center rounded-2xl text-sm text-center font-semibold text-black"
                onClick={() => setInviteOpen(true)}
              >
                {content}
              </Button>
            );
          }

          return (
            <Button
              key={action.key}
              asChild
              variant={action.highlighted ? "outline-primary" : "outline"}
              className="py-12 justify-center rounded-2xl text-sm text-center font-semibold text-black relative"
            >
              <Link href={action.href}>{content}</Link>
            </Button>
          );
        })}
      </section>

      <InviterRenfordDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
