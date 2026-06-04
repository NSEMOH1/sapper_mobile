import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";

export default function Onboarding1() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ["#1a2e0a", "#213400", "#2E4A0B"] : ["#213400", "#2E4A0B", "#3A5C15"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        style={[styles.skipButton, { top: insets.top + 16 }]}
        onPress={() => router.push("/welcome/onboarding3")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.topSection}>
        <View style={styles.logoGlow}>
          <Image
            source={require("@/assets/images/sappper-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 24, backgroundColor: colors.card }]}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome to</Text>
        <Text style={[styles.title, { color: colors.primary }]}>Sappers</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Multipurpose Cooperative Society</Text>

        <View style={styles.footer}>
          <View style={styles.indicators}>
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={() => router.push("/welcome/onboarding2")}
            activeOpacity={0.8}
          >
            <ArrowRight size={22} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  skipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  logo: {
    width: 90,
    height: 90,
  },
  bottomCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  greeting: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginTop: 6,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 36,
  },
  indicators: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
