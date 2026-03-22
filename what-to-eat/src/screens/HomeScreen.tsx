import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { logMeal } from '../services/mealService';
import { getRecommendations } from '../services/recommendationService';
import { ScoredMeal } from '../types';
import { spacing } from '../utils/theme';

function dayLabel(days: number): string {
  if (days >= 999) return 'Never made';
  if (days < 1) return 'Made today';
  if (days < 2) return 'Made yesterday';
  return `Last made ${Math.floor(days)} days ago`;
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [recommendations, setRecommendations] = useState<ScoredMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [choosing, setChoosing] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (recommendations.length === 0) {
      setLoading(true);
    }
    setError('');
    try {
      const data = await getRecommendations();
      setRecommendations(data);
    } catch {
      setError('Failed to load recommendations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [recommendations.length]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function handleChoose(meal: ScoredMeal) {
    Alert.alert(
      'Log this meal?',
      `This will log "${meal.name}" and update your inventory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setChoosing(meal.id);
            try {
              await logMeal(meal.id);
              await load(false);
            } catch {
              Alert.alert('Error', 'Failed to log meal. Please try again.');
            } finally {
              setChoosing(null);
            }
          },
        },
      ]
    );
  }

  const bg = isDark ? '#1c1917' : '#fafaf9';
  const surface = isDark ? '#292524' : '#ffffff';
  const border = isDark ? '#44403c' : '#e7e5e4';
  const textMuted = isDark ? '#a8a29e' : '#78716c';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load(true)}
          tintColor="#f59e0b"
        />
      }
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text variant="headlineMedium" style={styles.title}>What should you cook?</Text>
        <Text variant="bodySmall" style={{ color: textMuted }}>{todayLabel()}</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <Text variant="bodyMedium" style={{ color: textMuted }}>Finding suggestions...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text variant="bodyMedium" style={{ color: '#dc2626' }}>{error}</Text>
          <Button mode="outlined" onPress={() => load()} style={{ marginTop: spacing.md }}>
            Try Again
          </Button>
        </View>
      ) : recommendations.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="bodyMedium" style={{ color: textMuted, textAlign: 'center' }}>
            No suggestions right now.{'\n'}
            Try updating your inventory or adding more meals.
          </Text>
          <View style={styles.emptyActions}>
            <Button
              mode="outlined"
              onPress={() => (navigation as any).navigate('Inventory')}
              style={styles.emptyBtn}
            >
              Update Inventory
            </Button>
            <Button
              mode="outlined"
              onPress={() => (navigation as any).navigate('Catalog')}
              style={styles.emptyBtn}
            >
              Browse Meals
            </Button>
          </View>
        </View>
      ) : (
        <>
          {recommendations.map((meal) => (
            <View key={meal.id} style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
              {meal.photo_url ? (
                <Image source={{ uri: meal.photo_url }} style={styles.photo} />
              ) : (
                <View style={[styles.photoPlaceholder, { backgroundColor: isDark ? '#44403c' : '#e7e5e4' }]}>
                  <Text style={{ color: textMuted, fontSize: 40 }}>🍽️</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text variant="titleMedium" style={styles.mealName}>{meal.name}</Text>
                <Text variant="bodySmall" style={{ color: textMuted, marginBottom: spacing.xs }}>
                  {meal.time_category ? `⏱️ ${meal.time_category}  ` : ''}
                  📅 {dayLabel(meal.daysSinceLastMade)}
                </Text>
                {meal.matchedIngredients.length > 0 && (
                  <Text variant="bodySmall" style={{ color: '#16a34a', marginBottom: 2 }}>
                    ✓ Have: {meal.matchedIngredients.slice(0, 3).join(', ')}
                    {meal.matchedIngredients.length > 3 ? ` +${meal.matchedIngredients.length - 3} more` : ''}
                  </Text>
                )}
                {meal.missingIngredients.length > 0 && (
                  <Text variant="bodySmall" style={{ color: '#dc2626', marginBottom: spacing.sm }}>
                    ✗ Need: {meal.missingIngredients.slice(0, 3).join(', ')}
                    {meal.missingIngredients.length > 3 ? ` +${meal.missingIngredients.length - 3} more` : ''}
                  </Text>
                )}
                <Button
                  mode="contained"
                  onPress={() => handleChoose(meal)}
                  loading={choosing === meal.id}
                  disabled={choosing !== null}
                  style={styles.chooseBtn}
                  buttonColor="#f59e0b"
                >
                  Choose This Meal
                </Button>
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: textMuted, textAlign: 'center', marginBottom: spacing.sm }}>
              Swipe down for new suggestions
            </Text>
            <Button
              mode="outlined"
              onPress={() => (navigation as any).navigate('Catalog')}
            >
              Browse All Meals
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { fontWeight: '700', marginBottom: 4 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    marginTop: 60,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  emptyBtn: { flex: 1 },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: 180, resizeMode: 'cover' },
  photoPlaceholder: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: spacing.md },
  mealName: { fontWeight: '700', marginBottom: spacing.xs },
  chooseBtn: { marginTop: spacing.xs },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
});
