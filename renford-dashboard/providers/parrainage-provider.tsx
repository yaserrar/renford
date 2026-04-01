"use client";

import useParrainageStore from "@/stores/parrainage-store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ParrainageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { setParrainId } = useParrainageStore();

  useEffect(() => {
    const parrainId = searchParams.get("parrainId");
    if (parrainId) {
      setParrainId(parrainId);
    }
  }, [searchParams, setParrainId]);

  return <>{children}</>;
}
