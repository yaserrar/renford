import { getErrorMessage } from "@/lib/utils";
import type {
  AbonnementCurrentResponse,
  AbonnementWithEvents,
  AdminAbonnementDetail,
  AdminAbonnementListItem,
} from "@/types/abonnement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

// ─── Établissement: current abonnement + quota ───────────────────────────────

export const useAbonnementActif = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["abonnement-current"],
    queryFn: async () => {
      return (await axios.get("/abonnements/current"))
        .data as AbonnementCurrentResponse;
    },
    staleTime: 1000 * 60,
  });
};

// ─── Établissement: history ───────────────────────────────────────────────────

export const useAbonnementHistory = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["abonnement-history"],
    queryFn: async () => {
      return (await axios.get("/abonnements/history"))
        .data as AbonnementWithEvents[];
    },
    staleTime: 1000 * 60,
  });
};

// ─── Établissement: checkout ──────────────────────────────────────────────────

export const useCreateCheckoutSession = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (
      plan: "echauffement" | "performance" | "competition",
    ) => {
      const res = await axios.post("/abonnements/checkout", { plan });
      return res.data as { url: string; sessionId: string };
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Établissement: cancel ────────────────────────────────────────────────────

export const useCancelAbonnement = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/abonnements/cancel")).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["abonnement-current"] });
      qc.invalidateQueries({ queryKey: ["abonnement-history"] });
      toast.success("Abonnement annulé avec succès");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Admin: list all abonnements ─────────────────────────────────────────────

export const useAdminAbonnements = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-abonnements"],
    queryFn: async () => {
      return (await axios.get("/admin/abonnements"))
        .data as AdminAbonnementListItem[];
    },
    staleTime: 1000 * 30,
  });
};

// ─── Admin: abonnement detail ─────────────────────────────────────────────────

export const useAdminAbonnementDetail = (abonnementId: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-abonnement", abonnementId],
    queryFn: async () => {
      return (await axios.get(`/admin/abonnements/${abonnementId}`))
        .data as AdminAbonnementDetail;
    },
    enabled: !!abonnementId,
    staleTime: 1000 * 30,
  });
};

// ─── Admin: set competition quote (price negotiated with Renford sales team) ──

export const useAdminSetCompetitionQuote = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      profilEtablissementId: string;
      prixMensuelHT: number;
    }) => {
      return (await axios.post("/admin/abonnements/competition", data)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-abonnements"] });
      toast.success("Devis Compétition enregistré");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

/** @deprecated Use useAdminSetCompetitionQuote instead */
export const useAdminCreateCompetitionAbonnement = useAdminSetCompetitionQuote;

// ─── Admin: cancel abonnement ─────────────────────────────────────────────────

export const useAdminCancelAbonnement = (abonnementId: string) => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post(`/admin/abonnements/${abonnementId}/cancel`))
        .data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-abonnements"] });
      qc.invalidateQueries({ queryKey: ["admin-abonnement", abonnementId] });
      toast.success("Abonnement annulé");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Admin: pause abonnement ──────────────────────────────────────────────────

export const useAdminPauseAbonnement = (abonnementId: string) => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post(`/admin/abonnements/${abonnementId}/pause`))
        .data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-abonnement", abonnementId] });
      toast.success("Abonnement mis en pause");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Admin: resume abonnement ─────────────────────────────────────────────────

export const useAdminResumeAbonnement = (abonnementId: string) => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post(`/admin/abonnements/${abonnementId}/resume`))
        .data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-abonnement", abonnementId] });
      toast.success("Abonnement repris");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Admin: update quota ──────────────────────────────────────────────────────

export const useAdminUpdateQuota = (abonnementId: string) => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (missionsUtilisees: number) => {
      return (
        await axios.patch(`/admin/abonnements/${abonnementId}/quota`, {
          missionsUtilisees,
        })
      ).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-abonnement", abonnementId] });
      toast.success("Quota mis à jour");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
