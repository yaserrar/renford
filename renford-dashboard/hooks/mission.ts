import { getErrorMessage } from "@/lib/utils";
import {
  EtablissementMissionsTab,
  EtablissementPlanningResponse,
  IndisponibiliteRenford,
  MissionDetailsEtablissement,
  MissionEtablissement,
  RenfordPlanningSlot,
} from "@/types/mission";
import {
  MissionRenfordDetails,
  MissionRenfordListItem,
  RenfordMissionsTab,
} from "@/types/mission-renford";
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

type RespondToMissionRenfordResponse = {
  missionRenfordId: string;
  statut: string;
};

export const useRespondToMissionRenford = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      missionRenfordId,
      response,
    }: {
      missionId: string;
      missionRenfordId: string;
      response: "attente_de_signature" | "refuse_par_etablissement";
    }) => {
      return (
        await axios.post(
          `/etablissement/missions/${missionId}/renfords/${missionRenfordId}/reponse`,
          { response },
        )
      ).data as RespondToMissionRenfordResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success(
        variables.response === "attente_de_signature"
          ? "Renford accepté, en attente de signature"
          : "Renford refusé",
      );
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// ─── Renford missions hooks ─────────────────────────────────

export const useRenfordMissions = (tab?: RenfordMissionsTab) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-missions", tab ?? "all"],
    queryFn: async () => {
      const data = (
        await axios.get("/renford/missions", {
          params: tab ? { tab } : undefined,
        })
      ).data as MissionRenfordListItem[];

      return data;
    },
    staleTime: 1000 * 60,
  });
};

export const useRenfordMissionDetails = (missionId?: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-mission-details", missionId],
    queryFn: async () => {
      return (await axios.get(`/renford/missions/${missionId}`))
        .data as MissionRenfordDetails;
    },
    enabled: Boolean(missionId),
    staleTime: 1000 * 60,
  });
};

type RespondToMissionProposalResponse = {
  missionRenfordId: string;
  statut: string;
};

export const useRespondToMissionProposal = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      response,
    }: {
      missionId: string;
      response: "selection_en_cours" | "refuse_par_renford";
    }) => {
      return (
        await axios.post(`/renford/missions/${missionId}/reponse`, {
          response,
        })
      ).data as RespondToMissionProposalResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["renford-missions"] });
      queryClient.invalidateQueries({
        queryKey: ["renford-mission-details", variables.missionId],
      });
      toast.success(
        variables.response === "selection_en_cours"
          ? "Candidature envoyée"
          : "Mission refusée",
      );
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// ─── Établissement planning hook ────────────────────────────

export const useEtablissementPlanning = (
  from?: string,
  to?: string,
  etablissementId?: string,
) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["etablissement-planning", from, to, etablissementId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (etablissementId) params.etablissementId = etablissementId;

      return (await axios.get("/etablissement/planning", { params }))
        .data as EtablissementPlanningResponse;
    },
    staleTime: 1000 * 60,
  });
};

// ─── Renford planning hooks ─────────────────────────────────

export const useRenfordPlanning = (from?: string, to?: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-planning", from, to],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;

      return (await axios.get("/renford/planning", { params }))
        .data as RenfordPlanningSlot[];
    },
    staleTime: 1000 * 60,
  });
};

export const useIndisponibilites = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-indisponibilites"],
    queryFn: async () => {
      return (await axios.get("/renford/indisponibilites"))
        .data as IndisponibiliteRenford[];
    },
    staleTime: 1000 * 60,
  });
};

export const useCreateIndisponibilite = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      dateDebut: string;
      dateFin: string;
      heureDebut?: string;
      heureFin?: string;
      journeeEntiere: boolean;
      repetition: string;
    }) => {
      return (await axios.post("/renford/indisponibilites", payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renford-indisponibilites"] });
      toast.success("Indisponibilité ajoutée");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteIndisponibilite = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (indisponibiliteId: string) => {
      return (
        await axios.delete(`/renford/indisponibilites/${indisponibiliteId}`)
      ).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renford-indisponibilites"] });
      toast.success("Indisponibilité supprimée");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
