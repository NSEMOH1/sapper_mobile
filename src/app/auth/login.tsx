// src/app/auth/login.tsx
import { useLogin } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");

  // useLogin() wraps the API call in a React Query mutation.
  // - isPending: true while the request is in-flight
  // - error: populated on failure, null otherwise
  // - mutate: fire the login request
  const { mutate: login, isPending, error, reset } = useLogin();

  const errorMessage =
    error instanceof Error ? error.message : error ? "Login failed. Please check your credentials." : "";

  const handleSignin = () => {
    reset(); // Clear any previous error
    login({ service_number: serviceNumber, password });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.greenCard}>
          <Image
            source={require("@/assets/images/sappper-logo.png")}
            style={styles.logo}
          />
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.greenTitle}>
              SAPPERS MULTIPURPOSE COOPERATIVE SOCIETY LIMITED (BONNY CAMP)
            </Text>
            <Text style={styles.greenSubtitle}>
              Fast and Easy Cooperative — supporting over 1000 members in
              achieving their financial goals.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          {errorMessage ? (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
              {errorMessage}
            </Text>
          ) : null}

          <View style={styles.headerRow}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={{ fontWeight: "bold" }}>Sappers</Text>
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={styles.signupText}>
                No Account?{" "}
                <Text style={{ color: "#82B921" }}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.signInTitle}>Sign in</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.googleBtn}>
              <Image
                source={require("@/assets/images/google.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("@/assets/images/facebook.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("@/assets/images/apple.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Enter your Service Number</Text>
          <TextInput
            placeholder="Service Number"
            value={serviceNumber}
            onChangeText={setServiceNumber}
            style={styles.input}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Enter your Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginBottom: 20 }}
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={{ color: "#007BFF", fontSize: 12 }}>
              Forgot Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignin} disabled={isPending}>
            <LinearGradient
              colors={["#82B921", "#4D7300"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInBtn}
            >
              <Text style={styles.signInText}>
                {isPending ? "Signing in…" : "Sign in"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greenCard: {
    backgroundColor: "#6A9819",
    flexDirection: "row",
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 100,
    margin: 15,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  greenTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  greenSubtitle: {
    fontSize: 11,
    color: "#fff",
    lineHeight: 16,
    fontFamily: "Poppins_400Regular",
  },
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 30,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  signupText: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: "row",
    backgroundColor: "#E9F1FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
  },
  googleText: {
    fontSize: 12,
    marginLeft: 8,
    color: "#4285F4",
    fontFamily: "Poppins_400Regular",
  },
  socialIcon: { width: 20, height: 20, resizeMode: "contain" },
  iconBtn: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  iconSmall: { width: 20, height: 20, resizeMode: "contain" },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  signInBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
});