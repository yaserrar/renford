"use client";

import { Info } from "lucide-react";

export default function PlanInfoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-primary-light border border-primary-dark/20 px-5 py-2 justify-center">
      <p className="text-sm text-foreground">
        Sans abonnement,{" "}
        <span className="font-semibold">vous payez à chaque mission.</span> Dès
        plusieurs missions par mois,{" "}
        <span className="font-semibold">
          un abonnement devient plus avantageux.
        </span>
      </p>
    </div>
  );
}
