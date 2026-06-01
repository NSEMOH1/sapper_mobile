import { useAuthStore } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export const ONBOARDING_COMPLETED_KEY = "naowa_onboarding_completed";

export default function HomeScreen() {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const { user, loading } = useAuthStore();

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
      AsyncStorage.getItem("naowa_user_registered"),
    ]).then(([onboardingVal, registrationVal]) => {
      // Treat onboarding as done if either flag is set (migration for existing users)
      setOnboardingDone(onboardingVal === "true" || registrationVal === "true");
    });
  }, []);

  if (onboardingDone === null || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#08772d" />
      </View>
    );
  }

  if (!onboardingDone) {
    return <Redirect href="/welcome" />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth" />;
}
