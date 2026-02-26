"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export type IndicatorMetric = {
  value: string;
  label: string;
};

type IndicatorsSectionProps = {
  indicators: {
    title: string;
    ctaLabel: string;
    metrics: IndicatorMetric[];
  }[];
};

export default function IndicatorsSection({
  indicators,
}: IndicatorsSectionProps) {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {indicators.map((indicator) => (
        <article
          key={indicator.title}
          className={cn("rounded-2xl bg-secondary-dark text-white px-4 py-5")}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">{indicator.title}</p>
            <button className="inline-flex items-center gap-1 text-xs underline underline-offset-2">
              {indicator.ctaLabel}
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {indicator.metrics.map((metric) => (
              <div
                key={`${indicator.title}-${metric.label}`}
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
