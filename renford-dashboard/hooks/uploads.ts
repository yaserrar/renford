import { getErrorMessage } from "@/lib/utils";
import { FileSchema, ImageSchema } from "@/validations/uploads";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios, { config } from "./axios";

export const useUploadImage = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (data: ImageSchema) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("path", data.path);
      if (data.name) {
        formData.append("name", data.name);
      }
      return (await axios.post("/upload", formData, config)).data as {
        path: string;
      };
    },
    onSuccess: async () => {
      toast.success("Image chargée avec succès");
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useUploadFile = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (data: FileSchema) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("path", data.path);
      if (data.name) {
        formData.append("name", data.name);
      }
      return (await axios.post("/upload", formData, config)).data as {
        path: string;
      };
    },
    onSuccess: async () => {
      toast.success("Document chargé avec succès");
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
