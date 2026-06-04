import api from "@/constants/api";
import { getInitials } from "@/constants/data";
import { useAuthStore } from "@/hooks/useAuth";
import { useBalances } from "@/hooks/useBalances";
import { useSavingsBalance } from "@/hooks/useSavings";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Decimal from "decimal.js";

export default function Savings() {
  const { data: savingsBalance, refetch } = useSavingsBalance();
  const { data: balance } = useBalances();
  const [newSavings, setNewSavings] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();
  const { colors } = useTheme();

  const handleDeposit = () => router.push("/payments" as any);
  const handleWithdrawal = () => router.push("/withdrawal" as any);

  const handleMonthlyDeduction = async () => {
    setLoading(true);
    try {
      await api.put("/api/savings/deduction", { amount: newSavings });
      setSuccess(true);
      setNewSavings("");
      await refetch();
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (v: number | Decimal) =>
    `\u20A6${Number(v).toLocaleString()}`;

  const savingsTotal = Number(savingsBalance?.totalSavings ?? balance?.savings_balance ?? 0);
  const monthlyDed = Number(savingsBalance?.monthlyDeduction ?? 0);
  const normalSavings = Number(savingsBalance?.normalSavings ?? 0);
  const coopSavings = Number(savingsBalance?.cooperativeSavings ?? 0);
  const categories = savingsBalance?.details ?? [];

  const maxCategory = [...categories].sort((a, b) => Number(b.amount) - Number(a.amount))[0]?.amount ?? new Decimal(0);

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={s.successWrap}>
          <View style={[s.successCard, { backgroundColor: colors.card }]}>
            <View style={s.successIcon}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={[s.successTitle, { color: colors.text }]}>Savings Adjusted Successfully</Text>
            <Text style={[s.successSub, { color: colors.textSecondary }]}>Your monthly deduction has been updated.</Text>
            <TouchableOpacity style={[s.successBtn, { backgroundColor: colors.primary }]} onPress={() => setSuccess(false)}>
              <Text style={s.successBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: colors.card }]}>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>Total Savings</Text>
            <Text style={[s.statValue, { color: colors.text }]}>{fmt(savingsTotal)}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: colors.card }]}>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>Monthly</Text>
            <Text style={[s.statValue, { color: colors.text }]}>{fmt(monthlyDed)}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: colors.card }]}>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>Quick</Text>
            <Text style={[s.statValue, { color: colors.text }]}>{fmt(normalSavings)}</Text>
          </View>
        </View>

        <View style={[s.balanceCard, { backgroundColor: "#6A7814" }]}>
          <Text style={s.balanceCardLabel}>Savings Balance</Text>
          <Text style={s.balanceCardAmount}>{fmt(savingsTotal)}</Text>

          <View style={s.balanceSplit}>
            <View style={s.splitItem}>
              <View style={s.splitDot} />
              <View>
                <Text style={s.splitLabel}>Normal Savings</Text>
                <Text style={s.splitValue}>{fmt(normalSavings)}</Text>
              </View>
            </View>
            <View style={s.splitDivider} />
            <View style={s.splitItem}>
              <View style={[s.splitDot, { backgroundColor: "#6B7280" }]} />
              <View>
                <Text style={s.splitLabel}>Cooperative</Text>
                <Text style={s.splitValue}>{fmt(coopSavings)}</Text>
              </View>
            </View>
          </View>

          <View style={s.balanceActions}>
            <TouchableOpacity style={s.primaryBtn} onPress={handleDeposit}>
              <Ionicons name="card-outline" size={16} color="#fff" />
              <Text style={s.primaryBtnText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.outlineBtn} onPress={handleWithdrawal}>
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={s.outlineBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {categories.length > 0 && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Savings Breakdown</Text>
            <View style={[s.breakdownCard, { backgroundColor: colors.card }]}>
              {categories.map((cat, i) => {
                const pct =
                  Number(maxCategory) > 0
                    ? Math.round((Number(cat.amount) / Number(maxCategory)) * 100)
                    : 0;
                return (
                  <View
                    key={cat.categoryId}
                    style={[s.breakdownItem, i < categories.length - 1 && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 }]}
                  >
                    <View style={s.breakdownLeft}>
                      <View style={[s.breakdownIcon, { backgroundColor: colors.primaryLight }]}>
                        <Ionicons
                          name={
                            cat.categoryName === "QUICK" || cat.categoryName === "NORMAL"
                              ? "wallet-outline"
                              : "people-outline"
                          }
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[s.breakdownName, { color: colors.text }]}>{cat.categoryName}</Text>
                        <View style={s.breakdownBar}>
                          <View style={[s.breakdownFill, { backgroundColor: colors.primary, width: `${pct}%` }]} />
                        </View>
                      </View>
                    </View>
                    <Text style={[s.breakdownAmount, { color: colors.text }]}>{fmt(cat.amount)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Monthly Deduction</Text>
          <View style={[s.deductionCard, { backgroundColor: "#ADB7F0" }]}>
            <View style={s.deductionHeader}>
              <View style={s.deductionLeft}>
                <View style={s.deductionIcon}>
                  <Ionicons name="trending-up" size={18} color="#fff" />
                </View>
                <View>
                  <Text style={s.deductionTitle}>Current Deduction</Text>
                  <Text style={s.deductionAmount}>{fmt(monthlyDed)}</Text>
                </View>
              </View>
              <View style={s.deductionBadge}>
                <Text style={s.deductionBadgeText}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Adjust Deduction</Text>
          <View style={[s.adjustCard, { backgroundColor: colors.card }]}>
            <Text style={[s.adjustLabel, { color: colors.textSecondary }]}>New monthly amount</Text>
            <TextInput
              style={[s.adjustInput, {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              }]}
              value={newSavings}
              onChangeText={setNewSavings}
              keyboardType="numeric"
              placeholder={`Enter amount (current: ${fmt(monthlyDed)})`}
              placeholderTextColor={colors.textSecondary}
            />
            {!!errorMessage && <Text style={s.errorText}>{errorMessage}</Text>}
            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: colors.primary }, (!newSavings || loading) && s.saveBtnDisabled]}
              onPress={handleMonthlyDeduction}
              disabled={!newSavings || loading}
            >
              <Ionicons name="save-outline" size={16} color="#fff" />
              <Text style={s.saveBtnText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  statValue: { fontSize: 14, fontFamily: "Poppins_700Bold" },

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
  balanceSplit: {
    flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12, padding: 12, marginBottom: 18,
  },
  splitItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  splitDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4CAF50" },
  splitDivider: { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 8 },
  splitLabel: { fontSize: 10, fontFamily: "Poppins_400Regular", color: "rgba(255,255,255,0.7)" },
  splitValue: { fontSize: 13, fontFamily: "Poppins_700Bold", color: "#fff" },
  balanceActions: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: "#F7B23B", borderRadius: 12, paddingVertical: 12,
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
  breakdownCard: {
    borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  breakdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 12, gap: 12,
  },
  breakdownLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  breakdownIcon: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: "center", alignItems: "center",
  },
  breakdownName: {
    fontSize: 13, fontFamily: "Poppins_500Medium", marginBottom: 6,
  },
  breakdownBar: {
    height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", overflow: "hidden",
  },
  breakdownFill: { height: "100%", borderRadius: 2 },
  breakdownAmount: {
    fontSize: 14, fontFamily: "Poppins_700Bold",
  },

  deductionCard: {
    borderRadius: 16, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  deductionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  deductionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  deductionIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center", alignItems: "center",
  },
  deductionTitle: {
    fontSize: 13, fontFamily: "Poppins_400Regular", color: "rgba(255,255,255,0.85)",
  },
  deductionAmount: {
    fontSize: 20, fontFamily: "Poppins_700Bold", color: "#fff", marginTop: 2,
  },
  deductionBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  deductionBadgeText: { fontSize: 11, fontFamily: "Poppins_600SemiBold", color: "#fff" },

  adjustLabel: {
    fontSize: 13, fontFamily: "Poppins_400Regular",
    marginBottom: 8,
  },
  adjustCard: {
    borderRadius: 16, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  adjustInput: {
    borderRadius: 12, borderWidth: 1,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 16,
    fontFamily: "Poppins_500Medium", marginBottom: 12,
  },
  errorText: {
    color: "#EF4444", fontSize: 13, fontFamily: "Poppins_400Regular", marginBottom: 8,
  },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, borderRadius: 12,
    paddingVertical: 14, marginTop: 4,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: "#fff", fontSize: 14, fontFamily: "Poppins_600SemiBold" },

  successWrap: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 20,
  },
  successCard: {
    borderRadius: 24, padding: 32, alignItems: "center",
    width: "100%", maxWidth: 340,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  successIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    shadowColor: "#4CAF50", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  successTitle: {
    fontSize: 20, fontFamily: "Poppins_700Bold",
    textAlign: "center", marginBottom: 8,
  },
  successSub: {
    fontSize: 14, fontFamily: "Poppins_400Regular",
    textAlign: "center", marginBottom: 24,
  },
  successBtn: {
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40,
  },
  successBtnText: { color: "#fff", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
});
