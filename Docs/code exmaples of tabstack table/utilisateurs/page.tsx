"use client";

import Error from "@/components/common/error";
import Loading from "@/components/common/loading";
import { DataTable } from "@/components/table/data-table";
import { useGetUtilisateurs } from "@/hooks/utilisateurs";
import { columns } from "./columns";
import { useMemo } from "react";

export default function UtilisateursPage() {
  const { data = [], isLoading, isError } = useGetUtilisateurs();

  const filteredData = useMemo(
    () => data.filter((user) => !user.supprimee),
    [data]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error />;
  }

  return <DataTable columns={columns} data={filteredData} />;
}
