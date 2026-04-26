import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminEmailTemplateListItem,
  UpsertEmailTemplatePayload,
} from "@/types/email-template";
import useAxios from "./axios";

export const useAdminEmailTemplates = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin", "email-templates"],
    queryFn: async () => {
      return (await axios.get("/admin/email-templates"))
        .data as AdminEmailTemplateListItem[];
    },
  });
};

export const useAdminEmailTemplate = (type: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin", "email-templates", type],
    queryFn: async () => {
      return (await axios.get(`/admin/email-templates/${type}`))
        .data as AdminEmailTemplateListItem;
    },
    enabled: !!type,
  });
};

export const useUpsertEmailTemplate = (type: string) => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpsertEmailTemplatePayload) => {
      return (await axios.put(`/admin/email-templates/${type}`, data)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "email-templates"] });
    },
  });
};

export const useResetEmailTemplate = (type: string) => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.delete(`/admin/email-templates/${type}`)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "email-templates"] });
    },
  });
};
