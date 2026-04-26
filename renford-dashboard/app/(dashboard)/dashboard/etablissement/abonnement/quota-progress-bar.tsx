"use client";

import { Info } from "lucide-react";

interface QuotaProgressBarProps {
  missionsUsed: number;
  quotaTotal: number;
  planName: string;
}

export default function QuotaProgressBar({
  missionsUsed,
  quotaTotal,
  planName,
}: QuotaProgressBarProps) {
  const isUnlimited = quotaTotal === 0;
  const percentage = isUnlimited
    ? Math.min((missionsUsed / 100) * 100, 100)
    : Math.min((missionsUsed / quotaTotal) * 100, 100);

  return (
    <div className="py-3 space-y-3">
      <p className="text-xl text-foreground font-bold">
        Volume de missions : {planName}
      </p>
      <div className="flex items-center gap-3">
        <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden flex-1">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(to right, #4295ff, #232e65)",
            }}
          />
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
          <Info className="size-4" />
          <span>
            <span className="font-semibold text-foreground">
              {missionsUsed}
            </span>
            /{isUnlimited ? "∞" : quotaTotal} missions utilisées
          </span>
        </div>
      </div>
    </div>
  );
}
