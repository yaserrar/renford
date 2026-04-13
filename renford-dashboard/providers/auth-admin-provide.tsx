"use client";

import LoadingScreen from "@/components/common/loading-screen";
import useSession from "@/stores/session-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

const AuthAdminProvider = ({ children }: Props) => {
  const { session } = useSession();
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !session) return;
    // Only bounce confirmed admins; non-admin sessions are ignored.
    if (session.utilisateur.typeUtilisateur === "administrateur") {
      router.push("/admin/accueil");
    }
  }, [hydrated, session, router]);

  if (!hydrated) return <LoadingScreen className="h-screen" />;
  return <>{children}</>;
};

export default AuthAdminProvider;
