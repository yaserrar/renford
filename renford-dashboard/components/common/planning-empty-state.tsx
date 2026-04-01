"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type Props = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function PlanningEmptyState({
  title = "Le planning est encore vide... mais plus pour longtemps 🚀",
  description,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl bg-white p-4 md:p-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <p className="text-lg md:text-xl font-bold text-foreground">{title}</p>
        {description && (
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        )}
        {ctaLabel && ctaHref && (
          <Button
            asChild
            variant="secondary"
            className="mt-6 rounded-full px-6 py-3 text-sm font-semibold"
          >
            <Link href={ctaHref}>
              {ctaLabel.includes("mission") && (
                <Plus className="mr-1.5 h-4 w-4" />
              )}
              {ctaLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
