import { router } from "expo-router";
import { Handshake } from "lucide-react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_COMPLETED_KEY } from "../index";
import { useTheme } from "@/hooks/use-theme";

export default function Onboarding3() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ["#1a2e0a", "#213400", "#2E4A0B"] : ["#213400", "#2E4A0B", "#3A5C15"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Handshake size={72} color="#fff" strokeWidth={1.5} />
        </View>
      </View>

      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 24, backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Together, We Grow</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Empowering our members through unity, trust, and financial service.
        </Text>

        <View style={styles.footer}>
          <View style={styles.indicators}>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary, "#00853c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.getStartedGradient}
          >
            <Text style={[styles.getStartedText, { color: colors.onPrimary }]}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowOpacity: 0.15,
    shadowRadius: 20,
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
    alignItems: "center",
    marginTop: 36,
    marginBottom: 24,
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
  getStartedButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#00612c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  getStartedGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedText: {
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
  },
});
