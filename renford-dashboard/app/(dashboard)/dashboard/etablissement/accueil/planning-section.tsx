"use client";

import PlanningItem from "@/components/common/planning-item";
import PlanningEmptyState from "@/components/common/planning-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { formatWeekdayDayMonth } from "@/lib/date";
import { cn } from "@/lib/utils";
import { EtablissementAccueilPlanningSlot } from "@/types/accueil";
import { DISCIPLINE_MISSION_LABELS } from "@/validations/mission";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  planning?: EtablissementAccueilPlanningSlot[];
};

export default function EtablissementPlanningSection({ planning }: Props) {
  const slots = planning ?? [];

  const grouped = slots.reduce<
    Array<{ dateGroup: string; items: EtablissementAccueilPlanningSlot[] }>
  >((groups, slot) => {
    const dateGroup = formatWeekdayDayMonth(slot.date);
    const existing = groups.find((g) => g.dateGroup === dateGroup);
    if (existing) {
      existing.items.push(slot);
    } else {
      groups.push({ dateGroup, items: [slot] });
    }
    return groups;
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-white p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          Mon planning
        </p>
        <Link
          href="/dashboard/etablissement/planning"
          className={cn(
            buttonVariants({
              variant: "link",
            }),
            "px-0 text-black",
          )}
        >
          Voir tous
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {grouped.length === 0 ? (
        <PlanningEmptyState
          description="Postez une mission et recevez vos premiers profils dès aujourd'hui."
          ctaLabel="Nouvelle mission"
          ctaHref="/dashboard/etablissement/missions/nouvelle"
        />
      ) : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.dateGroup} className="space-y-2">
              <p className="text-sm md:text-base font-semibold text-foreground text-left capitalize">
                {group.dateGroup}
              </p>
              <div className="space-y-3">
                {group.items.map((slot, index) => {
                  const disciplineLabel =
                    DISCIPLINE_MISSION_LABELS[slot.discipline] ??
                    slot.discipline;
                  const renfordName = slot.renford
                    ? `${slot.renford.prenom}`
                    : undefined;
                  const tarif = slot.tarif ? `${slot.tarif} €` : undefined;

                  return (
                    <PlanningItem
                      key={`${slot.id}-${index}`}
                      title={disciplineLabel}
                      nameLabel={renfordName}
                      subtitle={slot.renford?.titreProfil ?? undefined}
                      dateLabel={formatWeekdayDayMonth(slot.date)}
                      timeLabel={`${slot.heureDebut} - ${slot.heureFin} · ${slot.totalHours}h`}
                      logoSrc={slot.renford?.avatarChemin ?? undefined}
                      amountValue={tarif}
                      amountSuffix="HT"
                      visualType="avatar"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
