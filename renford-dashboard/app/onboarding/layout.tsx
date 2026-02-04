import type { Metadata } from "next";
import { ReactNode } from "react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Onboarding - Renford",
  description: "Configurez votre profil Renford",
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white md:bg-primary-background flex flex-col">
      {/* Header avec logo et barre de progression */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="Renford"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        {children}
      </div>
    </main>
  );
}
