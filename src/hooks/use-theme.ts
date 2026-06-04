import { useContext } from 'react';

import { Colors } from '@/constants/theme';
import type { ColorScheme, Theme } from '@/constants/theme';
import { ThemeContext } from '@/components/theme-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;

  const raw = useColorScheme();
  const scheme: ColorScheme = raw === 'dark' ? 'dark' : 'light';
  return {
    colors: Colors[scheme],
    scheme,
    fonts: {} as Theme['fonts'],
    spacing: {} as Theme['spacing'],
    isDark: scheme === 'dark',
  } as Theme;
}
