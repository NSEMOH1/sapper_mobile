import { useAuthStore, useSession } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_MARGIN = 20;
const GRID_WIDTH = width - CARD_MARGIN * 2;

export const ONBOARDING_COMPLETED_KEY = "sappers_onboarding_completed";

function SkeletonBlock({ style, children }: { style?: any; children?: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeleton, { opacity }, style]}>
      {children}
    </Animated.View>
  );
}

function SkeletonHomeLoader() {
  return (
    <SafeAreaView style={styles.loaderContainer}>
      <View style={styles.loaderScroll}>
        {/* Header */}
        <View style={styles.loaderHeader}>
          <View style={{ gap: 6 }}>
            <SkeletonBlock style={{ width: 100, height: 14, borderRadius: 6 }} />
            <SkeletonBlock style={{ width: 140, height: 22, borderRadius: 6 }} />
          </View>
          <View style={styles.loaderHeaderRight}>
            <SkeletonBlock style={{ width: 38, height: 38, borderRadius: 19 }} />
            <SkeletonBlock style={{ width: 30, height: 30, borderRadius: 15 }} />
          </View>
        </View>

        {/* Balance Card */}
        <SkeletonBlock style={styles.loaderBalanceCard}>
          <View style={styles.loaderBalanceInner}>
            <SkeletonBlock style={{ width: 80, height: 12, borderRadius: 6 }} />
            <SkeletonBlock style={{ width: 140, height: 32, borderRadius: 8, marginTop: 8 }} />
            <SkeletonBlock style={{ width: 60, height: 10, borderRadius: 5, marginTop: 4 }} />

            <View style={[styles.loaderBalanceRow, { backgroundColor: "transparent" }]}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <SkeletonBlock style={{ width: 10, height: 10, borderRadius: 5 }} />
                <View style={{ gap: 4 }}>
                  <SkeletonBlock style={{ width: 50, height: 10, borderRadius: 5 }} />
                  <SkeletonBlock style={{ width: 80, height: 14, borderRadius: 6 }} />
                </View>
              </View>
              <SkeletonBlock style={{ width: 1, height: 32 }} />
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <SkeletonBlock style={{ width: 10, height: 10, borderRadius: 5 }} />
                <View style={{ gap: 4 }}>
                  <SkeletonBlock style={{ width: 50, height: 10, borderRadius: 5 }} />
                  <SkeletonBlock style={{ width: 80, height: 14, borderRadius: 6 }} />
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <SkeletonBlock style={{ flex: 1, height: 44, borderRadius: 12 }} />
              <SkeletonBlock style={{ flex: 1, height: 44, borderRadius: 12 }} />
            </View>
          </View>
        </SkeletonBlock>

        {/* Section Title */}
        <SkeletonBlock style={{ width: 120, height: 18, borderRadius: 6, marginLeft: CARD_MARGIN, marginBottom: CARD_GAP }} />

        {/* Quick Actions */}
        <View style={styles.loaderQuickGrid}>
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} style={styles.loaderQuickCard}>
              <SkeletonBlock style={{ width: 44, height: 44, borderRadius: 14, marginBottom: 8 }} />
              <SkeletonBlock style={{ width: 50, height: 12, borderRadius: 6 }} />
            </SkeletonBlock>
          ))}
        </View>

        {/* Section Title + See All */}
        <View style={styles.loaderSectionHead}>
          <SkeletonBlock style={{ width: 130, height: 18, borderRadius: 6 }} />
          <SkeletonBlock style={{ width: 50, height: 14, borderRadius: 6 }} />
        </View>

        {/* Loan Products Grid */}
        <View style={styles.loaderLoanGrid}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} style={styles.loaderLoanCard}>
              <SkeletonBlock style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 8 }} />
              <SkeletonBlock style={{ width: "70%", height: 14, borderRadius: 6 }} />
              <SkeletonBlock style={{ width: "40%", height: 10, borderRadius: 5, marginTop: 4 }} />
            </SkeletonBlock>
          ))}
        </View>

        {/* Transactions Section Header */}
        <SkeletonBlock style={{ width: 160, height: 18, borderRadius: 6, marginLeft: CARD_MARGIN, marginBottom: CARD_GAP }} />
        {[1, 2, 3].map((i) => (
          <SkeletonBlock
            key={`tx-${i}`}
            style={{
              height: 60,
              marginHorizontal: CARD_MARGIN,
              borderRadius: 12,
              marginBottom: 8,
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const { user } = useAuthStore();
  const { isLoading: sessionLoading } = useSession();

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
    ]).then(([onboardingVal]) => {
      // Treat onboarding as done if either flag is set (migration for existing users)
      setOnboardingDone(onboardingVal === "true");
    });
  }, []);

  if (onboardingDone === null || sessionLoading) {
    return <SkeletonHomeLoader />;
  }

  if (!onboardingDone) {
    return <Redirect href="/welcome" />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth" />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E1E9EE",
    overflow: "hidden",
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderScroll: {
    paddingBottom: 32,
  },
  loaderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 8,
    paddingBottom: 16,
  },
  loaderHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loaderBalanceCard: {
    marginHorizontal: CARD_MARGIN,
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
  },
  loaderBalanceInner: {
    padding: 20,
    gap: 4,
  },
  loaderBalanceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  loaderQuickGrid: {
    flexDirection: "row",
    paddingHorizontal: CARD_MARGIN,
    gap: CARD_GAP,
    marginBottom: 24,
  },
  loaderQuickCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  loaderSectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: CARD_MARGIN,
    marginBottom: CARD_GAP,
  },
  loaderLoanGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: CARD_MARGIN,
    gap: CARD_GAP,
    marginBottom: 24,
  },
  loaderLoanCard: {
    width: (GRID_WIDTH - CARD_GAP) / 2,
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
  },
});
