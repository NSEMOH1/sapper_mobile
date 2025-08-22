import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function LoginScreen() {
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    router.push('/auth/signup')
  }

  const handleSignin = () => {
    router.push('/(tabs)')
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.greenCard}>
          <Image
            source={require("../../assets/images/sappper-logo.png")}
            style={styles.logo}
          />
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.greenTitle}>
              SAPPERS MULTIPURPOSE COOPERATIVE SOCIETY LIMITED (BONNY CAMP)
            </Text>
            <Text style={styles.greenSubtitle}>
              Fast and Easy Cooperative Sappers Multipurpose Cooperative Society
              supports over 1000 members in achieving their financial goals —
              helping them save consistently, access affordable loans, and grow
              with ease.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.headerRow}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={{ fontWeight: "bold" }}>Sappers</Text>
            </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>
                No Account ? <Text style={{ color: "#82B921" }}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.signInTitle}>Sign in</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.googleBtn}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("../../assets/images/facebook.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require("../../assets/images/apple.png")}
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
          />

          <Text style={styles.label}>Enter your Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 20 }} onPress={handleForgotPassword}>
            <Text style={{ color: "#007BFF", fontSize: 12 }}>
              Forgot Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignin}>
            <LinearGradient
              colors={["#82B921", "#4D7300"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInBtn}
            >
              <Text style={styles.signInText}>Sign in</Text>
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
  },
  greenSubtitle: {
    fontSize: 11,
    color: "#fff",
    lineHeight: 16,
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
  },
  signupText: {
    fontSize: 12,
    color: "#555",
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  iconBtn: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  iconSmall: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
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
  },
});
