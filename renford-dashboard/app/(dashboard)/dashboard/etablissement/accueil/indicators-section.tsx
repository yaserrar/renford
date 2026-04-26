"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  indicators?: {
    missionsEnCours: number;
    missionsEnAttente: number;
    missionsRealisees: number;
    paiementsARegler: number;
    paiementsEnAttente: number;
    paiementsReglesCeMois: number;
  };
};

export default function EtablissementIndicatorsSection({ indicators }: Props) {
  const cards = [
    {
      title: "Mes missions",
      ctaLabel: "Voir le détail",
      ctaHref: "/dashboard/etablissement/missions",
      metrics: [
        { value: String(indicators?.missionsEnCours ?? 0), label: "en cours" },
        {
          value: String(indicators?.missionsEnAttente ?? 0),
          label: "en attente",
        },
        {
          value: String(indicators?.missionsRealisees ?? 0),
          label: "réalisées cette année",
        },
      ],
    },
    {
      title: "Paiements",
      ctaLabel: "Suivre mes paiements",
      ctaHref: "/dashboard/etablissement/paiement",
      metrics: [
        {
          value: String(indicators?.paiementsARegler ?? 0),
          label: "à régler",
          critical: (indicators?.paiementsARegler ?? 0) > 0,
        },
        {
          value: String(indicators?.paiementsEnAttente ?? 0),
          label: "en attente",
        },
        {
          value: String(indicators?.paiementsReglesCeMois ?? 0),
          label: "réglés ce mois",
        },
      ],
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl bg-[#02162E] text-white px-4 py-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">{card.title}</p>
            <Link
              href={card.ctaHref}
              className="inline-flex items-center gap-1 text-xs underline underline-offset-2"
            >
              {card.ctaLabel}
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {card.metrics.map((metric) => (
              <div
                key={`${card.title}-${metric.label}`}
                className="text-center"
              >
                {metric.critical ? (
                  <div className="mx-auto h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold leading-none">
                    {metric.value}
                  </div>
                ) : (
                  <p className="text-3xl font-bold leading-none">
                    {metric.value}
                  </p>
                )}
                <p className="mt-1 text-xs text-white/85">{metric.label}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
