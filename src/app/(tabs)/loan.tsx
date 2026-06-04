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
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { getInitials } from "@/constants/data";

export default function Loan() {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const { user } = useAuthStore();
  const { data, isLoading } = useLoanBalances();
  const { colors } = useTheme();

  const summary = data?.summary;
  const loans = data?.loans ?? [];
  const categories = data?.categories ?? [];

  const formatCurrency = (n: number) => `\u20A6${n.toLocaleString()}`;

  const handlePayment = () => router.push("/payments" as any);

  const isRegular = (cat: any) =>
    (cat.categoryName && cat.categoryName === "REGULAR") || cat === 1;

  const handleCategoryPress = (cat: any) => {
    if (!isRegular(cat)) return;
    setShowLoanModal(true);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.header}>
        <View>
          <Text style={[s.greeting, { color: colors.textSecondary }]}>Good afternoon,</Text>
          <Text style={[s.userName, { color: colors.text }]}>{user?.first_name || "User"}</Text>
        </View>
        <View style={s.headerRight}>
          <View style={[s.avatar, { backgroundColor: colors.primary }]}>
            <Text style={s.avatarText}>{getInitials(user?.first_name || "")}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/notifications" as any)}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {isLoading ? (
          <View style={s.loadingStrip}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={s.statsRow}>
            <View style={[s.statCard, { backgroundColor: colors.card }]}>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>Outstanding</Text>
              <Text style={[s.statValue, { color: colors.text }]}>{formatCurrency(summary?.totalOutstanding ?? 0)}</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: colors.card }]}>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>Active</Text>
              <Text style={[s.statValue, { color: colors.text }]}>{summary?.activeLoans ?? 0}</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: colors.card }]}>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>Paid</Text>
              <Text style={[s.statValue, { color: colors.text }]}>{formatCurrency(summary?.totalPaid ?? 0)}</Text>
            </View>
          </View>
        )}

        <View style={[s.balanceCard, { backgroundColor: "#6A7814" }]}>
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

        {loans.length > 0 && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Active Loans</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.loanScroll}>
              {loans.map((loan) => (
                <TouchableOpacity key={loan.loanId} style={[s.loanCard, { backgroundColor: colors.card }]} activeOpacity={0.8}>
                  <View style={s.loanCardTop}>
                    <View style={[s.loanCardIcon, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="briefcase-outline" size={18} color={colors.text} />
                    </View>
                    <View style={[s.loanCardBadge, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[s.loanCardBadgeText, { color: colors.text }]}>{loan.status}</Text>
                    </View>
                  </View>
                  <Text style={[s.loanCardCategory, { color: colors.text }]}>{loan.category}</Text>
                  <Text style={[s.loanCardAmount, { color: colors.textSecondary }]}>{formatCurrency(loan.approvedAmount)}</Text>
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
                  <Text style={[s.loanCardOutstanding, { color: colors.textSecondary }]}>
                    Outstanding: {formatCurrency(loan.outstandingBalance)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Loan Categories</Text>
            <TouchableOpacity onPress={() => setShowLoanModal(true)}>
              <Text style={[s.seeAll, { color: colors.primary }]}>Apply</Text>
            </TouchableOpacity>
          </View>
          <View style={s.catGrid}>
            {categories.length > 0
              ? categories.map((cat) => {
                  const pct = cat.percentageCollected ?? 0;
                  const regular = cat.categoryName === "REGULAR";
                  return (
                    <TouchableOpacity
                      key={cat.categoryId}
                      style={[s.catCard, { backgroundColor: colors.card }]}
                      onPress={() => handleCategoryPress(cat)}
                      activeOpacity={regular ? 0.7 : 1}
                      disabled={!regular}
                    >
                      <View style={s.catCardTop}>
                        <View style={[s.catIcon, { backgroundColor: colors.primaryLight }]}>
                          <Ionicons
                            name={
                              regular
                                ? "briefcase-outline"
                                : cat.categoryName === "HOME"
                                  ? "home-outline"
                                  : cat.categoryName === "COMMODITY"
                                    ? "cart-outline"
                                    : "flash-outline"
                            }
                            size={18}
                            color={colors.text}
                          />
                        </View>
                        {!regular && (
                          <View style={[s.comingSoonBadge, { backgroundColor: colors.primaryLight }]}>
                            <Text style={s.comingSoonText}>Coming Soon</Text>
                          </View>
                        )}
                        {regular && <Text style={[s.catUtil, { color: colors.primary }]}>{pct}%</Text>}
                      </View>
                      <Text style={[s.catName, { color: colors.text }]}>{cat.categoryName}</Text>
                      <Text style={[s.catAmount, { color: colors.text }]}>{formatCurrency(cat.maxAmount)}</Text>
                      <View style={s.catBar}>
                        <View style={[s.catFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={[s.catRemain, { color: colors.textSecondary }]}>
                        {formatCurrency(cat.remainingAmount)} left
                      </Text>
                    </TouchableOpacity>
                  );
                })
              : [1, 2, 3, 4].map((i) => {
                  const regular = i === 1;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[s.catCard, { backgroundColor: colors.card }]}
                      onPress={() => regular && setShowLoanModal(true)}
                      activeOpacity={regular ? 0.7 : 1}
                      disabled={!regular}
                    >
                      <View style={s.catCardTop}>
                        <View style={[s.catIcon, { backgroundColor: colors.primaryLight }]}>
                          <Ionicons
                            name={
                              regular ? "briefcase-outline" : i === 2 ? "home-outline" : i === 3 ? "cart-outline" : "flash-outline"
                            }
                            size={18}
                            color={colors.primary}
                          />
                        </View>
                        {!regular && (
                          <View style={[s.comingSoonBadge, { backgroundColor: colors.primaryLight }]}>
                            <Text style={s.comingSoonText}>Coming Soon</Text>
                          </View>
                        )}
                        {regular && <Text style={[s.catUtil, { color: colors.primary }]}>{i === 1 ? "57%" : "0%"}</Text>}
                      </View>
                      <Text style={[s.catName, { color: colors.text }]}>
                        {regular ? "REGULAR" : i === 2 ? "HOME" : i === 3 ? "COMMODITY" : "EMERGENCY"}
                      </Text>
                      <Text style={[s.catAmount, { color: colors.text }]}>\u20A6200,000</Text>
                      <View style={s.catBar}>
                        <View style={[s.catFill, { width: regular ? "57%" : "0%" }]} />
                      </View>
                      <Text style={[s.catRemain, { color: colors.textSecondary }]}>
                        {regular ? "\u20A686,000 left" : "\u20A6200,000 left"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
          </View>
        </View>
      </ScrollView>

      <LoanEnrollmentFlow visible={showLoanModal} onClose={() => setShowLoanModal(false)} />
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
    paddingBottom: 12,
  },
  greeting: { fontSize: 14, fontFamily: "Poppins_400Regular" },
  userName: { fontSize: 20, fontFamily: "Poppins_700Bold", marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontFamily: "Poppins_700Bold" },

  loadingStrip: { padding: 40, alignItems: "center" },
  statsRow: {
    flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, borderRadius: 14, padding: 14,
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statLabel: { fontSize: 10, fontFamily: "Poppins_500Medium", marginBottom: 4 },
  statValue: { fontSize: 16, fontFamily: "Poppins_700Bold" },

  balanceCard: {
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 24,
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

  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 17, fontFamily: "Poppins_700Bold", marginBottom: 14,
  },
  sectionHead: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 14,
  },
  seeAll: { fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  loanScroll: { gap: 12, paddingRight: 20 },
  loanCard: {
    width: 220, borderRadius: 18, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  loanCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  loanCardIcon: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  loanCardBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  loanCardBadgeText: { fontSize: 10, fontFamily: "Poppins_600SemiBold" },
  loanCardCategory: { fontSize: 15, fontFamily: "Poppins_600SemiBold", marginBottom: 2 },
  loanCardAmount: { fontSize: 12, fontFamily: "Poppins_400Regular", marginBottom: 10 },
  loanCardProgress: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  loanCardBar: {
    flex: 1, height: 5, borderRadius: 3, backgroundColor: "#E5E7EB", overflow: "hidden",
  },
  loanCardFill: { height: "100%", borderRadius: 3, backgroundColor: "#4CAF50" },
  loanCardPct: { fontSize: 12, fontFamily: "Poppins_700Bold", color: "#4CAF50", width: 36, textAlign: "right" },
  loanCardOutstanding: { fontSize: 11, fontFamily: "Poppins_400Regular" },

  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: {
    width: "47%", borderRadius: 16, padding: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  catCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  catIcon: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  catUtil: { fontSize: 14, fontFamily: "Poppins_700Bold" },
  comingSoonBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  comingSoonText: {
    fontSize: 9, fontFamily: "Poppins_600SemiBold", color: "#213400",
  },
  catName: { fontSize: 13, fontFamily: "Poppins_600SemiBold", marginBottom: 2 },
  catAmount: { fontSize: 15, fontFamily: "Poppins_700Bold", marginBottom: 8 },
  catBar: { height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", overflow: "hidden", marginBottom: 6 },
  catFill: { height: "100%", borderRadius: 2, backgroundColor: "#213400" },
  catRemain: { fontSize: 10, fontFamily: "Poppins_400Regular" },
});
