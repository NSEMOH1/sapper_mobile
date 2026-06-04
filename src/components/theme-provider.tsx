import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';

import { Colors, Fonts, Spacing, type ColorScheme, type Theme } from '@/constants/theme';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const raw = useColorScheme();
  const scheme: ColorScheme = raw === 'dark' ? 'dark' : 'light';

  const theme = useMemo<Theme>((): any => {
    const colors = Colors[scheme];
    if (process.env.EXPO_OS === 'web') {
      SystemUI.setBackgroundColorAsync(colors.background);
    }
    return {
      colors,
      scheme,
      fonts: Fonts,
      spacing: Spacing,
      isDark: scheme === 'dark',
    };
  }, [scheme]);

  return (
    <ThemeContext.Provider value={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
