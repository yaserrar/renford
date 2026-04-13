import { getErrorMessage } from "@/lib/utils";
import { EvaluationRenford } from "@/types/evaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const useCreateEvaluation = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      missionRenfordId: string;
      note: number;
      commentaire?: string;
    }) => {
      return (
        await axios.post(
          `/etablissement/missions-renford/${data.missionRenfordId}/evaluation`,
          { note: data.note, commentaire: data.commentaire },
        )
      ).data as EvaluationRenford;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etablissement-missions"] });
      queryClient.invalidateQueries({
        queryKey: ["etablissement-mission-details"],
      });
      toast.success("Évaluation envoyée");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
