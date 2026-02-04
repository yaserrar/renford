"use client";

import Error from "@/components/common/error";
import LoadingScreen from "@/components/common/loading-screen";
import { useCurrentUser } from "@/hooks/utilisateur";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = { children: ReactNode };

const OnboardingProvider = ({ children }: Props) => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    const isOnboardingPage = pathname.startsWith("/onboarding");
    const isDashboardPage = pathname.startsWith("/dashboard");

    // Si l'utilisateur est en onboarding et n'est pas sur la page d'onboarding
    if (user.statut === "onboarding" && !isOnboardingPage) {
      // Rediriger vers l'étape appropriée selon le type d'utilisateur
      const etape = user.etapeOnboarding || 1;

      // Étapes 1 et 2 sont communes
      if (etape <= 2) {
        router.replace(`/onboarding/etape-${etape}`);
      } else {
        // Étapes spécifiques au type d'utilisateur
        if (user.typeUtilisateur === "renford") {
          // Renford: étapes 3-8
          router.replace(`/onboarding/etape-${etape}-renford`);
        } else {
          // Établissement: étapes 3-5
          router.replace(`/onboarding/etape-${etape}`);
        }
      }
      return;
    }

    // Si l'utilisateur a terminé l'onboarding et est sur la page d'onboarding
    if (user.statut === "actif" && isOnboardingPage) {
      router.replace("/dashboard");
      return;
    }

    // Si l'utilisateur est en attente de vérification et essaie d'accéder au dashboard
    if (user.statut === "en_attente_verification" && isDashboardPage) {
      router.replace("/verification-email");
      return;
    }
  }, [user, pathname, router]);

  if (isLoading) return <LoadingScreen className="h-screen" />;
  if (isError)
    return (
      <Error
        className="h-screen"
        message="Impossible de charger l'utilisateur actuel"
      />
    );

  return <>{children}</>;
};

export default OnboardingProvider;
