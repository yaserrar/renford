import { getErrorMessage } from "@/lib/utils";
import {
  OnboardingContactSchema,
  OnboardingTypeSchema,
  OnboardingEtablissementSchema,
  OnboardingFavorisSchema,
  OnboardingRenfordIdentiteSchema,
  OnboardingRenfordProfilSchema,
  OnboardingRenfordQualificationsSchema,
  OnboardingRenfordBancaireSchema,
  OnboardingRenfordDisponibilitesSchema,
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

// ============================================================================
// Hooks spécifiques aux établissements
// ============================================================================

// Hook pour mettre à jour le profil établissement (étape 3)
export const useUpdateEtablissementProfil = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingEtablissementSchema) => {
      return (await axios.put("/onboarding/etablissement/profil", data)).data;
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
export const useUpdateEtablissementFavoris = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingFavorisSchema) => {
      return (await axios.put("/onboarding/etablissement/favoris", data)).data;
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

// Hook pour terminer l'onboarding établissement (étape 5)
export const useCompleteEtablissementOnboarding = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/onboarding/etablissement/complete")).data;
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

// Hook pour passer une étape établissement (optionnel)
export const useSkipEtablissementStep = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (etape: number) => {
      return (await axios.post("/onboarding/etablissement/skip", { etape }))
        .data;
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

// ============================================================================
// Hooks spécifiques aux Renfords
// ============================================================================

// Hook pour mettre à jour l'identité légale Renford (étape 3)
export const useUpdateRenfordIdentite = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingRenfordIdentiteSchema) => {
      return (await axios.put("/onboarding/renford/identite", data)).data;
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

// Hook pour mettre à jour le profil Renford (étape 4)
export const useUpdateRenfordProfil = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingRenfordProfilSchema) => {
      return (await axios.put("/onboarding/renford/profil", data)).data;
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

// Hook pour mettre à jour les qualifications Renford (étape 5)
export const useUpdateRenfordQualifications = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingRenfordQualificationsSchema) => {
      return (await axios.put("/onboarding/renford/qualifications", data)).data;
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

// Hook pour mettre à jour les infos bancaires Renford (étape 6)
export const useUpdateRenfordBancaire = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingRenfordBancaireSchema) => {
      return (await axios.put("/onboarding/renford/bancaire", data)).data;
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

// Hook pour mettre à jour les disponibilités Renford (étape 7)
export const useUpdateRenfordDisponibilites = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingRenfordDisponibilitesSchema) => {
      return (await axios.put("/onboarding/renford/disponibilites", data)).data;
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

// Hook pour terminer l'onboarding Renford (étape 8)
export const useCompleteRenfordOnboarding = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/onboarding/renford/complete")).data;
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

// Hook pour passer une étape Renford (optionnel)
export const useSkipRenfordStep = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (etape: number) => {
      return (await axios.post("/onboarding/renford/skip", { etape })).data;
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
