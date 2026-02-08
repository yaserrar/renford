"use client";

import { ReactNode } from "react";
import { OnboardingProgress } from "./onboarding-progress";
import { H2 } from "@/components/ui/typography";
import { Logo } from "@/components/common/logo";

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
    <main className="min-h-screen bg-white md:bg-secondary-background flex flex-col">
      {/* Header avec logo et barre de progression */}
      <div className="w-full fixed top-0 z-10">
        <header className="w-full bg-white border-b border-gray-200 py-4 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <Logo />
          </div>
        </header>
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Contenu principal */}
      <div className="w-full flex justify-center p-4 md:p-6 mt-32">
        <div className="bg-white md:rounded-3xl md:border md:border-gray-100 p-6 md:p-8 md:w-xl">
          <div className="text-center mb-8">
            <H2>{title}</H2>
            {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
