import { getErrorMessage } from "@/lib/utils";
import {
  EtablissementMissionsTab,
  MissionEtablissement,
} from "@/types/mission";
import {
  CreateMissionPayloadSchema,
  FinalizeMissionPaymentSchema,
} from "@/validations/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

const parseDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeMissionDates = (
  mission: MissionEtablissement,
): MissionEtablissement => {
  const normalizedPlages = (mission.PlageHoraireMission ?? []).map((slot) => ({
    ...slot,
    date: parseDate(slot.date) ?? new Date(),
    dateCreation: parseDate(slot.dateCreation ?? null) ?? undefined,
  }));

  const normalizedEtablissement = mission.etablissement
    ? {
        ...mission.etablissement,
        dateCreation:
          parseDate(mission.etablissement.dateCreation as Date | string) ??
          new Date(),
        dateMiseAJour:
          parseDate(mission.etablissement.dateMiseAJour as Date | string) ??
          new Date(),
      }
    : mission.etablissement;

  return {
    ...mission,
    dateDebut: parseDate(mission.dateDebut) ?? new Date(),
    dateFin: parseDate(mission.dateFin) ?? new Date(),
    dateAutorisationDebit: parseDate(mission.dateAutorisationDebit),
    dateAutorisationPrelevement: parseDate(mission.dateAutorisationPrelevement),
    dateCreation: parseDate(mission.dateCreation ?? null) ?? undefined,
    dateMiseAJour: parseDate(mission.dateMiseAJour ?? null) ?? undefined,
    PlageHoraireMission: normalizedPlages,
    etablissement: normalizedEtablissement,
  };
};

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

export const useEtablissementMissionsByTab = (
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

      return data.map(normalizeMissionDates);
    },
    staleTime: 1000 * 60,
  });
};
