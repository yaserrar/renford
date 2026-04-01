import { getErrorMessage } from "@/lib/utils";
import type { ContactMessageSchema } from "@/validations/contact";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const useCreateContactMessage = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (data: ContactMessageSchema) => {
      return (await axios.post("/contact", data)).data;
    },
    onSuccess: () => {
      toast.success("Message envoyé avec succès");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
