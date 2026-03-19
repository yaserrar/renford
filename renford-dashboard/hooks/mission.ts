import { getErrorMessage } from "@/lib/utils";
import {
  CreateMissionPayloadSchema,
  FinalizeMissionPaymentSchema,
} from "@/validations/mission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

type CreateMissionResponse = {
  id: string;
  statut: string;
};

type FinalizeMissionPaymentResponse = {
  id: string;
  statut: string;
  typePaiement: string;
};

export const useCreateMission = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMissionPayloadSchema) => {
      return (await axios.post("/missions", data))
        .data as CreateMissionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Mission créée. Finalisez maintenant le paiement");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useFinalizeMissionPayment = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      data,
    }: {
      missionId: string;
      data: FinalizeMissionPaymentSchema;
    }) => {
      return (await axios.post(`/missions/${missionId}/paiement`, data))
        .data as FinalizeMissionPaymentResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Paiement validé et demande envoyée");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
