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
import { useTheme } from "@/hooks/use-theme";
import AppIcon from "@/lib/useIcon";
import { useMember } from "@/hooks/useMember";

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
  const { data: member, isLoading } = useMember(user?.id);
  const logoutMutation = useLogout();
  const { colors, isDark } = useTheme();

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
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>

          <View style={[s.avatar, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>

          <Text style={[s.name, { color: colors.text }]}>{fullName}</Text>
          <Text style={[s.email, { color: colors.textSecondary }]}>{user?.email || ""}</Text>
          {user?.role && (
            <View style={[s.roleBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[s.roleText, { color: colors.text }]}>{user.role}</Text>
            </View>
          )}
        </View>

        {isLoading ? (
          <View style={[s.loadingBox, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : infoRows.length > 0 ? (
          <View style={[s.infoCard, { backgroundColor: colors.card }]}>
            {infoRows.map((row, i) => (
              <View key={row.label} style={[s.infoRow, i < infoRows.length - 1 && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 }]}>
                <View style={s.infoLeft}>
                  <AppIcon name={row.icon} size={15} color={colors.textSecondary} />
                  <Text style={[s.infoLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                </View>
                <Text style={[s.infoValue, { color: colors.text }]}>{row.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
            <View style={[s.menuCard, { backgroundColor: colors.card }]}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[s.menuItem, i < section.items.length - 1 && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 }]}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.6}
                >
                  <View style={s.menuLeft}>
                    <View style={[s.menuIcon, { backgroundColor: colors.primaryLight }]}>
                      <AppIcon name={item.icon} size={18} color={colors.text} />
                    </View>
                    <Text style={[s.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  <AppIcon name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={[s.logoutBtn, { backgroundColor: colors.card, borderColor: isDark ? "#5C2020" : "#FEE2E2" }]} onPress={handleLogout} activeOpacity={0.7}>
          <AppIcon name="log-out-outline" size={20} color="#EF4444" />
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[s.footer, { color: colors.textSecondary }]}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  header: { alignItems: "center", paddingTop: 12, paddingBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: { color: "#fff", fontSize: 28, fontFamily: "Poppins_700Bold" },
  name: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  email: { fontSize: 14, fontFamily: "Poppins_400Regular", marginBottom: 10 },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 12, fontFamily: "Poppins_500Medium" },

  loadingBox: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  infoCard: {
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
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 13, fontFamily: "Poppins_400Regular" },
  infoValue: { fontSize: 13, fontFamily: "Poppins_600SemiBold" },

  sectionTitle: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
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
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { fontSize: 15, fontFamily: "Poppins_500Medium" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  logoutText: { fontSize: 15, fontFamily: "Poppins_600SemiBold", color: "#EF4444" },

  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
});
