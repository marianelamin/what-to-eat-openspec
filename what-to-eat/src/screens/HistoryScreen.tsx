import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">History</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Your meal history will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.6,
  },
});
