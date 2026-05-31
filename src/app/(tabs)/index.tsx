import { getInitials } from "@/constants/data";
import LoanEnrollmentFlow from "@/features/loan-enrollment";
import { TransactionsModule } from "@/features/transaction";
import { useAuthStore } from "@/hooks/useAuth";
import { useBalances } from "@/hooks/useBalances";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
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

const ACCENT = "#213400";
const BG = "#F5F7FA";

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

  const savingsBalance = useMemo(() => Number(data?.savings_balance || 0), [data]);
  const loanBalance = useMemo(() => Number(data?.loan_balance || 0), [data]);
  const totalBalance = savingsBalance + loanBalance;

  const obscured = (n: number) => (hideBalance ? `₦${"•".repeat(Math.max(4, n.toString().length))}` : `₦${n.toLocaleString()}`);

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

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* ── Header ─────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>
              {getGreeting()},
            </Text>
            <Text style={s.userName}>{user?.first_name || "User"}</Text>
          </View>
          <View style={s.headerRight}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {getInitials(user?.first_name || "")}
              </Text>
            </View>
            <TouchableOpacity style={s.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#1A1A2E" />
              <View style={s.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Balance Card ────────────────────────────────── */}
        <View style={s.balanceCard}>
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
              <Ionicons
                name={hideBalance ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>
          <Text style={s.balanceSub}>Combined balance</Text>

          <View style={s.balanceRow}>
            <View style={s.balanceItem}>
              <View style={[s.balanceDot, { backgroundColor: "#4CAF50" }]} />
              <View>
                <Text style={s.balanceLabel}>Savings</Text>
                <Text style={s.balanceValue}>{obscured(savingsBalance)}</Text>
              </View>
            </View>
            <View style={s.balanceDivider} />
            <View style={s.balanceItem}>
              <View style={[s.balanceDot, { backgroundColor: "#EF4444" }]} />
              <View>
                <Text style={s.balanceLabel}>Loan</Text>
                <Text style={s.balanceValue}>{obscured(loanBalance)}</Text>
              </View>
            </View>
          </View>

          <View style={s.balanceActions}>
            <TouchableOpacity
              style={s.balanceActionBtn}
              onPress={() => router.push("/payments" as any)}
            >
              <Ionicons name="card-outline" size={16} color="#fff" />
              <Text style={s.balanceActionText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.balanceActionBtn, s.balanceActionOutline]}
              onPress={() => router.push("/payments" as any)}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color={ACCENT} />
              <Text style={[s.balanceActionText, { color: ACCENT }]}>Pay Off</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Actions ──────────────────────────────── */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={s.quickCard}
              onPress={() => handleQuickAction(action)}
              activeOpacity={0.7}
            >
              <View style={s.quickIcon}>
                <Ionicons name={action.icon as any} size={24} color={ACCENT} />
              </View>
              <Text style={s.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Loan Products ──────────────────────────────── */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Loan Products</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/loan" as any)}>
            <Text style={s.seeAll}>See All</Text>
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

        {/* ── Transactions ────────────────────────────────── */}
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
  container: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 32 },

  // ── Header ─────────────────────────────────────────────
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
    color: "#6B7280",
  },
  userName: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    marginTop: 2,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontFamily: "Poppins_700Bold" },
  notifBtn: { position: "relative", padding: 4 },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: BG,
  },

  // ── Balance Card ──────────────────────────────────────
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: ACCENT,
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
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  balanceItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  balanceDot: { width: 10, height: 10, borderRadius: 5 },
  balanceDivider: { width: 1, height: 32, backgroundColor: "#E5E7EB", marginHorizontal: 8 },
  balanceLabel: { fontSize: 11, fontFamily: "Poppins_400Regular", color: "#6B7280" },
  balanceValue: { fontSize: 15, fontFamily: "Poppins_700Bold", color: "#1A1A2E" },
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

  // ── Quick Actions ─────────────────────────────────────
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#F3FCF1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#1A1A2E",
  },

  // ── Loan Products ─────────────────────────────────────
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: ACCENT,
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
