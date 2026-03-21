import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text, Searchbar, FAB, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { fetchAllMeals, createMeal, uploadMealPhoto, logMeal } from '../services/mealService';
import { supabase } from '../services/supabase';
import { Meal } from '../types';
import { CatalogStackParamList } from '../navigation/CatalogNavigator';

type NavProp = NativeStackNavigationProp<CatalogStackParamList, 'CatalogList'>;

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

function MealCard({
  meal,
  onPress,
  onQuickLog,
  isLogging,
}: {
  meal: Meal;
  onPress: () => void;
  onQuickLog: () => void;
  isLogging: boolean;
}) {
  const colorScheme = useColorScheme();
  const placeholderBg = colorScheme === 'dark' ? '#292524' : '#e7e5e4';

  return (
    <TouchableOpacity
      style={[styles.card, meal.is_archived && styles.cardArchived]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {meal.photo_url ? (
        <Image source={{ uri: meal.photo_url }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, { backgroundColor: placeholderBg, justifyContent: 'center', alignItems: 'center' }]}>
          <MaterialCommunityIcons name="food" size={40} color={colorScheme === 'dark' ? '#78716c' : '#a8a29e'} />
        </View>
      )}
      {meal.is_archived && (
        <View style={styles.archivedBadge}>
          <Text style={styles.archivedBadgeText}>Archived</Text>
        </View>
      )}
      {!meal.is_archived && (
        <TouchableOpacity
          style={styles.quickLogBtn}
          onPress={(e) => { e.stopPropagation(); onQuickLog(); }}
          disabled={isLogging}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isLogging ? (
            <ActivityIndicator size={14} color="#fff" />
          ) : (
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      )}
      <View style={styles.cardLabel}>
        <Text variant="labelMedium" numberOfLines={2} style={styles.cardName}>
          {meal.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function CatalogScreen() {
  const navigation = useNavigation<NavProp>();
  const colorScheme = useColorScheme();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fabOpen, setFabOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const [loggingId, setLoggingId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<Meal>>(null);
  const scrollOffsetRef = useRef(0);
  const hasLoadedOnce = useRef(false);

  const loadMeals = useCallback(async () => {
    try {
      const data = await fetchAllMeals();
      setMeals(data);
    } catch {
      // silently fail; empty state handles this
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedOnce.current) {
        hasLoadedOnce.current = true;
        setLoading(true);
        loadMeals();
      } else {
        loadMeals().then(() => {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToOffset({
              offset: scrollOffsetRef.current,
              animated: false,
            });
          });
        });
      }
    }, [loadMeals])
  );

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
  }

  async function handleBulkImport() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 20,
    });

    if (result.canceled || result.assets.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const total = result.assets.length;
    let succeeded = 0;
    let failed = 0;

    setImporting(true);
    for (let i = 0; i < total; i++) {
      setImportProgress(`Importing ${i + 1} of ${total}…`);
      try {
        const photoUrl = await uploadMealPhoto(result.assets[i].uri, user.id);
        await createMeal({ name: 'Unnamed Meal', ingredients: [], photo_url: photoUrl });
        succeeded++;
      } catch {
        failed++;
      }
    }
    setImporting(false);
    setImportProgress('');
    await loadMeals();

    const summary = failed > 0
      ? `${succeeded} meal${succeeded !== 1 ? 's' : ''} added, ${failed} failed.`
      : `${succeeded} meal${succeeded !== 1 ? 's' : ''} added.`;
    Alert.alert('Import complete', summary);
  }

  async function handleQuickLog(meal: Meal) {
    if (loggingId) return;
    setLoggingId(meal.id);
    try {
      await logMeal(meal.id);
      await loadMeals();
    } catch {
      Alert.alert('Error', 'Failed to log meal.');
    } finally {
      setLoggingId(null);
    }
  }

  const filtered = search.trim()
    ? meals.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : meals;

  const accentColor = colorScheme === 'dark' ? '#d97706' : '#f59e0b';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search meals..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
      />
      <FlatList
        ref={flatListRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        ListEmptyComponent={
          <View style={styles.centered}>
            <MaterialCommunityIcons name="food-off" size={48} color="#a8a29e" />
            <Text variant="bodyMedium" style={styles.emptyText}>
              {search ? 'No meals match your search' : 'No meals yet — add your first!'}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <MealCard
            meal={item}
            onPress={() => navigation.navigate('MealDetail', {
              meals: filtered,
              initialIndex: index,
              onMealMutated: loadMeals,
            })}
            onQuickLog={() => handleQuickLog(item)}
            isLogging={loggingId === item.id}
          />
        )}
      />

      {importing && (
        <View style={styles.importOverlay}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.importText}>{importProgress}</Text>
        </View>
      )}

      <FAB.Group
        open={fabOpen}
        visible={!importing}
        icon={fabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'image-multiple',
            label: 'Import photos',
            onPress: handleBulkImport,
          },
          {
            icon: 'pencil-plus-outline',
            label: 'Add meal',
            onPress: () => navigation.navigate('AddMeal'),
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        fabStyle={{ backgroundColor: accentColor }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  searchbar: { margin: 16, marginBottom: 8 },
  grid: { paddingHorizontal: 16, paddingBottom: 80 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: CARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardArchived: { opacity: 0.5 },
  cardImage: { width: CARD_SIZE, height: CARD_SIZE },
  cardLabel: { padding: 8 },
  cardName: { fontWeight: '600' },
  archivedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  archivedBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  quickLogBtn: {
    position: 'absolute',
    bottom: 40,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { marginTop: 12, opacity: 0.6, textAlign: 'center' },
  importOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  importText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
