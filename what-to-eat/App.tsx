import React from 'react';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/services/auth';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { lightTheme, darkTheme } from './src/utils/theme';

const amberLight = '#f59e0b';
const amberDark = '#d97706';

function RootNavigator() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      primary: isDark ? amberDark : amberLight,
      background: isDark ? '#1c1917' : '#fafaf9',
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={isDark ? amberDark : amberLight} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const paperTheme = isDark ? darkTheme : lightTheme;

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
