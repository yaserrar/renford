import { getErrorMessage } from "@/lib/utils";
import type {
  NotificationsPaginatedResponse,
  UnreadNotificationsCountResponse,
} from "@/types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "./axios";

export const useNotifications = (page = 1, limit = 10) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      return (await axios.get("/notifications", { params: { page, limit } }))
        .data as NotificationsPaginatedResponse;
    },
    staleTime: 1000 * 20,
  });
};

export const useUnreadNotificationsCount = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      return (await axios.get("/notifications/unread-count"))
        .data as UnreadNotificationsCountResponse;
    },
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 60 * 5, // auto-refetch every 5 minutes
  });
};

export const useMarkNotificationRead = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return (await axios.patch(`/notifications/${notificationId}/read`)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error?.response?.data?.message));
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const axios = useAxios();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await axios.patch("/notifications/read-all")).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      toast.success("Notifications marquées comme lues");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error?.response?.data?.message));
    },
  });
};
