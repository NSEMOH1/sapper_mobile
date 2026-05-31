import api from "@/constants/api";
import { getInitials } from "@/constants/data";
import { useAuthStore } from "@/hooks/useAuth";
import { useBalances } from "@/hooks/useBalances";
import { useSavingsBalance } from "@/hooks/useSavings";
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

const BG = "#F5F7FA";
const ACCENT = "#213400";

export default function Savings() {
  const { data: savingsBalance, refetch } = useSavingsBalance();
  const { data: balance } = useBalances();
  const [newSavings, setNewSavings] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();

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
    `₦${Number(v).toLocaleString()}`;

  const savingsTotal = Number(savingsBalance?.totalSavings ?? balance?.savings_balance ?? 0);
  const monthlyDed = Number(savingsBalance?.monthlyDeduction ?? 0);
  const normalSavings = Number(savingsBalance?.normalSavings ?? 0);
  const coopSavings = Number(savingsBalance?.cooperativeSavings ?? 0);
  const categories = savingsBalance?.details ?? [];

  const maxCategory = [...categories].sort((a, b) => Number(b.amount) - Number(a.amount))[0]?.amount ?? new Decimal(0);

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={s.successWrap}>
          <View style={s.successCard}>
            <View style={s.successIcon}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={s.successTitle}>Savings Adjusted Successfully</Text>
            <Text style={s.successSub}>Your monthly deduction has been updated.</Text>
            <TouchableOpacity style={s.successBtn} onPress={() => setSuccess(false)}>
              <Text style={s.successBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Total Savings</Text>
            <Text style={s.statValue}>{fmt(savingsTotal)}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Monthly</Text>
            <Text style={s.statValue}>{fmt(monthlyDed)}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Quick</Text>
            <Text style={s.statValue}>{fmt(normalSavings)}</Text>
          </View>
        </View>

        {/* ── Balance Card ───────────────────────────── */}
        <View style={s.balanceCard}>
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

        {/* ── Savings Breakdown ──────────────────────── */}
        {categories.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Savings Breakdown</Text>
            <View style={s.breakdownCard}>
              {categories.map((cat, i) => {
                const pct =
                  Number(maxCategory) > 0
                    ? Math.round((Number(cat.amount) / Number(maxCategory)) * 100)
                    : 0;
                return (
                  <View
                    key={cat.categoryId}
                    style={[s.breakdownItem, i < categories.length - 1 && s.breakdownBorder]}
                  >
                    <View style={s.breakdownLeft}>
                      <View style={s.breakdownIcon}>
                        <Ionicons
                          name={
                            cat.categoryName === "QUICK" || cat.categoryName === "NORMAL"
                              ? "wallet-outline"
                              : "people-outline"
                          }
                          size={16}
                          color={ACCENT}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.breakdownName}>{cat.categoryName}</Text>
                        <View style={s.breakdownBar}>
                          <View style={[s.breakdownFill, { width: `${pct}%` }]} />
                        </View>
                      </View>
                    </View>
                    <Text style={s.breakdownAmount}>{fmt(cat.amount)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Monthly Deduction ──────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Monthly Deduction</Text>
          <View style={s.deductionCard}>
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

        {/* ── Adjustment ─────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Adjust Deduction</Text>
          <View style={s.adjustCard}>
            <Text style={s.adjustLabel}>New monthly amount</Text>
            <TextInput
              style={s.adjustInput}
              value={newSavings}
              onChangeText={setNewSavings}
              keyboardType="numeric"
              placeholder={`Enter amount (current: ${fmt(monthlyDed)})`}
              placeholderTextColor="#9CA3AF"
            />
            {!!errorMessage && <Text style={s.errorText}>{errorMessage}</Text>}
            <TouchableOpacity
              style={[s.saveBtn, (!newSavings || loading) && s.saveBtnDisabled]}
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
  statValue: { fontSize: 14, fontFamily: "Poppins_700Bold", color: "#1A1A2E" },

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

  // ── Savings Breakdown ────────────────────────────────
  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 17, fontFamily: "Poppins_700Bold", color: "#1A1A2E", marginBottom: 14,
  },
  breakdownCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  breakdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 12, gap: 12,
  },
  breakdownBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  breakdownLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  breakdownIcon: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: "#F3FCF1",
    justifyContent: "center", alignItems: "center",
  },
  breakdownName: {
    fontSize: 13, fontFamily: "Poppins_500Medium", color: "#1A1A2E", marginBottom: 6,
  },
  breakdownBar: {
    height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", overflow: "hidden",
  },
  breakdownFill: { height: "100%", borderRadius: 2, backgroundColor: ACCENT },
  breakdownAmount: {
    fontSize: 14, fontFamily: "Poppins_700Bold", color: "#1A1A2E",
  },

  // ── Monthly Deduction ─────────────────────────────────
  deductionCard: {
    backgroundColor: "#ADB7F0", borderRadius: 16, padding: 18,
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

  // ── Adjustment ────────────────────────────────────────
  adjustLabel: {
    fontSize: 13, fontFamily: "Poppins_400Regular", color: "#6B7280",
    marginBottom: 8,
  },
  adjustCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  adjustInput: {
    backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB",
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 16,
    fontFamily: "Poppins_500Medium", color: "#1A1A2E", marginBottom: 12,
  },
  errorText: {
    color: "#EF4444", fontSize: 13, fontFamily: "Poppins_400Regular", marginBottom: 8,
  },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: ACCENT, borderRadius: 12,
    paddingVertical: 14, marginTop: 4,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: "#fff", fontSize: 14, fontFamily: "Poppins_600SemiBold" },

  // ── Success ───────────────────────────────────────────
  successWrap: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 20,
  },
  successCard: {
    backgroundColor: "#fff", borderRadius: 24, padding: 32, alignItems: "center",
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
    fontSize: 20, fontFamily: "Poppins_700Bold", color: "#1A1A2E",
    textAlign: "center", marginBottom: 8,
  },
  successSub: {
    fontSize: 14, fontFamily: "Poppins_400Regular", color: "#6B7280",
    textAlign: "center", marginBottom: 24,
  },
  successBtn: {
    backgroundColor: ACCENT, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40,
  },
  successBtnText: { color: "#fff", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
});
