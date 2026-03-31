import { getErrorMessage } from "@/lib/utils";
import { PublicProfilRenford } from "@/types/profil-renford";
import {
  UpdateProfilRenfordAvatarSchema,
  UpdateProfilRenfordCouvertureSchema,
  UpdateProfilRenfordDiplomesSchema,
  UpdateProfilRenfordDisponibilitesSchema,
  UpdateProfilRenfordDescriptionSchema,
  UpdateProfilRenfordExperiencesSchema,
  UpdateProfilRenfordIdentiteSchema,
  UpdateProfilRenfordInfosSchema,
  UpdateProfilRenfordPortfolioSchema,
  UpdateProfilRenfordQualificationsSchema,
} from "@/validations/profil-renford";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const usePublicProfilRenford = (profilRenfordId?: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["public-profil-renford", profilRenfordId],
    queryFn: async () => {
      return (
        await axios.get(`/profil-renford/public/${profilRenfordId}`)
      ).data as PublicProfilRenford;
    },
    enabled: Boolean(profilRenfordId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfilRenfordCouverture = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordCouvertureSchema) => {
      return (await axios.put("/profil-renford/couverture", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Image de couverture mise à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordAvatar = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordAvatarSchema) => {
      return (await axios.put("/profil-renford/avatar", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Avatar mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordInfos = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordInfosSchema) => {
      return (await axios.put("/profil-renford", data)).data;
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

export const useUpdateProfilRenfordDescription = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordDescriptionSchema) => {
      return (await axios.put("/profil-renford/description", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Description mise à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordDisponibilites = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordDisponibilitesSchema) => {
      return (await axios.put("/profil-renford/disponibilites", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Disponibilités mises à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordExperiences = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordExperiencesSchema) => {
      return (await axios.put("/profil-renford/experiences", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Expériences mises à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordDiplomes = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordDiplomesSchema) => {
      return (await axios.put("/profil-renford/diplomes", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Diplômes mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordPortfolio = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordPortfolioSchema) => {
      return (await axios.put("/profil-renford/portfolio", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Portfolio mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordQualifications = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordQualificationsSchema) => {
      return (await axios.put("/profil-renford/qualifications", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Qualifications mises à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilRenfordIdentite = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilRenfordIdentiteSchema) => {
      return (await axios.put("/profil-renford/identite", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Informations personnelles mises à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
