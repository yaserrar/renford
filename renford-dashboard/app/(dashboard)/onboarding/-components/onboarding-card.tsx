"use client";

import { ReactNode } from "react";
import { OnboardingProgress } from "./onboarding-progress";

type Props = {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
};

export function OnboardingCard({
  children,
  currentStep,
  totalSteps = 5,
  title,
  subtitle,
}: Props) {
  return (
    <div className="w-full max-w-lg">
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

      <div className="bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}
