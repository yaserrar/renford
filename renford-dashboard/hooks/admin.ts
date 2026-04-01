import { getErrorMessage } from "@/lib/utils";
import type {
  AdminListItem,
  AdminStats,
  AdminUserDetail,
  AdminUserListItem,
  ContactMessage,
} from "@/types/admin";
import type {
  CreateAdminSchema,
  UpdateAdminPasswordSchema,
  UpdateAdminSchema,
} from "@/validations/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

// ─── Admin management ────────────────────────────────────────

export const useAdmins = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-admins"],
    queryFn: async () => {
      return (await axios.get("/admin/admins")).data as AdminListItem[];
    },
    staleTime: 1000 * 60,
  });
};

export const useCreateAdmin = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAdminSchema) => {
      return (await axios.post("/admin/admins", data)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-admins"] });
      toast.success("Administrateur créé");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateAdmin = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adminId,
      data,
    }: {
      adminId: string;
      data: UpdateAdminSchema;
    }) => {
      return (await axios.put(`/admin/admins/${adminId}`, data)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-admins"] });
      toast.success("Administrateur mis à jour");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateAdminPassword = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({
      adminId,
      data,
    }: {
      adminId: string;
      data: UpdateAdminPasswordSchema;
    }) => {
      return (await axios.put(`/admin/admins/${adminId}/password`, data)).data;
    },
    onSuccess: () => {
      toast.success("Mot de passe mis à jour");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteAdmin = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (adminId: string) => {
      return (await axios.delete(`/admin/admins/${adminId}`)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-admins"] });
      toast.success("Administrateur supprimé");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── User management ─────────────────────────────────────────

export const useAdminUsers = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      return (await axios.get("/admin/users")).data as AdminUserListItem[];
    },
    staleTime: 1000 * 60,
  });
};

export const useAdminUserDetail = (userId: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-users", userId],
    queryFn: async () => {
      return (await axios.get(`/admin/users/${userId}`))
        .data as AdminUserDetail;
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
};

export const useToggleUserStatus = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      statut,
    }: {
      userId: string;
      statut: "actif" | "suspendu";
    }) => {
      return (await axios.put(`/admin/users/${userId}/status`, { statut }))
        .data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Statut mis à jour");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Stats ───────────────────────────────────────────────────

export const useAdminStats = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      return (await axios.get("/admin/stats")).data as AdminStats;
    },
    staleTime: 1000 * 60 * 2,
  });
};

// ─── Contact messages ────────────────────────────────────────

export const useAdminContactMessages = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      return (await axios.get("/admin/contact-messages"))
        .data as ContactMessage[];
    },
    staleTime: 1000 * 60,
  });
};

export const useMarkContactMessageTraite = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      return (await axios.put(`/admin/contact-messages/${messageId}/traiter`))
        .data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Message marqué comme traité");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
