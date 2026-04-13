"use client";

import LoadingScreen from "@/components/common/loading-screen";
import useSession from "@/stores/session-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { session } = useSession();
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !session) return;
    // Redirect to the correct home based on the stored user type.
    // Admin users visiting /connexion get sent to the admin dashboard.
    if (session.utilisateur.typeUtilisateur === "administrateur") {
      router.push("/admin/accueil");
    } else {
      router.push("/dashboard/accueil");
    }
  }, [hydrated, session, router]);

  if (!hydrated) return <LoadingScreen className="h-screen" />;
  return <>{children}</>;
};

export default AuthProvider;
