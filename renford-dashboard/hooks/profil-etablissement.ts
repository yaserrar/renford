import { getErrorMessage } from "@/lib/utils";
import {
  CreateEtablissementSiteSchema,
  UpdateEtablissementSiteSchema,
} from "@/validations/etablissement";
import {
  UpdateProfilEtablissementAvatarSchema,
  UpdateProfilEtablissementCouvertureSchema,
  UpdateProfilEtablissementIdentiteSchema,
  UpdateProfilEtablissementInfosSchema,
} from "@/validations/profil-etablissement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const useUpdateProfilEtablissementCouverture = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilEtablissementCouvertureSchema) => {
      return (await axios.put("/profil-etablissement/couverture", data)).data;
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

export const useUpdateProfilEtablissementAvatar = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilEtablissementAvatarSchema) => {
      return (await axios.put("/profil-etablissement/avatar", data)).data;
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

export const useUpdateProfilEtablissementInfos = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilEtablissementInfosSchema) => {
      return (await axios.put("/profil-etablissement/infos", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profil établissement mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateProfilEtablissementIdentite = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilEtablissementIdentiteSchema) => {
      return (await axios.put("/profil-etablissement/identite", data)).data;
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

export const useCreateEtablissementSite = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEtablissementSiteSchema) => {
      return (await axios.post("/profil-etablissement/etablissements", data))
        .data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Établissement ajouté");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUpdateEtablissementSite = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      etablissementId,
      data,
    }: {
      etablissementId: string;
      data: UpdateEtablissementSiteSchema;
    }) => {
      return (
        await axios.put(
          `/profil-etablissement/etablissements/${etablissementId}`,
          data,
        )
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Établissement mis à jour");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
