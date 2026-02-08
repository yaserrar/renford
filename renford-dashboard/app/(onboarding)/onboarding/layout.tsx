import type { Metadata } from "next";
import { ReactNode } from "react";
import Image from "next/image";
import { Logo } from "@/components/common/logo";

export const metadata: Metadata = {
  title: "Onboarding - Renford",
  description: "Configurez votre profil Renford",
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
