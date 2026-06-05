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
import { useTheme } from "@/hooks/use-theme";

export default function LoginScreen() {
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { colors, isDark } = useTheme();

  const { mutate: login, isPending, error, reset } = useLogin();


  const errorMessage = error?.message || (error ? "Login failed. Please check your credentials." : "");
    // error instanceof Error ? error.message : error ? "Login failed. Please check your credentials." : "";

  const handleSignin = () => {
    reset();
    login({ service_number: serviceNumber, password });
  };

  const isValid = serviceNumber.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => router.back()} style={[s.backBtn, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={s.header}>
            <View style={[s.logoWrap, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
            </View>
            <Text style={[s.title, { color: colors.text }]}>Welcome back</Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>Sign in to your account</Text>
          </View>

          {errorMessage ? (
            <View style={[s.errorBox, {
              backgroundColor: isDark ? "#3B1A1A" : "#FEF2F2",
              borderColor: isDark ? "#5C2020" : "#FEE2E2",
            }]}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={[s.errorText, { color: colors.error }]}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={s.form}>
            <View style={s.fieldGroup}>
              <Text style={[s.label, { color: colors.text }]}>Service Number</Text>
              <View style={[
                s.inputWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
                serviceNumber.length > 0 && { borderColor: colors.primary },
              ]}>
                <Ionicons name="id-card-outline" size={20} color={serviceNumber.length > 0 ? colors.primary : colors.textSecondary} />
                <TextInput
                  placeholder="Enter your service number"
                  placeholderTextColor={colors.textSecondary}
                  value={serviceNumber}
                  onChangeText={setServiceNumber}
                  style={[s.input, { color: colors.text }]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={s.fieldGroup}>
              <Text style={[s.label, { color: colors.text }]}>Password</Text>
              <View style={[
                s.inputWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
                password.length > 0 && { borderColor: colors.primary },
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color={password.length > 0 ? colors.primary : colors.textSecondary} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={[s.input, { color: colors.text }]}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              style={s.forgotRow}
            >
              <Text style={[s.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignin}
              disabled={!isValid || isPending}
              activeOpacity={0.8}
              style={[s.signInBtnWrap, { shadowColor: colors.primary }]}
            >
              <LinearGradient
                colors={!isValid || isPending ? ["#9CA3AF", "#9CA3AF"] : [colors.primary, "#2E4A0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.signInGrad}
              >
                <Text style={s.signInText}>
                  {isPending ? "Signing in\u2026" : "Sign In"}
                </Text>
                {!isPending && <Ionicons name="arrow-forward" size={20} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={s.footer}>
            <Text style={[s.footerText, { color: colors.textSecondary }]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={[s.footerLink, { color: colors.primary }]}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
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

  header: { alignItems: "center", marginBottom: 32 },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },

  form: { marginBottom: 24 },
  fieldGroup: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    height: "100%",
  },
  eyeBtn: { padding: 4 },

  forgotRow: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },

  signInBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
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
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
});
