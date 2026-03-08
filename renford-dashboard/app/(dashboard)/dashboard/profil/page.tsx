"use client";

import { useCurrentUser } from "@/hooks/utilisateur";
import { Loader2 } from "lucide-react";
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
    return (
      <div className="container mx-auto flex items-center justify-center h-64 mt-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}
