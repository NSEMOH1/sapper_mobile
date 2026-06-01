import {
  DefaultTheme,
  ThemeProvider
} from "expo-router/react-navigation";

import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { useTokenStorage } from "@/hooks/useTokenStorage";
import { useAuthStore } from "@/hooks/useAuth"; 
import { setupInterceptors } from "@/constants/api";

function InterceptorSetup() {
  const { getAccessToken, setAccessToken, removeAccessToken } = useTokenStorage();
 
  useEffect(() => {
    setupInterceptors({
      getAccessToken,
      setAccessToken,
      removeAccessToken,
      // Inject logout without api.ts ever importing useAuthStore
      onUnauthenticated: () => useAuthStore.getState().logout(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return null;
}
 

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });


  if (!fontLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InterceptorSetup />
      <ThemeProvider value={DefaultTheme as any}>
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
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
