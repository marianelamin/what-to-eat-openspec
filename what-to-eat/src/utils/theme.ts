import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const amberLight = '#f59e0b';
const amberDark = '#d97706';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: amberLight,
    primaryContainer: '#fef3c7',
    secondary: '#78716c',
    secondaryContainer: '#f5f5f4',
    background: '#fafaf9',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f4',
    error: '#dc2626',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: amberDark,
    primaryContainer: '#451a03',
    secondary: '#a8a29e',
    secondaryContainer: '#292524',
    background: '#1c1917',
    surface: '#292524',
    surfaceVariant: '#292524',
    error: '#f87171',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
