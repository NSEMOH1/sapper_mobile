import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',

    primary: '#213400',
    onPrimary: '#ffffff',
    primaryLight: '#ccfdc2',

    success: '#4CAF50',
    onSuccess: '#ffffff',
    error: '#EF4444',
    onError: '#ffffff',
    warning: '#F59E0B',

    card: '#ffffff',
    border: '#E5E7EB',
    borderLight: '#F0F0F0',

    tabBarBackground: '#ffffff',
    tabBarBorder: 'rgba(0,0,0,0.1)',
    tabBarActive: '#213400',
    tabBarInactive: '#8E8E93',

    inputBackground: '#F5F7FA',
    overlay: 'rgba(0,0,0,0.5)',
    shimmer: '#E8E8E8',
  },
  dark: {
    text: '#ffffff',
    background: '#1C1C1E',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',

    primary: '#558601',
    onPrimary: '#ffffff',
    primaryLight: '#4CAF50',

    success: '#4CAF50',
    onSuccess: '#ffffff',
    error: '#EF4444',
    onError: '#ffffff',
    warning: '#F59E0B',

    card: '#292828',
    border: '#38383A',
    borderLight: '#2C2C2E',

    tabBarBackground: '#1C1C1E',
    tabBarBorder: 'rgba(255,255,255,0.1)',
    tabBarActive: '#4CAF50',
    tabBarInactive: '#8E8E93',

    inputBackground: '#2C2C2E',
    overlay: 'rgba(0,0,0,0.7)',
    shimmer: '#2C2C2E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  colors: typeof Colors.dark | typeof Colors.light;
  scheme: ColorScheme;
  fonts: typeof Fonts;
  spacing: typeof Spacing;
  isDark: boolean;
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
