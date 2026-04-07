"use client";

import { Paiement } from "@/types/paiement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import useAxios from "./axios";

// ─── Renford: Connect Account Status ─────────────────────────────────────────

export type ConnectAccountStatus = {
  hasAccount: boolean;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export const useConnectAccountStatus = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["connect-account-status"],
    queryFn: async () => {
      return (await axios.get("/paiement/connect/status"))
        .data as ConnectAccountStatus;
    },
    staleTime: 1000 * 60 /* 1 minute */,
  });
};

// ─── Renford: Create Connect Onboarding Link ────────────────────────────────

export const useCreateConnectOnboarding = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (options?: { returnUrl?: string } | void) => {
      const params =
        options && "returnUrl" in options && options.returnUrl
          ? `?returnUrl=${encodeURIComponent(options.returnUrl)}`
          : "";
      return (await axios.post(`/paiement/connect/onboarding${params}`))
        .data as {
        url: string;
      };
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// ─── Renford: Create Connect Dashboard Link ─────────────────────────────────

export const useCreateConnectDashboardLink = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/paiement/connect/dashboard")).data as {
        url: string;
      };
    },
    onSuccess: (data) => {
      window.open(data.url, "_blank");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// ─── Établissement: Create Checkout Session ──────────────────────────────────

export const useCreateCheckoutSession = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (missionId: string) => {
      return (await axios.post("/paiement/checkout", { missionId })).data as {
        url: string;
      };
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// ─── Shared: Mission Payment Status ──────────────────────────────────────────

export type MissionPaymentStatusResponse = {
  hasPaiement: boolean;
  paiement: Paiement | null;
};

export const useMissionPaymentStatus = (missionId: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["mission-payment-status", missionId],
    queryFn: async () => {
      return (await axios.get(`/paiement/mission/${missionId}`))
        .data as MissionPaymentStatusResponse;
    },
    enabled: !!missionId,
    staleTime: 1000 * 30,
  });
};

// ─── Shared: Payment History ─────────────────────────────────────────────────

export type PaiementWithMission = Paiement & {
  mission: {
    id: string;
    specialitePrincipale: string;
    dateDebut: string;
    dateFin: string;
    etablissement: {
      nom: string;
    };
  };
};

export const usePaymentHistory = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      return (await axios.get("/paiement/history"))
        .data as PaiementWithMission[];
    },
    staleTime: 1000 * 60,
  });
};
