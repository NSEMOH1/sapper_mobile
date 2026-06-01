import { useLogin } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#213400";

export default function LoginScreen() {
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending, error, reset } = useLogin();

  const errorMessage =
    error instanceof Error ? error.message : error ? "Login failed. Please check your credentials." : "";

  const handleSignin = () => {
    reset();
    login({ service_number: serviceNumber, password });
  };

  const isValid = serviceNumber.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back ─────────────────────────────────── */}
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </TouchableOpacity>

          {/* ── Header ───────────────────────────────── */}
          <View style={s.header}>
            <View style={s.logoWrap}>
              <Ionicons name="shield-checkmark" size={28} color={ACCENT} />
            </View>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Sign in to your account</Text>
          </View>

          {/* ── Error ────────────────────────────────── */}
          {errorMessage ? (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={s.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* ── Form ─────────────────────────────────── */}
          <View style={s.form}>
            <View style={s.fieldGroup}>
              <Text style={s.label}>Service Number</Text>
              <View style={[s.inputWrap, serviceNumber.length > 0 && s.inputWrapActive]}>
                <Ionicons name="id-card-outline" size={20} color={serviceNumber.length > 0 ? ACCENT : "#9CA3AF"} />
                <TextInput
                  placeholder="Enter your service number"
                  placeholderTextColor="#9CA3AF"
                  value={serviceNumber}
                  onChangeText={setServiceNumber}
                  style={s.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>Password</Text>
              <View style={[s.inputWrap, password.length > 0 && s.inputWrapActive]}>
                <Ionicons name="lock-closed-outline" size={20} color={password.length > 0 ? ACCENT : "#9CA3AF"} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={s.input}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              style={s.forgotRow}
            >
              <Text style={s.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignin}
              disabled={!isValid || isPending}
              activeOpacity={0.8}
              style={s.signInBtnWrap}
            >
              <LinearGradient
                colors={!isValid || isPending ? ["#9CA3AF", "#9CA3AF"] : ["#213400", "#2E4A0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.signInGrad}
              >
                <Text style={s.signInText}>
                  {isPending ? "Signing in…" : "Sign In"}
                </Text>
                {!isPending && <Ionicons name="arrow-forward" size={20} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ── Footer ─────────────────────────────────── */}
          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={s.footerLink}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  // ── Back ─────────────────────────────────────────────
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  // ── Header ─────────────────────────────────────────────
  header: { alignItems: "center", marginBottom: 32 },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3FCF1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },

  // ── Error ─────────────────────────────────────────────
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#DC2626",
    flex: 1,
  },

  // ── Form ──────────────────────────────────────────────
  form: { marginBottom: 24 },
  fieldGroup: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapActive: {
    borderColor: ACCENT,
    shadowOpacity: 0.06,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#1A1A2E",
    height: "100%",
  },
  eyeBtn: { padding: 4 },

  // ── Forgot ────────────────────────────────────────────
  forgotRow: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: ACCENT,
  },

  // ── Sign In ───────────────────────────────────────────
  signInBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signInGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signInText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },

  // ── Footer ────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: ACCENT,
  },
});
