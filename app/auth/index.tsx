import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function AuthIndex() {
  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Welcome</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign Up</Text>
        <TouchableOpacity onPress={handleSignUp} style={{ borderRadius: 8 }}>
          <LinearGradient
            colors={["#814608", "#606E14", "#4F5D02"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.gradientButtonText}>Personnel Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.dividerText}>--------------------------------- OR ---------------------------------</Text>

        <Text onPress={handleLogin} style={styles.loginText}>
          Already have an account? Sign In
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerLink}>Terms & Conditions</Text>
          <Text style={styles.footerLink}>Support</Text>
          <Text style={styles.footerLink}>Customer Care</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Image
          source={require("../../assets/images/sappper-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.bottomWelcome}>Welcome To</Text>
        <Text style={styles.bottomTitle}>
          Sappers Multipurpose Corporative {"\n"}Multipurpose Society
        </Text>
        <Text style={styles.bottomDescription}>
          A cooperative society is an organization owned and operated by a group
          of individuals for their mutual benefit. Members come together to meet
          common economic, social, and cultural needs, pooling resources to
          achieve goals that might be difficult to attain individually.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#111",
    marginBottom: 40,
    height: 450
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 40,
  },
  gradientButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
  dividerText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    marginTop: 30
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  footerLink: {
    color: "#fff",
    fontSize: 11,
  },
  bottomSection: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  bottomWelcome: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 5,
  },
  bottomTitle: {
    color: "#ff0000",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  bottomDescription: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
