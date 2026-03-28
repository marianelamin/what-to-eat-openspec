import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Button, Chip, FAB, HelperText, Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  bulkAddItems,
  deleteItem,
  fetchInventory,
  updateItem,
} from '../services/inventoryService';
import { InventoryItem } from '../types';
import { spacing } from '../utils/theme';

const CATEGORIES = ['Protein', 'Vegetables', 'Fruit', 'Grains', 'Pantry', 'Other'];
const STALE_DAYS = 3;

const LEVELS = [
  { label: 'Stocked', value: '6' },
  { label: 'Some', value: '4' },
  { label: 'Low', value: '2' },
  { label: 'Out of stock', value: '0' },
];

function nextLevel(current: string | null): { label: string; value: string } {
  const n = parseInt(current ?? '', 10);
  if (isNaN(n)) return LEVELS[0];
  const idx = LEVELS.findIndex((l) => parseInt(l.value, 10) <= n);
  const currentIdx = idx === -1 ? LEVELS.length - 1 : idx;
  return LEVELS[(currentIdx + 1) % LEVELS.length];
}

function parseItemNames(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isStale(items: InventoryItem[]): boolean {
  if (items.length === 0) return true;
  const maxUpdated = Math.max(...items.map((i) => new Date(i.updated_at).getTime()));
  const daysSince = (Date.now() - maxUpdated) / (1000 * 60 * 60 * 24);
  return daysSince > STALE_DAYS;
}

function levelIcon(q: string | null): { name: string; color: string } {
  const n = parseInt(q ?? '', 10);
  if (isNaN(n) || n === 0) return { name: 'battery-outline', color: '#a8a29e' };
  if (n >= 5) return { name: 'battery-high', color: '#f59e0b' };
  if (n >= 3) return { name: 'battery-medium', color: '#f59e0b' };
  return { name: 'battery-low', color: '#f59e0b' };
}

type GroupedSection = { category: string; items: InventoryItem[] };

function groupByCategory(items: InventoryItem[]): GroupedSection[] {
  const map = new Map<string, InventoryItem[]>();
  for (const item of items) {
    const cat = item.category ?? 'Other';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(item);
  }
  return CATEGORIES.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c)! }));
}

