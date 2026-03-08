"use client";

import Loading from "@/components/common/loading";
import { useCurrentUser } from "@/hooks/utilisateur";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: me, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!me?.typeUtilisateur) return;
    if (me.typeUtilisateur === "etablissement") {
      router.replace("/dashboard/profile-etablissement");
      return;
    }

    if (me.typeUtilisateur === "renford") {
      router.replace("/dashboard/profile-renford");
      return;
    }

    router.replace("/dashboard/accueil");
  }, [me?.typeUtilisateur, router]);

  if (isLoading) {
    return <Loading className="mt-12" />;
  }

  return null;
}
