import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Button, Chip, FAB, HelperText, Text, TextInput } from 'react-native-paper';
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

function quantityLabel(q: string | null): string {
  const n = parseInt(q ?? '', 10);
  if (isNaN(n)) return q ?? '—';
  if (n >= 5) return 'Stocked';
  if (n >= 3) return 'Some';
  if (n >= 1) return 'Low';
  return 'Out of stock';
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
  const [quickAddSaving, setQuickAddSaving] = useState(false);
  const [quickAddError, setQuickAddError] = useState('');

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

  useEffect(() => {
    load();
  }, [load]);

  async function handleBadgeTap(inv: InventoryItem) {
    const next = nextLevel(inv.quantity);
    const prev = inv.quantity;

    // Optimistic update
    setItems((current) =>
      current.map((i) => (i.id === inv.id ? { ...i, quantity: next.value } : i))
    );

    // Pulse animation
    const anim = getBadgeAnim(inv.id);
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.4, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    try {
      await updateItem(inv.id, { quantity: next.value });
    } catch {
      // Revert on failure
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
      await bulkAddItems(names);
      setQuickAddText('');
      setQuickAddVisible(false);
      await load();
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
    Alert.alert('Delete Item', `Remove "${item.name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem(item.id);
            await load();
          } catch {
            Alert.alert('Error', 'Failed to delete item.');
          }
        },
      },
    ]);
  }

  const grouped = groupByCategory(items);
  const stale = isStale(items);
  const bg = isDark ? '#1c1917' : '#fafaf9';
  const surface = isDark ? '#292524' : '#ffffff';
  const border = isDark ? '#44403c' : '#e7e5e4';
  const textMuted = isDark ? '#a8a29e' : '#78716c';

  const renderSection = ({ item: section }: { item: GroupedSection }) => (
    <View style={styles.section}>
      <Text variant="labelLarge" style={[styles.sectionHeader, { color: textMuted }]}>
        {section.category.toUpperCase()} ({section.items.length})
      </Text>
      {section.items.map((inv) => (
        <View key={inv.id} style={[styles.itemRow, { borderBottomColor: border }]}>
          <TouchableOpacity style={styles.itemInfo} onPress={() => openEdit(inv)}>
            <Text variant="bodyLarge">{inv.name}</Text>
          </TouchableOpacity>
          <View style={styles.itemActions}>
            <Animated.View style={{ opacity: getBadgeAnim(inv.id) }}>
              <TouchableOpacity onPress={() => handleBadgeTap(inv)} style={styles.badgeBtn}>
                <View style={styles.levelBadge}>
                  <Text style={[styles.levelBadgeText, { color: textMuted }]}>
                    {quantityLabel(inv.quantity)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={() => handleDelete(inv)} style={styles.actionBtn}>
              <Text style={{ color: '#dc2626', fontSize: 13 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
      ) : grouped.length === 0 ? (
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
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => {
          setQuickAddText('');
          setQuickAddError('');
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
                onPress={() => setQuickAddVisible(false)}
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
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badgeBtn: { paddingVertical: 4 },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(245,158,11,0.12)',
  },
  levelBadgeText: { fontSize: 12, fontWeight: '600' },
  actionBtn: { paddingHorizontal: spacing.xs, paddingVertical: 4 },
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
