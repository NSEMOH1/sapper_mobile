import {
  DefaultTheme,
  DarkTheme,
  ThemeProvider as NavThemeProvider,
} from "expo-router/react-navigation";

import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { queryClient } from "@/lib/queryClient";
import { useTokenStorage } from "@/hooks/useTokenStorage";
import { useAuthStore } from "@/hooks/useAuth"; 
import { setupInterceptors } from "@/constants/api";
import { ThemeProvider } from "@/components/theme-provider";

function InterceptorSetup() {
  const { getAccessToken, setAccessToken, removeAccessToken } = useTokenStorage();
 
  useEffect(() => {
    setupInterceptors({
      getAccessToken,
      setAccessToken,
      removeAccessToken,
      onUnauthenticated: () => useAuthStore.getState().logout(),
    });
  }, []);
 
  return null;
}

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const scheme = useColorScheme();
  const navTheme = useMemo(
    () => (scheme === 'dark' ? DarkTheme : DefaultTheme),
    [scheme],
  );

  if (!fontLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InterceptorSetup />
      <ThemeProvider>
        <NavThemeProvider value={navTheme}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="welcome"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="auth"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="withdrawal"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="payments"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="transactions"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="notifications"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </NavThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
