import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LoanEnrollmentFlow from "@/features/loan-enrollment";
import { useAuthStore } from "@/hooks/useAuth";
import { useLoanBalances } from "@/hooks/useLoan";
import { router } from "expo-router";
import { getInitials } from "@/constants/data";

const BG = "#F5F7FA";
const ACCENT = "#213400";

export default function Loan() {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const { user } = useAuthStore();
  const { data, isLoading } = useLoanBalances();

  const summary = data?.summary;
  const loans = data?.loans ?? [];
  const categories = data?.categories ?? [];

  const formatCurrency = (n: number) => `₦${n.toLocaleString()}`;

  const handlePayment = () => router.push("/payments" as any);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Good afternoon,</Text>
          <Text style={s.userName}>{user?.first_name || "User"}</Text>
        </View>
        <View style={s.headerRight}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{getInitials(user?.first_name || "")}</Text>
          </View>
          <Ionicons name="notifications-outline" size={22} color="#1A1A2E" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* ── Stats Strip ────────────────────────────── */}
        {isLoading ? (
          <View style={s.loadingStrip}>
            <ActivityIndicator size="small" color={ACCENT} />
          </View>
        ) : (
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={s.statLabel}>Outstanding</Text>
              <Text style={s.statValue}>{formatCurrency(summary?.totalOutstanding ?? 0)}</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statLabel}>Active</Text>
              <Text style={s.statValue}>{summary?.activeLoans ?? 0}</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statLabel}>Paid</Text>
              <Text style={s.statValue}>{formatCurrency(summary?.totalPaid ?? 0)}</Text>
            </View>
          </View>
        )}

        {/* ── Balance Card ───────────────────────────── */}
        <View style={s.balanceCard}>
          <Text style={s.balanceCardLabel}>Loan Balance</Text>
          <Text style={s.balanceCardAmount}>
            {formatCurrency(summary?.totalOutstanding ?? 0)}
          </Text>

          <View style={s.progressWrap}>
            <View style={s.progressBar}>
              <View
                style={[
                  s.progressFill,
                  {
                    width: `${
                      summary && summary.totalOutstanding + summary.totalPaid > 0
                        ? Math.round(
                            (summary.totalPaid / (summary.totalOutstanding + summary.totalPaid)) * 100,
                          )
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
            <View style={s.progressLabels}>
              <Text style={s.progressLabel}>Paid: {formatCurrency(summary?.totalPaid ?? 0)}</Text>
              <Text style={s.progressLabel}>
                {summary && summary.totalOutstanding + summary.totalPaid > 0
                  ? `${Math.round(
                      (summary.totalPaid / (summary.totalOutstanding + summary.totalPaid)) * 100,
                    )}%`
                  : "0%"}
              </Text>
            </View>
          </View>

          <View style={s.balanceActions}>
            <TouchableOpacity style={s.primaryBtn} onPress={handlePayment}>
              <Ionicons name="card-outline" size={16} color="#fff" />
              <Text style={s.primaryBtnText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.outlineBtn} onPress={handlePayment}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={s.outlineBtnText}>Pay Off</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Active Loans ───────────────────────────── */}
        {loans.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Active Loans</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.loanScroll}>
              {loans.map((loan) => (
                <TouchableOpacity key={loan.loanId} style={s.loanCard} activeOpacity={0.8}>
                  <View style={s.loanCardTop}>
                    <View style={s.loanCardIcon}>
                      <Ionicons name="briefcase-outline" size={18} color={ACCENT} />
                    </View>
                    <View style={s.loanCardBadge}>
                      <Text style={s.loanCardBadgeText}>{loan.status}</Text>
                    </View>
                  </View>
                  <Text style={s.loanCardCategory}>{loan.category}</Text>
                  <Text style={s.loanCardAmount}>{formatCurrency(loan.approvedAmount)}</Text>
                  <View style={s.loanCardProgress}>
                    <View style={s.loanCardBar}>
                      <View
                        style={[
                          s.loanCardFill,
                          { width: `${loan.repaymentProgress?.percentage ?? 0}%` },
                        ]}
                      />
                    </View>
                    <Text style={s.loanCardPct}>{loan.repaymentProgress?.percentage ?? 0}%</Text>
                  </View>
                  <Text style={s.loanCardOutstanding}>
                    Outstanding: {formatCurrency(loan.outstandingBalance)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Loan Categories ────────────────────────── */}
        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Loan Categories</Text>
            <TouchableOpacity onPress={() => setShowLoanModal(true)}>
              <Text style={s.seeAll}>Apply</Text>
            </TouchableOpacity>
          </View>
          <View style={s.catGrid}>
            {categories.length > 0
              ? categories.map((cat) => {
                  const pct = cat.percentageCollected ?? 0;
                  return (
                    <TouchableOpacity
                      key={cat.categoryId}
                      style={s.catCard}
                      onPress={() => setShowLoanModal(true)}
                      activeOpacity={0.7}
                    >
                      <View style={s.catCardTop}>
                        <View style={s.catIcon}>
                          <Ionicons
                            name={
                              cat.categoryName === "REGULAR"
                                ? "briefcase-outline"
                                : cat.categoryName === "HOME"
                                  ? "home-outline"
                                  : cat.categoryName === "COMMODITY"
                                    ? "cart-outline"
                                    : "flash-outline"
                            }
                            size={18}
                            color={ACCENT}
                          />
                        </View>
                        <Text style={s.catUtil}>{pct}%</Text>
                      </View>
                      <Text style={s.catName}>{cat.categoryName}</Text>
                      <Text style={s.catAmount}>{formatCurrency(cat.maxAmount)}</Text>
                      <View style={s.catBar}>
                        <View style={[s.catFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={s.catRemain}>
                        {formatCurrency(cat.remainingAmount)} left
                      </Text>
                    </TouchableOpacity>
                  );
                })
              : // Fallback when no API data
                [1, 2, 3, 4].map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={s.catCard}
                    onPress={() => setShowLoanModal(true)}
                    activeOpacity={0.7}
                  >
                    <View style={s.catCardTop}>
                      <View style={s.catIcon}>
                        <Ionicons
                          name={
                            i === 1 ? "briefcase-outline" : i === 2 ? "home-outline" : i === 3 ? "cart-outline" : "flash-outline"
                          }
                          size={18}
                          color={ACCENT}
                        />
                      </View>
                      <Text style={s.catUtil}>{i === 1 ? "57%" : "0%"}</Text>
                    </View>
                    <Text style={s.catName}>
                      {i === 1 ? "REGULAR" : i === 2 ? "HOME" : i === 3 ? "COMMODITY" : "EMERGENCY"}
                    </Text>
                    <Text style={s.catAmount}>₦200,000</Text>
                    <View style={s.catBar}>
                      <View style={[s.catFill, { width: i === 1 ? "57%" : "0%" }]} />
                    </View>
                    <Text style={s.catRemain}>
                      {i === 1 ? "₦86,000 left" : "₦200,000 left"}
                    </Text>
                  </TouchableOpacity>
                ))}
          </View>
        </View>
      </ScrollView>

      <LoanEnrollmentFlow visible={showLoanModal} onClose={() => setShowLoanModal(false)} />
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
    paddingBottom: 12,
  },
  greeting: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#6B7280" },
  userName: { fontSize: 20, fontFamily: "Poppins_700Bold", color: "#1A1A2E", marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: ACCENT,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontFamily: "Poppins_700Bold" },

  // ── Stats Strip ────────────────────────────────────────
  loadingStrip: { padding: 40, alignItems: "center" },
  statsRow: {
    flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14,
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statLabel: { fontSize: 10, fontFamily: "Poppins_500Medium", color: "#6B7280", marginBottom: 4 },
  statValue: { fontSize: 16, fontFamily: "Poppins_700Bold", color: "#1A1A2E" },

  // ── Balance Card ───────────────────────────────────────
  balanceCard: {
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#6A7814",
    marginBottom: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  balanceCardLabel: {
    color: "rgba(255,255,255,0.8)", fontSize: 13,
    fontFamily: "Poppins_400Regular", marginBottom: 4,
  },
  balanceCardAmount: {
    color: "#fff", fontSize: 30, fontFamily: "Poppins_700Bold", marginBottom: 16,
  },
  progressWrap: { marginBottom: 18 },
  progressBar: {
    height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: "#fff" },
  progressLabels: {
    flexDirection: "row", justifyContent: "space-between", marginTop: 6,
  },
  progressLabel: {
    fontSize: 10, fontFamily: "Poppins_500Medium", color: "rgba(255,255,255,0.75)",
  },
  balanceActions: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: "#4CAF50", borderRadius: 12, paddingVertical: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  outlineBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.3)",
  },
  outlineBtnText: { color: "#fff", fontSize: 13, fontFamily: "Poppins_600SemiBold" },

  // ── Active Loans ───────────────────────────────────────
  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 17, fontFamily: "Poppins_700Bold", color: "#1A1A2E", marginBottom: 14,
  },
  sectionHead: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 14,
  },
  seeAll: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: ACCENT },
  loanScroll: { gap: 12, paddingRight: 20 },
  loanCard: {
    width: 220, backgroundColor: "#fff", borderRadius: 18, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  loanCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  loanCardIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#F3FCF1",
    justifyContent: "center", alignItems: "center",
  },
  loanCardBadge: {
    backgroundColor: "#F3FCF1", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  loanCardBadgeText: { fontSize: 10, fontFamily: "Poppins_600SemiBold", color: ACCENT },
  loanCardCategory: { fontSize: 15, fontFamily: "Poppins_600SemiBold", color: "#1A1A2E", marginBottom: 2 },
  loanCardAmount: { fontSize: 12, fontFamily: "Poppins_400Regular", color: "#6B7280", marginBottom: 10 },
  loanCardProgress: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  loanCardBar: {
    flex: 1, height: 5, borderRadius: 3, backgroundColor: "#E5E7EB", overflow: "hidden",
  },
  loanCardFill: { height: "100%", borderRadius: 3, backgroundColor: "#4CAF50" },
  loanCardPct: { fontSize: 12, fontFamily: "Poppins_700Bold", color: "#4CAF50", width: 36, textAlign: "right" },
  loanCardOutstanding: { fontSize: 11, fontFamily: "Poppins_400Regular", color: "#9CA3AF" },

  // ── Categories ────────────────────────────────────────
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: {
    width: "47%", backgroundColor: "#fff", borderRadius: 16, padding: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  catCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  catIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#F3FCF1",
    justifyContent: "center", alignItems: "center",
  },
  catUtil: { fontSize: 14, fontFamily: "Poppins_700Bold", color: ACCENT },
  catName: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: "#1A1A2E", marginBottom: 2 },
  catAmount: { fontSize: 15, fontFamily: "Poppins_700Bold", color: "#1A1A2E", marginBottom: 8 },
  catBar: { height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", overflow: "hidden", marginBottom: 6 },
  catFill: { height: "100%", borderRadius: 2, backgroundColor: ACCENT },
  catRemain: { fontSize: 10, fontFamily: "Poppins_400Regular", color: "#9CA3AF" },
});
