import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getInitials } from "@/constants/data";
import { useAuthStore, useLogout } from "@/hooks/useAuth";
import { useMemberStore } from "@/store/user";

type MenuItem = {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const ACCOUNT_ITEMS: MenuSection = {
  title: "Account",
  items: [
    { id: 1, icon: "person-outline", label: "Edit Profile", route: "/profile/edit" },
    { id: 6, icon: "document-text-outline", label: "Account Statement", route: "/profile/account-statement" },
    { id: 5, icon: "lock-closed-outline", label: "Change Password", route: "/profile/change-password" },
  ],
};

const SUPPORT_ITEMS: MenuSection = {
  title: "Support",
  items: [
    { id: 7, icon: "chatbubble-ellipses-outline", label: "Contact Us", route: "/profile/contact-us" },
    { id: 4, icon: "cash-outline", label: "Request Refund", route: "/profile/refund" },
    { id: 2, icon: "people-outline", label: "Edit Next of Kin", route: "/profile/next-of-kin" },
  ],
};

const SETTINGS_ITEMS: MenuSection = {
  title: "Settings",
  items: [
    { id: 3, icon: "flag-outline", label: "Termination", route: "/profile/termination" },
  ],
};

const SECTIONS = [ACCOUNT_ITEMS, SUPPORT_ITEMS, SETTINGS_ITEMS];

type InfoRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export default function Profile() {
  const { user } = useAuthStore();
  const { member, loading, fetchMemberData } = useMemberStore();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (user?.id && !member && !loading) {
      fetchMemberData(user.id);
    }
  }, [user?.id]);

  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logoutMutation.mutate() },
    ]);
  }, [logoutMutation]);

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "User";
  const initials = getInitials(fullName);

  const infoRows: InfoRow[] = member?.user
    ? ([
        { icon: "id-badge" as const, label: "Service No.", value: member.user.service_number },
        { icon: "trending-up-outline" as const, label: "Rank", value: member.user.rank },
        { icon: "call-outline" as const, label: "Phone", value: member.user.phone },
        { icon: "business-outline" as const, label: "Unit", value: member.user.unit },
      ] as InfoRow[])
    : [];

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Profile Header ────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.name}>{fullName}</Text>
          <Text style={s.email}>{user?.email || ""}</Text>
          {user?.role && (
            <View style={s.roleBadge}>
              <Text style={s.roleText}>{user.role}</Text>
            </View>
          )}
        </View>

        {/* ── Member Info Card ──────────────────────────────── */}
        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="small" color="#213400" />
          </View>
        ) : infoRows.length > 0 ? (
          <View style={s.infoCard}>
            {infoRows.map((row, i) => (
              <View key={row.label} style={[s.infoRow, i < infoRows.length - 1 && s.infoBorder]}>
                <View style={s.infoLeft}>
                  <Ionicons name={row.icon} size={15} color="#6B7280" />
                  <Text style={s.infoLabel}>{row.label}</Text>
                </View>
                <Text style={s.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Menu Sections ─────────────────────────────────── */}
        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[s.menuItem, i < section.items.length - 1 && s.menuBorder]}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.6}
                >
                  <View style={s.menuLeft}>
                    <View style={s.menuIcon}>
                      <Ionicons name={item.icon} size={18} color="#213400" />
                    </View>
                    <Text style={s.menuLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* ── Logout ──────────────────────────────────────────── */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={s.footer}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  // ── Header ─────────────────────────────────────────────────
  header: { alignItems: "center", paddingTop: 12, paddingBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#213400",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#213400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: { color: "#fff", fontSize: 28, fontFamily: "Poppins_700Bold" },
  name: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  email: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#6B7280", marginBottom: 10 },
  roleBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 12, fontFamily: "Poppins_500Medium", color: "#213400" },

  // ── Info Card ──────────────────────────────────────────────
  loadingBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 13, fontFamily: "Poppins_400Regular", color: "#6B7280" },
  infoValue: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: "#1A1A2E" },

  // ── Menu ───────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F3FCF1",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { fontSize: 15, fontFamily: "Poppins_500Medium", color: "#1A1A2E" },

  // ── Logout ─────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 16,
  },
  logoutText: { fontSize: 15, fontFamily: "Poppins_600SemiBold", color: "#EF4444" },

  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
});
