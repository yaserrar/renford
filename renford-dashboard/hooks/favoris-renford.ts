import { getErrorMessage } from "@/lib/utils";
import { FavorisRenfordItem } from "@/types/favoris-renford";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const useFavorisRenford = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["favoris-renford"],
    queryFn: async () => {
      return (await axios.get("/etablissement/favoris"))
        .data as FavorisRenfordItem[];
    },
    staleTime: 1000 * 60,
  });
};

export const useCheckFavori = (profilRenfordId?: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["check-favori", profilRenfordId],
    queryFn: async () => {
      return (await axios.get(`/etablissement/favoris/${profilRenfordId}`))
        .data as { isFavori: boolean };
    },
    enabled: Boolean(profilRenfordId),
    staleTime: 1000 * 60,
  });
};

export const useAddFavori = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profilRenfordId: string) => {
      return (await axios.post(`/etablissement/favoris/${profilRenfordId}`))
        .data;
    },
    onSuccess: (_data, profilRenfordId) => {
      queryClient.invalidateQueries({ queryKey: ["favoris-renford"] });
      queryClient.invalidateQueries({
        queryKey: ["check-favori", profilRenfordId],
      });
      toast.success("Renford ajouté aux favoris");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useRemoveFavori = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profilRenfordId: string) => {
      return (await axios.delete(`/etablissement/favoris/${profilRenfordId}`))
        .data;
    },
    onSuccess: (_data, profilRenfordId) => {
      queryClient.invalidateQueries({ queryKey: ["favoris-renford"] });
      queryClient.invalidateQueries({
        queryKey: ["check-favori", profilRenfordId],
      });
      toast.success("Renford retiré des favoris");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useProposerMission = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profilRenfordId,
      missionId,
    }: {
      profilRenfordId: string;
      missionId: string;
    }) => {
      return (
        await axios.post(
          `/etablissement/favoris/${profilRenfordId}/proposer-mission`,
          { missionId },
        )
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      toast.success("Mission proposée au Renford");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
