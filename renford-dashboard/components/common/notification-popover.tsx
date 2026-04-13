"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Building2,
  CreditCard,
  Handshake,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/hooks/notification";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types/notification";
import type { SourceNotification } from "@/types/notification";
import { useSidebar } from "../ui/sidebar";

const getSourceIcon = (source: SourceNotification) => {
  if (source === "missions") return Handshake;
  if (source === "mission_renfords") return UserRound;
  if (source === "etablissements") return Building2;
  if (source === "renfords") return UserRound;
  if (source === "paiements") return CreditCard;
  return Bell;
};

const NotificationPopover = () => {
  const router = useRouter();
  const { open: sidebarOpen } = useSidebar();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<NotificationItem[]>([]);
  const limit = 10;

  const unreadQuery = useUnreadNotificationsCount();
  const notificationsQuery = useNotifications(page, limit);
  const markOneReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const unreadCount = unreadQuery.data?.count ?? 0;
  const items = notificationsQuery.data?.data ?? [];
  const pagination = notificationsQuery.data?.pagination;

  const appendUniqueItems = (
    previous: NotificationItem[],
    nextItems: NotificationItem[],
  ) => {
    if (nextItems.length === 0) return previous;
    const merged = [...previous];
    let changed = false;

    for (const item of nextItems) {
      if (!merged.some((existing) => existing.id === item.id)) {
        merged.push(item);
        changed = true;
      }
    }

    return changed ? merged : previous;
  };

  useEffect(() => {
    if (page === 1) {
      setDisplayedItems((prev) => {
        if (
          prev.length === items.length &&
          prev.every((item, i) => item.id === items[i]?.id)
        ) {
          return prev;
        }

        return items;
      });
      return;
    }

    setDisplayedItems((prev) => appendUniqueItems(prev, items));
  }, [items, page]);

  useEffect(() => {
    if (!open) {
      setPage(1);
    }
  }, [open]);

  const onClickNotification = async (params: {
    id: string;
    targetPath: string | null;
    isRead: boolean;
  }) => {
    if (!params.isRead) {
      await markOneReadMutation.mutateAsync(params.id);
    }

    if (params.targetPath) {
      setOpen(false);
      router.push(params.targetPath);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={sidebarOpen ? "default" : "icon"}
          className={cn(
            "w-full justify-start rounded-sm px-4 relative",
            !sidebarOpen && "justify-center",
          )}
          //   className={cn(
          //     "relative flex items-center rounded-sm text-sm font-normal text-gray-500 transition-colors hover:bg-gray-100 active:bg-gray-300 focus-visible:outline-none",
          //     !sidebarOpen
          //       ? "size-8 justify-center p-0"
          //       : "w-full justify-start px-3 py-2.5",
          //   )}
        >
          <Bell
            className={cn("h-4 w-4 text-gray-500", !!sidebarOpen && "mr-1")}
            strokeWidth={2}
          />
          {!!sidebarOpen && (
            <p className="text-gray-500 font-normal text-base">Notifications</p>
          )}
          {unreadCount > 0 && (
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white",
                !sidebarOpen ? "absolute -right-1 -top-1" : "ml-auto",
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="left" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs"
            disabled={markAllReadMutation.isPending || unreadCount === 0}
            onClick={() => markAllReadMutation.mutate()}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Tout lire
          </Button>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {notificationsQuery.isLoading ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Chargement...
            </p>
          ) : displayedItems.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Aucune notification
            </p>
          ) : (
            <div className="divide-y">
              {displayedItems.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    onClickNotification({
                      id: notification.id,
                      targetPath: notification.targetPath,
                      isRead: notification.lu,
                    })
                  }
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors hover:bg-secondary/5",
                    !notification.lu && "bg-secondary/10",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    {(() => {
                      const SourceIcon = getSourceIcon(notification.source);
                      return (
                        <div className="mt-0.5 rounded-md bg-secondary/20 p-1.5 text-secondary-dark">
                          <SourceIcon className="h-3.5 w-3.5" />
                        </div>
                      );
                    })()}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-secondary-dark">
                        {notification.titre}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.page < pagination.totalPages && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setPage((value) => value + 1)}
            >
              Charger plus
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
