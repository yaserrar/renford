"use client";

import LoadingScreen from "@/components/common/loading-screen";
import useSession from "@/stores/session-store";
import { useCurrentAdminUser } from "@/hooks/admin-auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = { children: ReactNode };

export default function AdminProvider({ children }: Props) {
  const { session } = useSession();
  const { data: admin, isLoading, isError } = useCurrentAdminUser();
  // hydrated becomes true after first client-side effect — by then Zustand has read localStorage
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!session) {
      router.push("/admin/connexion");
      return;
    }

    if (!isLoading && isError) {
      router.push("/admin/connexion");
    }
  }, [hydrated, session, isLoading, isError, router]);

  // Show loading screen until hydrated; then while the /admin/me request is in flight
  if (!hydrated || (session && isLoading)) return <LoadingScreen className="h-screen" />;

  if (!session || !admin) return <LoadingScreen className="h-screen" />;

  return <>{children}</>;
}
