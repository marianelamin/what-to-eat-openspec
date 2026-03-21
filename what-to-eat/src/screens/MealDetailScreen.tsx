import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Text, ActivityIndicator, Divider, Button, TextInput, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  fetchMealWithIngredients,
  logMeal,
  archiveMeal,
  restoreMeal,
  deleteMeal,
  updateMeal,
  uploadMealPhoto,
} from '../services/mealService';
import { fetchInventory } from '../services/inventoryService';
import { supabase } from '../services/supabase';
import { Meal, MealIngredient, InventoryItem } from '../types';

function isAvailable(ingredientName: string, inventory: InventoryItem[]): boolean {
  const ing = ingredientName.toLowerCase();
  return inventory.some((item) => {
    const n = parseInt(item.quantity ?? '', 10);
    if (!isNaN(n) && n <= 0) return false;
    const inv = item.name.toLowerCase();
    return inv.includes(ing) || ing.includes(inv);
  });
}
import { CatalogStackParamList } from '../navigation/CatalogNavigator';

type MealDetailRouteProp = RouteProp<CatalogStackParamList, 'MealDetail'>;

const { width: screenWidth } = Dimensions.get('window');

// ---- MealPage: display + edit logic for a single meal ----

function MealPage({
  meal: initialMeal,
  onMealMutated,
  onEditingChange,
}: {
  meal: Meal;
  onMealMutated?: () => void;
  onEditingChange: (editing: boolean) => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [meal, setMeal] = useState<Meal>(initialMeal);
  const [ingredients, setIngredients] = useState<MealIngredient[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRecipe, setEditRecipe] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editMealType, setEditMealType] = useState<'all_day' | 'breakfast'>('all_day');
  const [editPhotoUri, setEditPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMealWithIngredients(initialMeal.id), fetchInventory()])
      .then(([{ ingredients: ing }, inv]) => {
        setIngredients(ing);
        setInventory(inv);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialMeal.id]);

  function enterEditMode() {
    setEditName(meal.name);
    setEditRecipe(meal.recipe ?? '');
    setEditIngredients(ingredients.map((i) => i.ingredient_name).join('\n'));
    setEditMealType(meal.meal_type ?? 'all_day');
    setEditPhotoUri(null);
    setIsEditing(true);
    onEditingChange(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    onEditingChange(false);
  }

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setEditPhotoUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter a meal name.');
      return;
    }
    setSaving(true);
    try {
      let photo_url = meal.photo_url;
      if (editPhotoUri) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) photo_url = await uploadMealPhoto(editPhotoUri, user.id);
      }
      const ingLines = editIngredients.split('\n').map((l) => l.trim()).filter(Boolean);
      await updateMeal(meal.id, {
        name: trimmedName,
        recipe: editRecipe.trim() || null,
        photo_url,
        ingredients: ingLines,
        meal_type: editMealType,
      });
      const updatedMeal = { ...meal, name: trimmedName, recipe: editRecipe.trim() || null, photo_url };
      setMeal(updatedMeal);
      setIngredients(ingLines.map((ing, idx) => ({
        id: String(idx),
        meal_id: meal.id,
        ingredient_name: ing,
        quantity: null,
        created_at: '',
      })));
      setIsEditing(false);
      onEditingChange(false);
      onMealMutated?.();
    } catch {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleChoose() {
    Alert.alert(
      'Log this meal?',
      `This will log "${meal.name}" and update your inventory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setActioning(true);
            try {
              await logMeal(meal.id);
              onMealMutated?.();
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to log meal. Please try again.');
            } finally {
              setActioning(false);
            }
          },
        },
      ]
    );
  }

  function handleArchive() {
    Alert.alert(
      'Archive this meal?',
      'This meal will be hidden from suggestions. You can restore it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            setActioning(true);
            try {
              await archiveMeal(meal.id);
              onMealMutated?.();
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to archive meal. Please try again.');
            } finally {
              setActioning(false);
            }
          },
        },
      ]
    );
  }

  async function handleRestore() {
    setActioning(true);
    try {
      await restoreMeal(meal.id);
      onMealMutated?.();
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to restore meal. Please try again.');
    } finally {
      setActioning(false);
    }
  }

  function handleDeletePermanently() {
    Alert.alert(
      'Delete permanently?',
      'This meal and all its data will be removed. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActioning(true);
            try {
              await deleteMeal(meal.id);
              onMealMutated?.();
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to delete meal. Please try again.');
            } finally {
              setActioning(false);
            }
          },
        },
      ]
    );
  }

  const placeholderBg = isDark ? '#292524' : '#e7e5e4';
  const mutedColor = isDark ? '#a8a29e' : '#78716c';
  const photoToShow = editPhotoUri ?? meal.photo_url;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Photo */}
        {isEditing ? (
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.8}>
            {photoToShow ? (
              <Image source={{ uri: photoToShow }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, { backgroundColor: placeholderBg, justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="camera-plus" size={48} color={mutedColor} />
                <Text style={{ color: mutedColor, marginTop: 8 }}>Tap to add photo</Text>
              </View>
            )}
            {photoToShow && (
              <View style={styles.photoEditOverlay}>
                <MaterialCommunityIcons name="camera-edit" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ) : meal.photo_url ? (
          <Image source={{ uri: meal.photo_url }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, { backgroundColor: placeholderBg, justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialCommunityIcons name="food" size={64} color={mutedColor} />
          </View>
        )}

        <View style={styles.content}>
          {/* Archived banner */}
          {meal.is_archived && !isEditing && (
            <View style={styles.archivedBanner}>
              <MaterialCommunityIcons name="archive" size={14} color="#92400e" />
              <Text style={styles.archivedBannerText}>Archived</Text>
            </View>
          )}

          {/* Name */}
          {isEditing ? (
            <TextInput
              label="Meal name *"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={styles.editInput}
            />
          ) : (
            <Text variant="headlineMedium" style={styles.name}>{meal.name}</Text>
          )}

          {loading && <ActivityIndicator style={styles.loader} />}

          {/* Meal type */}
          {isEditing && (
            <View style={[styles.chipRow, styles.editInput]}>
              <Chip
                selected={editMealType === 'breakfast'}
                onPress={() => setEditMealType('breakfast')}
                showSelectedOverlay
              >
                Breakfast
              </Chip>
              <Chip
                selected={editMealType === 'all_day'}
                onPress={() => setEditMealType('all_day')}
                showSelectedOverlay
              >
                All Day
              </Chip>
            </View>
          )}

          {/* Ingredients */}
          {isEditing ? (
            <TextInput
              label="Ingredients (one per line)"
              value={editIngredients}
              onChangeText={setEditIngredients}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.editInput}
            />
          ) : (
            !loading && ingredients.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleSmall" style={styles.sectionTitle}>Ingredients</Text>
                <Divider style={styles.divider} />
                {ingredients.map((ing) => {
                  const have = isAvailable(ing.ingredient_name, inventory);
                  return (
                    <View key={ing.id} style={styles.ingredientRow}>
                      <View style={[styles.ingredientDot, { backgroundColor: have ? '#16a34a' : '#a8a29e' }]} />
                      <Text variant="bodyMedium" style={styles.ingredient}>
                        {ing.ingredient_name}{ing.quantity ? ` — ${ing.quantity}` : ''}
                      </Text>
                      <Text style={[styles.availabilityLabel, { color: have ? '#16a34a' : '#a8a29e' }]}>
                        {have ? 'have' : 'missing'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )
          )}

          {/* Recipe / Notes */}
          {isEditing ? (
            <TextInput
              label="Recipe / Notes"
              value={editRecipe}
              onChangeText={setEditRecipe}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.editInput}
            />
          ) : (
            !loading && !!meal.recipe && (
              <View style={styles.section}>
                <Text variant="titleSmall" style={styles.sectionTitle}>Notes / Recipe</Text>
                <Divider style={styles.divider} />
                <Text variant="bodyMedium" style={styles.recipe}>{meal.recipe}</Text>
              </View>
            )
          )}

          {/* Action buttons */}
          {isEditing ? (
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                buttonColor="#f59e0b"
                style={styles.actionBtn}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                disabled={saving}
                style={styles.actionBtn}
              >
                Cancel
              </Button>
            </View>
          ) : meal.is_archived ? (
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleRestore}
                loading={actioning}
                disabled={actioning}
                buttonColor="#16a34a"
                style={styles.actionBtn}
              >
                Restore Meal
              </Button>
              <Button
                mode="outlined"
                onPress={handleDeletePermanently}
                disabled={actioning}
                textColor="#dc2626"
                style={[styles.actionBtn, { borderColor: '#dc2626' }]}
              >
                Delete Permanently
              </Button>
            </View>
          ) : (
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleChoose}
                loading={actioning}
                disabled={actioning}
                buttonColor="#f59e0b"
                style={styles.actionBtn}
              >
                Choose This Meal
              </Button>
              <Button
                mode="outlined"
                onPress={enterEditMode}
                disabled={actioning}
                style={styles.actionBtn}
              >
                Edit Meal
              </Button>
              <Button
                mode="outlined"
                onPress={handleArchive}
                disabled={actioning}
                style={styles.actionBtn}
              >
                Archive
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---- MealDetailScreen: horizontal pager ----

export function MealDetailScreen() {
  const route = useRoute<MealDetailRouteProp>();
  const { meals, initialIndex, onMealMutated } = route.params;

  const [isEditingCurrentPage, setIsEditingCurrentPage] = useState(false);
  const pagerRef = useRef<FlatList<Meal>>(null);

  return (
    <FlatList
      ref={pagerRef}
      data={meals}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      scrollEnabled={!isEditingCurrentPage}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
      onMomentumScrollEnd={() => {
        setIsEditingCurrentPage(false);
      }}
      renderItem={({ item }) => (
        <View style={{ width: screenWidth, flex: 1 }}>
          <MealPage
            meal={item}
            onMealMutated={onMealMutated}
            onEditingChange={setIsEditingCurrentPage}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  photo: { width: '100%', height: 280 },
  photoEditOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: { padding: 16 },
  archivedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  archivedBannerText: { color: '#92400e', fontSize: 13, fontWeight: '600' },
  name: { fontWeight: '700', marginBottom: 16 },
  editInput: { marginBottom: 12 },
  section: { marginBottom: 20 },
  sectionTitle: { opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  divider: { marginBottom: 12 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ingredientDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  ingredient: { flex: 1 },
  availabilityLabel: { fontSize: 11, fontWeight: '600', marginLeft: 6 },
  recipe: { lineHeight: 22 },
  loader: { marginTop: 16 },
  chipRow: { flexDirection: 'row', gap: 8 },
  actions: { marginTop: 8, gap: 10 },
  actionBtn: {},
});
