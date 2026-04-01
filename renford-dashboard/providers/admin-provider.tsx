"use client";

import LoadingScreen from "@/components/common/loading-screen";
import useSession from "@/stores/session-store";
import { useCurrentUser } from "@/hooks/utilisateur";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = { children: ReactNode };

export default function AdminProvider({ children }: Props) {
  const { session } = useSession();
  const { data: user, isLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session && mounted) {
      router.push("/admin/connexion");
      return;
    }

    if (!isLoading && user && user.typeUtilisateur !== "administrateur") {
      router.push("/admin/connexion");
      return;
    }

    if (!isLoading && user && user.typeUtilisateur === "administrateur") {
      setMounted(true);
    }
  }, [session, user, isLoading, mounted, router]);

  useEffect(() => {
    if (!session) setMounted(true);
  }, [session]);

  if (!session) {
    router.push("/admin/connexion");
    return <LoadingScreen className="h-screen" />;
  }

  if (isLoading || !mounted) return <LoadingScreen className="h-screen" />;

  return <>{children}</>;
}
