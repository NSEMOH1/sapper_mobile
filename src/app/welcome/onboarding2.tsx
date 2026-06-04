import { router } from "expo-router";
import { ArrowRight, Wallet } from "lucide-react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";

export default function Onboarding2() {
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
        <View style={styles.iconContainer}>
          <Wallet size={72} color="#fff" strokeWidth={1.5} />
        </View>
      </View>

      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 24, backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Your Financial Future{'\n'}Starts Here</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Access savings, loans, and investment opportunities designed for our
          members.
        </Text>

        <View style={styles.footer}>
          <View style={styles.indicators}>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={() => router.push("/welcome/onboarding3")}
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
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
  title: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginTop: 10,
    lineHeight: 24,
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
