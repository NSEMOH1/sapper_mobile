import { useAuthStore } from "@/hooks/useAuth";
import { useNotifications, useMarkRead, useMarkUnread } from "@/hooks/useNotifications";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#213400";
const BG = "#F5F7FA";

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  LOAN: "cash-outline",
  SAVINGS: "wallet-outline",
  PAYMENT: "card-outline",
  WITHDRAWAL: "download-outline",
  SYSTEM: "information-circle-outline",
};

const typeColors: Record<string, string> = {
  LOAN: "#213400",
  SAVINGS: "#213400",
  PAYMENT: "#213400",
  WITHDRAWAL: "#213400",
  SYSTEM: "#213400",
};

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications(user?.id);
  const markRead = useMarkRead();
  const markUnread = useMarkUnread();

  const handleToggle = useCallback(
    (id: string, currentStatus: string) => {
      if (currentStatus === "UNREAD") {
        markRead.mutate(id);
      } else {
        markUnread.mutate(id);
      }
    },
    [markRead, markUnread],
  );

  const unreadCount = notifications?.filter((n) => n.status === "UNREAD").length ?? 0;

  return (
    <SafeAreaView style={s.container}>
      {/* ── Header ─────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <View>
          <Text style={s.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={s.subtitle}>{unreadCount} unread</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => refetch()} style={s.refreshBtn}>
          <Ionicons name="refresh-outline" size={22} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      ) : !notifications || notifications.length === 0 ? (
        <View style={s.center}>
          <View style={s.emptyIcon}>
            <Ionicons name="notifications-off-outline" size={40} color="#D1D5DB" />
          </View>
          <Text style={s.emptyTitle}>No notifications yet</Text>
          <Text style={s.emptySub}>We'll let you know when something arrives</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={ACCENT} />
          }
        >
          {notifications.map((notif) => {
            const isUnread = notif.status === "UNREAD";
            const icon = typeIcons[notif.type] ?? "information-circle-outline";
            const iconColor = typeColors[notif.type] ?? ACCENT;

            return (
              <TouchableOpacity
                key={notif.id}
                style={[s.card, isUnread && s.cardUnread]}
                activeOpacity={0.7}
                onPress={() => handleToggle(notif.id, notif.status)}
              >
                <View style={[s.iconWrap, isUnread && s.iconWrapUnread]}>
                  <Ionicons name={icon} size={20} color={iconColor} />
                </View>

                <View style={s.cardBody}>
                  <View style={s.cardTop}>
                    <Text style={[s.cardTitle, isUnread && s.cardTitleUnread]} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <Text style={s.cardTime}>{timeAgo(notif.createdAt)}</Text>
                  </View>
                  <Text style={[s.cardMessage, isUnread && s.cardMessageUnread]} numberOfLines={2}>
                    {notif.message}
                  </Text>
                </View>

                {isUnread && <View style={s.unreadDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: "center",
  },
  refreshBtn: { padding: 4 },

  // ── Empty ───────────────────────────────────────────────────
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
    textAlign: "center",
  },

  // ── Card ────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardUnread: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3FCF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconWrapUnread: {
    backgroundColor: "#E8F5E9",
  },
  cardBody: { flex: 1 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#4B5563",
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: {
    color: "#1A1A2E",
  },
  cardTime: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  cardMessage: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    lineHeight: 18,
  },
  cardMessageUnread: {
    color: "#374151",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
    marginTop: 6,
    marginLeft: 8,
  },
});
