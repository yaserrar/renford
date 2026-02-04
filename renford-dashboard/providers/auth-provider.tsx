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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session && mounted) {
      router.push("/dashboard/accueil");
    }
  }, [session, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingScreen className="h-screen" />;
  return <>{children}</>;
};

export default AuthProvider;
