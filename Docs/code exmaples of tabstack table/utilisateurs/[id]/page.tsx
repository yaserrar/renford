"use client";

import Error from "@/components/common/error";
import Loading from "@/components/common/loading";
import { useGetUtilisateur } from "@/hooks/utilisateurs";
import { useParams } from "next/navigation";
import BaristaDetail from "./barista-details";
import AnnonceurDetail from "./annonceur-details";

export default function UtilisateurDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: user, isLoading, isError } = useGetUtilisateur(id);

  if (isLoading) return <Loading />;
  if (isError || !user) return <Error />;

  if (user.type === "barista") return <BaristaDetail user={user} />;
  if (user.type === "annonceur") return <AnnonceurDetail user={user} />;

  return <Error />;
}
