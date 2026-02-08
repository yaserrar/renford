"use client";

import Error from "@/components/common/error";
import LoadingScreen from "@/components/common/loading-screen";
import { useCurrentUser } from "@/hooks/utilisateur";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = { children: ReactNode };

const CurrentUserProvider = ({ children }: Props) => {
  const { data: user, isError, isLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    const isVerificationPage = pathname === "/verification-compte";
    const isOnboardingPage = pathname.startsWith("/onboarding");
    const isDashboardPage =
      pathname.startsWith("/dashboard") || pathname === "/";

    // Compte en attente de vérification → rediriger vers vérification
    if (user.statut === "en_attente_verification" && !isVerificationPage) {
      router.replace("/verification-compte");
      return;
    }

    // Compte vérifié mais en onboarding → rediriger vers onboarding
    if (user.statut === "onboarding" && !isOnboardingPage) {
      router.replace("/onboarding/etape-1");
      return;
    }

    // Compte actif mais sur page vérification/onboarding → rediriger vers dashboard
    if (user.statut === "actif") {
      if (isVerificationPage || isOnboardingPage) {
        router.replace("/dashboard/accueil");
        return;
      }
    }

    setMounted(true);
  }, [user, pathname, router]);

  if (isLoading || !mounted) return <LoadingScreen className="h-screen" />;
  if (isError)
    return (
      <Error
        className="h-screen"
        message="Impossible de charger l'utilisateur actuel"
      />
    );

  return <>{children}</>;
};
export default CurrentUserProvider;
