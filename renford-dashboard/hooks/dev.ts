import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";
import { getErrorMessage } from "@/lib/utils";

/**
 * Supprime le profil et remet l'onboarding à l'étape 1
 */
export const useDevResetOnboarding = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/dev/reset-onboarding")).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("DEV: Onboarding réinitialisé (profil supprimé)");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

/**
 * Remet l'onboarding à l'étape 3 (début du profil sélectionné)
 */
export const useDevResetToStepThree = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/dev/reset-to-step-three")).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("DEV: Onboarding remis à l'étape 3");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
