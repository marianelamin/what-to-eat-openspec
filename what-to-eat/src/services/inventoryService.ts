import { supabase } from './supabase';
import { InventoryItem } from '../types';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Protein: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'egg', 'eggs', 'turkey', 'lamb', 'tofu', 'beans', 'lentils', 'ham', 'bacon', 'sausage'],
  Vegetables: ['broccoli', 'carrot', 'spinach', 'kale', 'lettuce', 'tomato', 'onion', 'pepper', 'zucchini', 'cucumber', 'celery', 'asparagus', 'mushroom', 'cabbage', 'cauliflower', 'corn', 'pea', 'green bean'],
  Fruit: ['apple', 'banana', 'orange', 'strawberry', 'blueberry', 'grape', 'mango', 'pineapple', 'lemon', 'lime', 'peach', 'watermelon', 'cherry', 'avocado'],
  Grains: ['rice', 'pasta', 'bread', 'oats', 'quinoa', 'flour', 'tortilla', 'noodle', 'couscous', 'barley', 'cereal'],
  Pantry: ['oil', 'butter', 'salt', 'pepper', 'sauce', 'garlic', 'vinegar', 'sugar', 'honey', 'soy', 'stock', 'broth', 'cream', 'milk', 'cheese', 'yogurt', 'mayo', 'mustard', 'ketchup', 'spice', 'herb', 'cumin', 'paprika', 'cinnamon'],
};

function categorize(name: string): string {
  const lower = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'Other';
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function findNearDuplicate(candidate: string, existing: InventoryItem[]): InventoryItem | undefined {
  const c = candidate.toLowerCase().trim();
  return existing.find((item) => {
    const e = item.name.toLowerCase().trim();
    if (c === e) return true;
    // plural/singular: one is the other + trailing "s" or "es"
    if (c === e + 's' || e === c + 's') return true;
    if (c === e + 'es' || e === c + 'es') return true;
    // 1-character typo — only for names >= 4 chars
    if (c.length >= 4 && e.length >= 4 && levenshtein(c, e) <= 1) return true;
    return false;
  });
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function bulkAddItems(
  names: string[],
  itemKind: 'ingredient' | 'meal_prep' = 'ingredient'
): Promise<{ inserted: number; stocked: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const existing = await fetchInventory();

  let inserted = 0;
  let stocked = 0;

  const existingOfKind = existing.filter((i) => i.item_kind === itemKind);

  for (const name of names) {
    const match = findNearDuplicate(name, existingOfKind);
    if (match) {
      await updateItem(match.id, { quantity: '6' });
      stocked++;
    } else {
      const { error } = await supabase.from('inventory_items').insert({
        user_id: user.id,
        name: name.trim(),
        quantity: '6',
        category: categorize(name),
        item_kind: itemKind,
      });
      if (error) throw error;
      inserted++;
    }
  }

  return { inserted, stocked };
}

export async function updateItem(
  id: string,
  updates: Partial<Pick<InventoryItem, 'name' | 'quantity' | 'category' | 'item_kind'>>
): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('inventory_items').delete().eq('id', id);
  if (error) throw error;
}
