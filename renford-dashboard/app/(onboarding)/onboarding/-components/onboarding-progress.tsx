"use client";

import { cn } from "@/lib/utils";

type Props = {
  currentStep: number;
  totalSteps: number;
};

export function OnboardingProgress({ currentStep, totalSteps }: Props) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mx-auto mb-8">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
