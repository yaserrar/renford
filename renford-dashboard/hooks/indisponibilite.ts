import { getErrorMessage } from "@/lib/utils";
import { IndisponibiliteRenford } from "@/types/indisponibilite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const useIndisponibilites = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-indisponibilites"],
    queryFn: async () => {
      return (await axios.get("/renford/indisponibilites"))
        .data as IndisponibiliteRenford[];
    },
    staleTime: 1000 * 60,
  });
};

export const useIndisponibilitesByMonth = (year: number, month: number) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-indisponibilites", year, month],
    queryFn: async () => {
      return (
        await axios.get("/renford/indisponibilites", {
          params: { year, month },
        })
      ).data as IndisponibiliteRenford[];
    },
    staleTime: 1000 * 60,
  });
};

export const useCreateIndisponibilite = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      dateDebut: string;
      dateFin: string;
      heureDebut?: string;
      heureFin?: string;
      journeeEntiere: boolean;
      repetition: string;
    }) => {
      return (await axios.post("/renford/indisponibilites", payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renford-indisponibilites"] });
      toast.success("Indisponibilité ajoutée");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteIndisponibilite = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (indisponibiliteId: string) => {
      return (
        await axios.delete(`/renford/indisponibilites/${indisponibiliteId}`)
      ).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renford-indisponibilites"] });
      toast.success("Indisponibilité supprimée");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
