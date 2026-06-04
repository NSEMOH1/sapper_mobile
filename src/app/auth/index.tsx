import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";

export default function AuthIndex() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>

      <LinearGradient
        colors={isDark ? ["#1a2e0a", "#213400", "#2E4A0B"] : ["#213400", "#2E4A0B", "#3A5C15"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <View style={s.heroContent}>
          <View style={s.logoWrap}>
            <Image
              source={require("@/assets/images/sappper-logo.png")}
              style={s.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={s.heroTitle}>Sappers</Text>
          <Text style={s.heroSub}>
            Multipurpose Cooperative Society
          </Text>
          <Text style={s.heroDesc}>
            Fast, secure cooperative banking for every member
          </Text>
        </View>
      </LinearGradient>

      <View style={s.body}>
        <Text style={[s.welcome, { color: colors.text }]}>Welcome back</Text>
        <Text style={[s.tagline, { color: colors.textSecondary }]}>Sign in to manage your finances</Text>

        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.push("/auth/login")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, "#2E4A0B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.gradient}
          >
            <Text style={s.primaryBtnText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.secondaryBtn, {
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}
          onPress={() => router.push("/auth/signup")}
          activeOpacity={0.8}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.primary} />
          <Text style={[s.secondaryBtnText, { color: colors.text }]}>Create an Account</Text>
        </TouchableOpacity>

        <View style={s.divider}>
          <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[s.dividerText, { color: colors.textSecondary }]}>or</Text>
          <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity
          style={s.forgotBtn}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Ionicons name="lock-open-outline" size={16} color={colors.textSecondary} />
          <Text style={[s.forgotText, { color: colors.textSecondary }]}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <View style={s.footerLinks}>
          <Text style={[s.footerLink, { color: colors.textSecondary }]}>Terms</Text>
          <View style={[s.footerDot, { backgroundColor: colors.border }]} />
          <Text style={[s.footerLink, { color: colors.textSecondary }]}>Privacy</Text>
          <View style={[s.footerDot, { backgroundColor: colors.border }]} />
          <Text style={[s.footerLink, { color: colors.textSecondary }]}>Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingTop: 20,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    textAlign: "center",
  },
  heroDesc: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 18,
  },

  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcome: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 32,
  },

  primaryBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#213400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },

  forgotBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },

  footer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  footerLink: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
});
