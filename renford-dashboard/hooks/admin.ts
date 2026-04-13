import { getErrorMessage } from "@/lib/utils";
import type {
  AdminListItem,
  AdminMissionDetail,
  AdminMissionListItem,
  AdminStats,
  AdminUserDetail,
  AdminUserListItem,
  ContactMessage,
} from "@/types/admin";
import type {
  NotificationsPaginatedResponse,
  UnreadNotificationsCountResponse,
} from "@/types/notification";
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

export const useAdminMissionsByStatus = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-missions-by-status"],
    queryFn: async () => {
      return (await axios.get("/admin/stats/missions-by-status"))
        .data as Record<string, number>;
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminUsersByStatus = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-users-by-status"],
    queryFn: async () => {
      return (await axios.get("/admin/stats/users-by-status")).data as {
        byType: Array<{ type: string; count: number }>;
        byStatut: Array<{ statut: string; count: number }>;
      };
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminDailyInscriptions = (from: string, to: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-daily-inscriptions", from, to],
    queryFn: async () => {
      return (
        await axios.get("/admin/stats/daily-inscriptions", {
          params: { from, to },
        })
      ).data as { items: Array<{ date: string; count: number }> };
    },
    enabled: !!from && !!to,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminDailyMissions = (from: string, to: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-daily-missions", from, to],
    queryFn: async () => {
      return (
        await axios.get("/admin/stats/daily-missions", {
          params: { from, to },
        })
      ).data as { items: Array<{ date: string; count: number }> };
    },
    enabled: !!from && !!to,
    staleTime: 1000 * 60 * 2,
  });
};

// ─── Admin missions ──────────────────────────────────────────

export const useAdminMissions = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-missions"],
    queryFn: async () => {
      return (await axios.get("/admin/missions"))
        .data as AdminMissionListItem[];
    },
    staleTime: 1000 * 60,
  });
};

export const useAdminMissionDetail = (missionId: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-mission-detail", missionId],
    queryFn: async () => {
      return (await axios.get(`/admin/missions/${missionId}`))
        .data as AdminMissionDetail;
    },
    enabled: !!missionId,
    staleTime: 1000 * 60,
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

// ─── Admin notifications ───────────────────────────────────

export const useAdminNotifications = (page = 1, limit = 10) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-notifications", page, limit],
    queryFn: async () => {
      return (
        await axios.get("/admin/notifications", { params: { page, limit } })
      ).data as NotificationsPaginatedResponse;
    },
    staleTime: 1000 * 20,
  });
};

export const useAdminUnreadNotificationsCount = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["admin-notifications-unread-count"],
    queryFn: async () => {
      return (await axios.get("/admin/notifications/unread-count"))
        .data as UnreadNotificationsCountResponse;
    },
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
  });
};

export const useMarkAdminNotificationRead = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return (await axios.patch(`/admin/notifications/${notificationId}/read`))
        .data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: ["admin-notifications-unread-count"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useMarkAllAdminNotificationsRead = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.patch("/admin/notifications/read-all")).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: ["admin-notifications-unread-count"] });
      toast.success("Notifications marquées comme lues");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
