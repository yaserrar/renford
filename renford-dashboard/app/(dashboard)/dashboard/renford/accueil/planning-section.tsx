"use client";

import PlanningItem from "@/components/common/planning-item";
import PlanningEmptyState from "@/components/common/planning-empty-state";
import { buttonVariants } from "@/components/ui/button";
import { formatWeekdayDayMonth } from "@/lib/date";
import { cn } from "@/lib/utils";
import { RenfordAccueilPlanningSlot } from "@/types/accueil";
import { DISCIPLINE_MISSION_LABELS } from "@/validations/mission";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  planning?: RenfordAccueilPlanningSlot[];
};

export default function RenfordPlanningSection({ planning }: Props) {
  const slots = planning ?? [];

  const grouped = slots.reduce<
    Array<{ dateGroup: string; items: RenfordAccueilPlanningSlot[] }>
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
        <p className="text-xl font-semibold text-foreground">Mon planning</p>
        <Link
          href="/dashboard/renford/planning"
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
          description="Chaque jour de nouvelles opportunités arrivent sur Renford !"
          ctaLabel="Compléter mon profil"
          ctaHref="/dashboard/renford/profil?tab=profil"
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
                  const address = `${slot.etablissement.adresse}, ${slot.etablissement.codePostal} ${slot.etablissement.ville}`;
                  const tarif = slot.tarif ? `${slot.tarif} €` : undefined;

                  return (
                    <PlanningItem
                      key={`${slot.id}-${index}`}
                      title={disciplineLabel}
                      establishmentName={slot.etablissement.nom}
                      establishmentAddress={address}
                      dateLabel={formatWeekdayDayMonth(slot.date)}
                      timeLabel={`${slot.heureDebut} - ${slot.heureFin} · ${slot.totalHours}h`}
                      logoSrc={slot.etablissement.avatarChemin ?? undefined}
                      amountValue={tarif}
                      amountSuffix="HT"
                      hideDate
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
