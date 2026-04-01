"use client";

import { Filleul } from "@/types/parrainage";
import { InviteRenfordSchema } from "@/validations/parrainage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import useAxios from "./axios";

export const useFilleuls = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["filleuls"],
    queryFn: async () => {
      return (await axios.get("/parrainage/filleuls")).data as Filleul[];
    },
    staleTime: 1000 * 60,
  });
};

export const useInviteRenford = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteRenfordSchema) => {
      return (await axios.post("/parrainage/inviter", data)).data as {
        message: string;
      };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Invitation envoyée avec succès");
      queryClient.invalidateQueries({ queryKey: ["filleuls"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
