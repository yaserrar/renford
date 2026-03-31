import { getErrorMessage } from "@/lib/utils";
import {
  EtablissementMissionsTab,
  MissionDetailsEtablissement,
  MissionEtablissement,
} from "@/types/mission";
import {
  CreateMissionPayloadSchema,
  FinalizeMissionPaymentSchema,
} from "@/validations/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      return (await axios.post("/etablissement/missions", data))
        .data as CreateMissionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success("Mission créée et mise en recherche");
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
      return (
        await axios.post(`/etablissement/missions/${missionId}/paiement`, data)
      ).data as FinalizeMissionPaymentResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success("Mode de paiement enregistré et mission mise en recherche");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useGteEtablissementMissionsByTab = (
  tab?: EtablissementMissionsTab,
) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["etablissement-missions", tab ?? "all"],
    queryFn: async () => {
      const data = (
        await axios.get("/etablissement/missions", {
          params: tab ? { tab } : undefined,
        })
      ).data as MissionEtablissement[];

      return data;
    },
    staleTime: 1000 * 60,
  });
};

export const useEtablissementMissionDetails = (missionId?: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["etablissement-mission-details", missionId],
    queryFn: async () => {
      return (await axios.get(`/etablissement/missions/${missionId}`))
        .data as MissionDetailsEtablissement;
    },
    enabled: Boolean(missionId),
    staleTime: 1000 * 60,
  });
};
