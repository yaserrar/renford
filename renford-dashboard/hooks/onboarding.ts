import { getErrorMessage } from "@/lib/utils";
import {
  OnboardingContactSchema,
  OnboardingTypeSchema,
  OnboardingEtablissementSchema,
  OnboardingFavorisSchema,
} from "@/validations/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

// Hook pour mettre à jour les informations de contact (étape 1)
export const useUpdateContact = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingContactSchema) => {
      return (await axios.put("/onboarding/contact", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// Hook pour mettre à jour le type d'utilisateur (étape 2)
export const useUpdateType = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingTypeSchema) => {
      return (await axios.put("/onboarding/type", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// Hook pour mettre à jour le profil établissement (étape 3)
export const useUpdateProfilEtablissement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingEtablissementSchema) => {
      return (await axios.put("/onboarding/etablissement", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// Hook pour ajouter/mettre à jour les favoris (étape 4)
export const useUpdateFavoris = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingFavorisSchema) => {
      return (await axios.put("/onboarding/favoris", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// Hook pour terminer l'onboarding (étape 5)
export const useCompleteOnboarding = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/onboarding/complete")).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Bienvenue sur Renford !");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// Hook pour passer une étape (optionnel)
export const useSkipStep = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (etape: number) => {
      return (await axios.post("/onboarding/skip", { etape })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
