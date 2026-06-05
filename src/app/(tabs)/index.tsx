import { getInitials } from "@/constants/data";
import LoanEnrollmentFlow from "@/features/loan-enrollment";
import { TransactionsModule } from "@/features/transaction";
import { useAuthStore } from "@/hooks/useAuth";
import { useBalances } from "@/hooks/useBalances";
import { useTheme } from "@/hooks/use-theme";
import { useUnreadCount } from "@/hooks/useNotifications";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppIcon from '@/lib/useIcon';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const quickActions = [
  { icon: "card-outline" as const, label: "Pay", route: "/payments" },
  { icon: "piggy-bank-outline" as const, label: "Savings", route: "/(tabs)/savings" },
  { icon: "add-circle-outline" as const, label: "Loan", modal: true as const },
];

const loanProducts = [
  { id: 1, title: "Regular Loan", icon: "briefcase-outline" as const, bg: "#53B175" },
  { id: 2, title: "Housing Loan", icon: "home-outline" as const, bg: "#444012" },
  { id: 3, title: "Commodity Loan", icon: "cart-outline" as const, bg: "#057392" },
  { id: 4, title: "Emergency Loan", icon: "flash-outline" as const, bg: "#E07B3C" },
  { id: 5, title: "Home Appliance", icon: "tv-outline" as const, bg: "#060402" },
];

export default function HomeScreen() {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const { user } = useAuthStore();
  const { data, refetch } = useBalances();
  const { colors } = useTheme();
  const { data: unreadData } = useUnreadCount(user?.id);
  const unreadCount = unreadData?.count ?? 0;

  const savingsBalance = useMemo(() => Number(data?.savings_balance || 0), [data]);
  const loanBalance = useMemo(() => Number(data?.loan_balance || 0), [data]);
  const totalBalance = savingsBalance + loanBalance;

  const obscured = (n: number) => (hideBalance ? `\u20A6${"\u2022".repeat(Math.max(4, n.toString().length))}` : `\u20A6${n.toLocaleString()}`);

  const handleQuickAction = useCallback(
    (action: (typeof quickActions)[number]) => {
      if ("modal" in action) {
        setShowLoanModal(true);
      } else {
        router.push(action.route as any);
      }
    },
    [],
  );

  console.log("Home render", { user });

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[s.userName, { color: colors.text }]}>{user?.first_name || "User"}</Text>
          </View>
          <View style={s.headerRight}>
            <View style={[s.avatar, { backgroundColor: colors.primary }]}>
              <Text style={s.avatarText}>
                {getInitials(user?.first_name || "")}
              </Text>
            </View>
            <TouchableOpacity style={s.notifBtn} onPress={() => router.push("/notifications" as any)}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              {unreadCount > 0 && (
                <View style={[s.notifBadge, { borderColor: colors.background }]}>
                  <Text style={s.notifBadgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[s.balanceCard, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={s.balanceRefresh} onPress={() => refetch()}>
            <Ionicons name="refresh-outline" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={s.balanceTitleRow}>
            <Text style={s.balanceTitle}>Balance Overview</Text>
          </View>

          <View style={s.balanceTitleRow}>
          <Text style={s.balanceTotal}>
            {obscured(totalBalance)}
          </Text>
            <TouchableOpacity onPress={() => setHideBalance((v) => !v)} style={s.eyeBtn}>
              <AppIcon
                name={hideBalance ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>
          <Text style={s.balanceSub}>Combined balance</Text>

          <View style={[s.balanceRow, { backgroundColor: colors.card }]}>
            <View style={s.balanceItem}>
              <View style={[s.balanceDot, { backgroundColor: "#4CAF50" }]} />
              <View>
                <Text style={[s.balanceLabel, { color: colors.textSecondary }]}>Savings</Text>
                <Text style={[s.balanceValue, { color: colors.text }]}>{obscured(savingsBalance)}</Text>
              </View>
            </View>
            <View style={[s.balanceDivider, { backgroundColor: colors.border }]} />
            <View style={s.balanceItem}>
              <View style={[s.balanceDot, { backgroundColor: colors.error }]} />
              <View>
                <Text style={[s.balanceLabel, { color: colors.textSecondary }]}>Loan</Text>
                <Text style={[s.balanceValue, { color: colors.text }]}>{obscured(loanBalance)}</Text>
              </View>
            </View>
          </View>

          <View style={s.balanceActions}>
            <TouchableOpacity
              style={s.balanceActionBtn}
              onPress={() => router.push("/payments" as any)}
            >
              <AppIcon name="card-outline" size={16} color="#fff" />
              <Text style={s.balanceActionText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.balanceActionBtn, s.balanceActionOutline]}
              onPress={() => router.push("/payments" as any)}
            >
              <AppIcon name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={[s.balanceActionText, { color: colors.primary }]}>Pay Off</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[s.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={s.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[s.quickCard, { backgroundColor: colors.card }]}
              onPress={() => handleQuickAction(action)}
              activeOpacity={0.7}
            >
              <View style={[s.quickIcon, { backgroundColor: colors.primaryLight }]}>
                <AppIcon name={action.icon as any} size={24} color={colors.text} />
              </View>
              <Text style={[s.quickLabel, { color: colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.sectionHead}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Loan Products</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/loan" as any)}>
            <Text style={[s.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.loanGrid}>
          {loanProducts.slice(0, 4).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[s.loanCard, { backgroundColor: product.bg }]}
              activeOpacity={0.85}
              onPress={() => setShowLoanModal(true)}
            >
              <View style={s.loanIconWrap}>
                <Ionicons name={product.icon} size={20} color="#fff" />
              </View>
              <Text style={s.loanName} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={s.loanStatus}>
                {product.id === 1 ? "Active" : "Soon"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TransactionsModule
          limit={5}
          onViewAll={() => router.push("/transactions" as any)}
        />
      </ScrollView>

      <LoanEnrollmentFlow
        visible={showLoanModal}
        onClose={() => setShowLoanModal(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 32 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  userName: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginTop: 2,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontFamily: "Poppins_700Bold" },
  notifBtn: { position: "relative", padding: 4 },
  notifBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  notifBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_700Bold",
    lineHeight: 14,
  },

  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  balanceRefresh: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
    padding: 4,
  },
  balanceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  balanceTitle: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#ffffff",
  },
  eyeBtn: { padding: 4 },
  balanceTotal: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: "#f2f2f4",
  },
  balanceSub: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#ffffff",
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  balanceItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  balanceDot: { width: 10, height: 10, borderRadius: 5 },
  balanceDivider: { width: 1, height: 32, marginHorizontal: 8 },
  balanceLabel: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  balanceValue: { fontSize: 15, fontFamily: "Poppins_700Bold" },
  balanceActions: { flexDirection: "row", gap: 10 },
  balanceActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 12,
  },
  balanceActionOutline: {
    backgroundColor: "#F3FCF1",
    borderWidth: 1,
    borderColor: "#D1FAD1",
  },
  balanceActionText: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },

  sectionTitle: {
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },

  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  loanGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  loanCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    justifyContent: "space-between",
  },
  loanIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  loanName: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    marginBottom: 4,
  },
  loanStatus: {
    fontSize: 10,
    fontFamily: "Poppins_500Medium",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
