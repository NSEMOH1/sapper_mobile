import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markNotificationUnread,
} from "@/services/api.service";

export function useNotifications(memberId: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.notifications.list(memberId ?? ""),
    queryFn: () => fetchNotifications(memberId!),
    enabled: Boolean(memberId),
  });
}

export function useUnreadCount(memberId: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(memberId ?? ""),
    queryFn: () => fetchUnreadCount(memberId!),
    enabled: Boolean(memberId),
    refetchInterval: 30000,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
