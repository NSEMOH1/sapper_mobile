import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ACCENT = "#213400";

export default function AuthIndex() {
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      {/* ── Hero ──────────────────────────────────── */}
      <LinearGradient
        colors={["#213400", "#2E4A0B", "#3A5C15"]}
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

      {/* ── Body ──────────────────────────────────── */}
      <View style={s.body}>
        <Text style={s.welcome}>Welcome back</Text>
        <Text style={s.tagline}>Sign in to manage your finances</Text>

        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.push("/auth/login")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#213400", "#2E4A0B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.gradient}
          >
            <Text style={s.primaryBtnText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => router.push("/auth/signup")}
          activeOpacity={0.8}
        >
          <Ionicons name="person-add-outline" size={20} color={ACCENT} />
          <Text style={s.secondaryBtnText}>Create an Account</Text>
        </TouchableOpacity>

        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or</Text>
          <View style={s.dividerLine} />
        </View>

        <TouchableOpacity
          style={s.forgotBtn}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Ionicons name="lock-open-outline" size={16} color="#6B7280" />
          <Text style={s.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* ── Footer ──────────────────────────────────── */}
      <View style={s.footer}>
        <View style={s.footerLinks}>
          <Text style={s.footerLink}>Terms</Text>
          <View style={s.footerDot} />
          <Text style={s.footerLink}>Privacy</Text>
          <View style={s.footerDot} />
          <Text style={s.footerLink}>Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  // ── Hero ──────────────────────────────────────────────
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
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
    tintColor: "#fff",
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

  // ── Body ──────────────────────────────────────────────
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcome: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    marginBottom: 32,
  },

  // ── Buttons ───────────────────────────────────────────
  primaryBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: ACCENT,
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
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    color: ACCENT,
  },

  // ── Divider ────────────────────────────────────────────
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#9CA3AF",
  },

  // ── Forgot ─────────────────────────────────────────────
  forgotBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#6B7280",
  },

  // ── Footer ─────────────────────────────────────────────
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
    backgroundColor: "#D1D5DB",
  },
  footerLink: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#9CA3AF",
  },
});
