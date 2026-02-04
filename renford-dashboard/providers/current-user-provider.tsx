"use client";

import Error from "@/components/common/error";
import LoadingScreen from "@/components/common/loading-screen";
import { useCurrentUser } from "@/hooks/utilisateur";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const CurrentUserProvider = ({ children }: Props) => {
  const { isError, isLoading } = useCurrentUser();

  if (isLoading) return <LoadingScreen className="h-screen" />;
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