function SwipeableRow({
  id,
  isOpen,
  onOpen,
  onDelete,
  children,
}: {
  id: string;
  isOpen: boolean;
  onOpen: (id: string | null) => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();
  const bg = colorScheme === 'dark' ? '#1c1917' : '#fafaf9';
  const translateX = useRef(new Animated.Value(0)).current;

  // Tracks where the row settled after the last gesture (0 = closed, 80 = open)
  const currentX = useRef(0);
  // Captures currentX at the start of each gesture so moves are relative
  const startX = useRef(0);

  // Keep refs fresh for use inside panResponder (avoids stale closures)
  const onOpenRef = useRef(onOpen);
  useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);
  const idRef = useRef(id);
  useEffect(() => { idRef.current = id; }, [id]);

  // Close when parent signals another row opened
  useEffect(() => {
    if (!isOpen) {
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => {
        currentX.current = 0;
      });
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5,
      onPanResponderGrant: () => {
        startX.current = currentX.current;
      },
      onPanResponderMove: (_, { dx }) => {
        const next = Math.max(0, Math.min(90, startX.current + dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_, { dx }) => {
        const projected = startX.current + dx;
        if (projected > 40) {
          Animated.spring(translateX, { toValue: 80, useNativeDriver: true }).start(() => {
            currentX.current = 80;
          });
          onOpenRef.current(idRef.current);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => {
            currentX.current = 0;
          });
          onOpenRef.current(null);
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => {
          currentX.current = 0;
        });
        onOpenRef.current(null);
      },
    })
  ).current;

  return (
    <View style={{ overflow: 'hidden' }}>
      <TouchableOpacity
        style={styles.swipeDeleteBtn}
        onPress={() => {
          onOpen(null);
          onDelete();
        }}
      >
        <Text style={styles.swipeDeleteText}>Delete</Text>
      </TouchableOpacity>
      <Animated.View
        style={{ backgroundColor: bg, transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export function InventoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const badgeAnims = useRef<Map<string, Animated.Value>>(new Map());

  function getBadgeAnim(id: string): Animated.Value {
    if (!badgeAnims.current.has(id)) {
      badgeAnims.current.set(id, new Animated.Value(1));
    }
    return badgeAnims.current.get(id)!;
  }

  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickAddText, setQuickAddText] = useState('');
  const [quickAddKind, setQuickAddKind] = useState<'ingredient' | 'meal_prep'>('ingredient');
  const [quickAddSaving, setQuickAddSaving] = useState(false);
  const [quickAddError, setQuickAddError] = useState('');

  const [openRowId, setOpenRowId] = useState<string | null>(null);

  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await fetchInventory();
      setItems(data);
    } catch {
      // silently fail on reload
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleBadgeTap(inv: InventoryItem) {
    const next = nextLevel(inv.quantity);
    const prev = inv.quantity;

    setItems((current) =>
      current.map((i) => (i.id === inv.id ? { ...i, quantity: next.value } : i))
    );

    const anim = getBadgeAnim(inv.id);
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.4, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    try {
      await updateItem(inv.id, { quantity: next.value });
    } catch {
      setItems((current) =>
        current.map((i) => (i.id === inv.id ? { ...i, quantity: prev } : i))
      );
      Alert.alert('Error', 'Failed to update level. Please try again.');
    }
  }

  async function handleQuickAdd() {
    const names = parseItemNames(quickAddText);
    if (names.length === 0) {
      setQuickAddError('Enter at least one item name');
      return;
    }
    setQuickAddError('');
    setQuickAddSaving(true);
    try {
      const { stocked } = await bulkAddItems(names, quickAddKind);
      setQuickAddText('');
      setQuickAddKind('ingredient');
      setQuickAddVisible(false);
      await load();
      if (stocked > 0) {
        Alert.alert('', `${stocked} item${stocked !== 1 ? 's' : ''} already in inventory — marked as stocked.`);
      }
    } catch {
      setQuickAddError('Failed to save items. Please try again.');
    } finally {
      setQuickAddSaving(false);
    }
  }

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    setEditName(item.name);
    setEditCategory(item.category ?? 'Other');
    setEditError('');
  }

  async function handleEditSave() {
    if (!editItem) return;
    if (!editName.trim()) {
      setEditError('Name is required');
      return;
    }
    setEditError('');
    setEditSaving(true);
    try {
      await updateItem(editItem.id, {
        name: editName.trim(),
        category: editCategory,
      });
      setEditItem(null);
      await load();
    } catch {
      setEditError('Failed to save. Please try again.');
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(item: InventoryItem) {
    setItems((current) => current.filter((i) => i.id !== item.id));
    try {
      await deleteItem(item.id);
    } catch {
      setItems((current) => {
        const existing = current.find((i) => i.id === item.id);
        return existing ? current : [...current, item];
      });
      Alert.alert('Error', 'Failed to delete item.');
    }
  }

  const prepItems = items.filter((i) => i.item_kind === 'meal_prep');
  const ingredientItems = items.filter((i) => i.item_kind !== 'meal_prep');
  const grouped = groupByCategory(ingredientItems);
  const stale = isStale(items);
  const bg = isDark ? '#1c1917' : '#fafaf9';
  const surface = isDark ? '#292524' : '#ffffff';
  const border = isDark ? '#44403c' : '#e7e5e4';
  const textMuted = isDark ? '#a8a29e' : '#78716c';

  const renderItemRow = (inv: InventoryItem) => {
    const icon = levelIcon(inv.quantity);
    return (
      <SwipeableRow
        key={inv.id}
        id={inv.id}
        isOpen={openRowId === inv.id}
        onOpen={setOpenRowId}
        onDelete={() => handleDelete(inv)}
      >
        <View style={[styles.itemRow, { borderBottomColor: border }]}>
          <TouchableOpacity style={styles.itemInfo} onPress={() => { setOpenRowId(null); openEdit(inv); }}>
            <Text variant="bodyLarge">{inv.name}</Text>
          </TouchableOpacity>
          <Animated.View style={{ opacity: getBadgeAnim(inv.id) }}>
            <TouchableOpacity onPress={() => { setOpenRowId(null); handleBadgeTap(inv); }} style={styles.badgeBtn}>
              <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SwipeableRow>
    );
  };

  const renderSection = ({ item: section }: { item: GroupedSection }) => (
    <View style={styles.section}>
      <TouchableOpacity activeOpacity={1} onPress={() => setOpenRowId(null)}>
        <View>
          <Text variant="labelLarge" style={[styles.sectionHeader, { color: textMuted }]}>
            {section.category.toUpperCase()} ({section.items.length})
          </Text>
        </View>
      </TouchableOpacity>
      {section.items.map(renderItemRow)}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>My Inventory</Text>
        <Text variant="bodySmall" style={{ color: textMuted }}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {stale && (
        <View style={styles.staleBanner}>
          <Text variant="bodySmall" style={styles.staleText}>
            {items.length === 0
              ? 'No items yet — tap + to add your ingredients'
              : 'Inventory may be out of date — tap + to refresh'}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <Text variant="bodyMedium" style={{ color: textMuted }}>Loading...</Text>
        </View>
      ) : grouped.length === 0 && prepItems.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="bodyMedium" style={{ color: textMuted, textAlign: 'center' }}>
            Tap the + button to add your ingredients.{'\n'}
            Type or dictate a list — e.g. "chicken, eggs, rice"
          </Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(s) => s.category}
          renderItem={renderSection}
          extraData={openRowId}
          onScrollBeginDrag={() => setOpenRowId(null)}
          ListHeaderComponent={
            prepItems.length > 0 ? (
              <View style={styles.section}>
                <TouchableOpacity activeOpacity={1} onPress={() => setOpenRowId(null)}>
                  <View>
                    <Text variant="labelLarge" style={[styles.sectionHeader, { color: textMuted }]}>
                      MEAL PREP ({prepItems.length})
                    </Text>
                  </View>
                </TouchableOpacity>
                {prepItems.map(renderItemRow)}
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => {
          setQuickAddText('');
          setQuickAddError('');
          setQuickAddKind('ingredient');
          setQuickAddVisible(true);
        }}
      />

      {/* Quick Add Modal */}
      <Modal visible={quickAddVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalSheet, { backgroundColor: surface }]}>
            <Text variant="titleLarge" style={styles.modalTitle}>Quick Add Items</Text>
            <View style={styles.kindChips}>
              <Chip
                selected={quickAddKind === 'ingredient'}
                onPress={() => setQuickAddKind('ingredient')}
                style={styles.chip}
              >
                Ingredients
              </Chip>
              <Chip
                selected={quickAddKind === 'meal_prep'}
                onPress={() => setQuickAddKind('meal_prep')}
                style={styles.chip}
              >
                Meal Prep
              </Chip>
            </View>
            <Text variant="bodySmall" style={{ color: textMuted, marginBottom: spacing.md }}>
              Type or dictate items separated by commas or new lines.{'\n'}
              Tap the mic on your keyboard to use voice.
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              placeholder={'chicken, eggs, broccoli\nrice, olive oil, garlic'}
              value={quickAddText}
              onChangeText={setQuickAddText}
              style={styles.quickAddInput}
              autoFocus
            />
            {quickAddError ? (
              <HelperText type="error">{quickAddError}</HelperText>
            ) : null}
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setQuickAddVisible(false);
                  setQuickAddKind('ingredient');
                }}
                style={styles.modalBtn}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleQuickAdd}
                loading={quickAddSaving}
                disabled={quickAddSaving}
                style={styles.modalBtn}
              >
                Add Items
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={!!editItem} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalSheet, { backgroundColor: surface }]}>
            <Text variant="titleLarge" style={styles.modalTitle}>Edit Item</Text>
            <TextInput
              mode="outlined"
              label="Name"
              value={editName}
              onChangeText={setEditName}
              style={styles.editInput}
            />
            <Text variant="labelMedium" style={[styles.categoryLabel, { color: textMuted }]}>
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  selected={editCategory === cat}
                  onPress={() => setEditCategory(cat)}
                  style={styles.chip}
                >
                  {cat}
                </Chip>
              ))}
            </ScrollView>
            {editError ? <HelperText type="error">{editError}</HelperText> : null}
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setEditItem(null)}
                style={styles.modalBtn}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleEditSave}
                loading={editSaving}
                disabled={editSaving}
                style={styles.modalBtn}
              >
                Save
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { fontWeight: '700' },
  staleBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: spacing.sm,
  },
  staleText: { color: '#92400e' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  section: { paddingTop: spacing.sm },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemInfo: { flex: 1, paddingVertical: 4 },
  badgeBtn: { paddingHorizontal: spacing.xs, paddingVertical: 4 },
  swipeDeleteBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeDeleteText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  fab: { position: 'absolute', right: spacing.lg, backgroundColor: '#f59e0b' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalTitle: { fontWeight: '700', marginBottom: spacing.sm },
  kindChips: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  quickAddInput: { minHeight: 120, marginBottom: spacing.xs },
  editInput: { marginBottom: spacing.sm },
  categoryLabel: { marginBottom: spacing.xs },
  chips: { flexDirection: 'row', marginBottom: spacing.sm },
  chip: { marginRight: spacing.xs },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalBtn: { flex: 1 },
});
