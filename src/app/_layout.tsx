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

// import { useColorScheme } from "@/hooks/useColorScheme";
// import { setupInterceptors } from "@/constants/api";
// import { useEffect } from "react";
// import { useTokenStorage } from "@/hooks/useTokenStorage";


export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [ fontLoaded ] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  // const { getAccessToken, setAccessToken } = useTokenStorage();

  // useEffect(() => {
  //   setupInterceptors({ getAccessToken, setAccessToken });
  // }, [getAccessToken, setAccessToken]);

  if (!fontLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
