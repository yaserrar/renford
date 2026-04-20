import { getErrorMessage } from "@/lib/utils";
import {
  EtablissementMissionsTab,
  EtablissementPlanningResponse,
  MissionDetailsEtablissement,
  MissionEtablissement,
  RenfordPlanningSlot,
} from "@/types/mission";
import {
  MissionRenfordDetails,
  MissionRenfordListItem,
  RenfordMissionsTab,
} from "@/types/mission-renford";
import { CreateMissionPayloadSchema } from "@/validations/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";
import { useCurrentUser } from "./utilisateur";

type CreateMissionResponse = {
  id: string;
  statut: string;
};

export const useCreateMission = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMissionPayloadSchema) => {
      return (await axios.post("/etablissement/missions", data))
        .data as CreateMissionResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      if (data.statut === "ajouter_mode_paiement") {
        toast.info(
          "Mission créée — configurez votre mode de paiement pour lancer la recherche",
        );
      } else {
        toast.success("Mission créée et mise en recherche");
      }
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useActivatePendingMissions = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/etablissement/missions/activate-pending"))
        .data as { activated: number };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details"],
      });
      if (data.activated > 0) {
        toast.success(
          `${data.activated} mission${data.activated > 1 ? "s" : ""} activée${data.activated > 1 ? "s" : ""} et mise${data.activated > 1 ? "s" : ""} en recherche`,
        );
      }
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

export const useTriggerManualMissionSearchByEtablissement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ missionId }: { missionId: string }) => {
      return (
        await axios.post(
          `/etablissement/missions/${missionId}/rechercher-renfords`,
        )
      ).data as {
        missionId: string;
        totalEligible: number;
        queued: number;
        proposed: number;
        dateDerniereRechercheRenford: string;
        source: "manuel";
      };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
      toast.success("Recherche manuelle lancée avec succès");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useMarkMissionTermineeByEtablissement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ missionId }: { missionId: string }) => {
      return (await axios.post(`/etablissement/missions/${missionId}/terminer`))
        .data as { id: string; statut: string };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success("Mission marquée comme terminée");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useClotureMissionByEtablissement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ missionId }: { missionId: string }) => {
      return (await axios.post(`/etablissement/missions/${missionId}/cloturer`))
        .data as { id: string; statut: string };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success("Mission clôturée");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useCancelMissionByEtablissement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ missionId }: { missionId: string }) => {
      return (await axios.post(`/etablissement/missions/${missionId}/annuler`))
        .data as { id: string; statut: string };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success("Mission annulée");
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

// ─── Signature hooks ────────────────────────────

type SignatureResponse = {
  missionRenfordId: string;
  statut: string;
  signatureId: string;
};

export const useSignContractByRenford = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      signatureImage,
    }: {
      missionId: string;
      signatureImage: string;
    }) => {
      return (
        await axios.post(`/renford/missions/${missionId}/signature`, {
          signatureImage,
        })
      ).data as SignatureResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["renford-missions"] });
      queryClient.invalidateQueries({
        queryKey: ["renford-mission-details", variables.missionId],
      });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useSignContractByEtablissement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      missionRenfordId,
      signatureImage,
    }: {
      missionId: string;
      missionRenfordId: string;
      signatureImage: string;
    }) => {
      return (
        await axios.post(
          `/etablissement/missions/${missionId}/renfords/${missionRenfordId}/signature`,
          { signatureImage },
        )
      ).data as SignatureResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

type MissionDocumentType =
  | "facture_prestation"
  | "facture_commission"
  | "contrat_prestation"
  | "attestation_mission";

const downloadBlobAsFile = (blob: Blob, fallbackName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fallbackName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const useDownloadMissionDocumentByRenford = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({
      missionId,
      documentType,
    }: {
      missionId: string;
      documentType: MissionDocumentType;
    }) => {
      const response = await axios.get(
        `/renford/missions/${missionId}/documents/${documentType}/download`,
        { responseType: "blob" },
      );
      return response.data as Blob;
    },
    onSuccess: (blob, variables) => {
      downloadBlobAsFile(
        blob,
        `${variables.documentType}-${variables.missionId}.pdf`,
      );
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useDownloadMissionDocumentByEtablissement = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({
      missionId,
      missionRenfordId,
      documentType,
    }: {
      missionId: string;
      missionRenfordId: string;
      documentType: MissionDocumentType;
    }) => {
      const response = await axios.get(
        `/etablissement/missions/${missionId}/renfords/${missionRenfordId}/documents/${documentType}/download`,
        { responseType: "blob" },
      );
      return response.data as Blob;
    },
    onSuccess: (blob, variables) => {
      downloadBlobAsFile(
        blob,
        `${variables.documentType}-${variables.missionId}.pdf`,
      );
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useSetVisioLink = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      missionRenfordId,
    }: {
      missionId: string;
      missionRenfordId: string;
    }) => {
      return (
        await axios.post(
          `/etablissement/missions/${missionId}/renfords/${missionRenfordId}/visio`,
        )
      ).data as { lienVisio: string };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details", variables.missionId],
      });
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

// ─── Pending missions count (renford: nouveau / etablissement: en_recherche) ──

export const usePendingMissionsCount = () => {
  const axios = useAxios();
  const { data: currentUser } = useCurrentUser();

  const endpoint =
    currentUser?.typeUtilisateur === "renford"
      ? "/renford/missions/pending-count"
      : "/etablissement/missions/pending-count";

  return useQuery({
    queryKey: ["pending-missions-count", currentUser?.typeUtilisateur],
    queryFn: async () => {
      return (await axios.get(endpoint)).data as {
        count: number;
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 30,
  });
};
