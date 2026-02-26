"use client";

import { useCurrentUser } from "@/hooks/utilisateur";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccueilPage() {
  const router = useRouter();
  const { data: currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading || !currentUser) return;

    if (currentUser.typeUtilisateur === "etablissement") {
      router.replace("/dashboard/etablissement/accueil");
      return;
    }

    router.replace("/dashboard/renford/accueil");
  }, [currentUser, isLoading, router]);

  return <main className="min-h-screen bg-background" />;
}
