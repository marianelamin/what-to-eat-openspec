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

export async function fetchInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function bulkAddItems(names: string[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const rows = names.map((name) => ({
    user_id: user.id,
    name: name.trim(),
    quantity: '6',
    category: categorize(name),
  }));

  const { error } = await supabase.from('inventory_items').insert(rows);
  if (error) throw error;
}

export async function updateItem(
  id: string,
  updates: Partial<Pick<InventoryItem, 'name' | 'quantity' | 'category'>>
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
