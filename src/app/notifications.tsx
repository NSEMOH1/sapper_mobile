import { useAuthStore } from "@/hooks/useAuth";
import { useNotifications, useMarkRead, useMarkUnread } from "@/hooks/useNotifications";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
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

export default function NotificationsScreen() {
  const { colors } = useTheme();
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
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[s.title, { color: colors.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>{unreadCount} unread</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => refetch()} style={s.refreshBtn}>
          <Ionicons name="refresh-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !notifications || notifications.length === 0 ? (
        <View style={s.center}>
          <View style={[s.emptyIcon, { backgroundColor: colors.backgroundElement }]}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.border} />
          </View>
          <Text style={[s.emptyTitle, { color: colors.text }]}>No notifications yet</Text>
          <Text style={[s.emptySub, { color: colors.textSecondary }]}>We'll let you know when something arrives</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
        >
          {notifications.map((notif) => {
            const isUnread = notif.status === "UNREAD";
            const icon = typeIcons[notif.type] ?? "information-circle-outline";

            return (
              <TouchableOpacity
                key={notif.id}
                style={[
                  s.card,
                  { backgroundColor: colors.card },
                  isUnread && [s.cardUnread, { backgroundColor: colors.background, borderColor: colors.border }],
                ]}
                activeOpacity={0.7}
                onPress={() => handleToggle(notif.id, notif.status)}
              >
                <View style={[s.iconWrap, { backgroundColor: colors.primaryLight }, isUnread && { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={icon} size={20} color={colors.primary} />
                </View>

                <View style={s.cardBody}>
                  <View style={s.cardTop}>
                    <Text
                      style={[s.cardTitle, { color: colors.textSecondary }, isUnread && { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {notif.title}
                    </Text>
                    <Text style={[s.cardTime, { color: colors.textSecondary }]}>{timeAgo(notif.createdAt)}</Text>
                  </View>
                  <Text
                    style={[s.cardMessage, { color: colors.textSecondary }, isUnread && { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {notif.message}
                  </Text>
                </View>

                {isUnread && <View style={[s.unreadDot, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
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
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  refreshBtn: { padding: 4 },
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    flex: 1,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
  },
  cardMessage: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginLeft: 8,
  },
});
