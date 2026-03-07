import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '../services/auth';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Profile</Text>
      <Text variant="bodyMedium" style={styles.email}>{user?.email}</Text>
      <Button mode="outlined" onPress={signOut} style={styles.signOutButton}>
        Sign Out
      </Button>
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
  email: {
    marginTop: 8,
    opacity: 0.6,
  },
  signOutButton: {
    marginTop: 24,
  },
});
