import { CurrentUser } from "@/types/utilisateur";
import {
  ChangePasswordSchema,
  UpdateNotificationSettingsSchema,
  UpdateProfileSchema,
} from "@/validations/utilisateur";
import { getErrorMessage } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

// Hook pour récupérer l'utilisateur courant
export const useCurrentUser = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return (await axios.get("/utilisateur/me")).data as CurrentUser;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileSchema) => {
      return (await axios.put("/utilisateur/profile", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profil mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (data: ChangePasswordSchema) => {
      return (await axios.put("/utilisateur/password", data)).data;
    },
    onSuccess: () => {
      toast.success("Mot de passe mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateNotificationSettings = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNotificationSettingsSchema) => {
      return (await axios.put("/utilisateur/notifications", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Préférences de notifications mises à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
