"use client";

import { ChevronRight } from "lucide-react";

const CARDS = [
  {
    title: "Demandes de missions",
    ctaLabel: "Voir le détail",
    metrics: [
      { value: "3", label: "en cours" },
      { value: "5", label: "en attente" },
      { value: "15", label: "réalisées cette année" },
    ],
  },
  {
    title: "Paiements",
    ctaLabel: "Suivre mes paiements",
    metrics: [
      { value: "1", label: "à régler" },
      { value: "2", label: "en attente" },
      { value: "4", label: "réglés ce mois" },
    ],
  },
];

export default function EtablissementIndicatorsSection() {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {CARDS.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl bg-secondary-dark text-white px-4 py-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">{card.title}</p>
            <button className="inline-flex items-center gap-1 text-xs underline underline-offset-2">
              {card.ctaLabel}
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {card.metrics.map((metric) => (
              <div
                key={`${card.title}-${metric.label}`}
                className="text-center"
              >
                <p className="text-3xl font-bold leading-none">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-white/85">{metric.label}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
