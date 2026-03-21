import { supabase } from './supabase';
import { Meal, MealIngredient } from '../types';

export type MealWithIngredients = Meal & { meal_ingredients: MealIngredient[] };

export async function fetchMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchMealWithIngredients(
  mealId: string
): Promise<{ meal: Meal; ingredients: MealIngredient[] }> {
  const [mealResult, ingredientsResult] = await Promise.all([
    supabase.from('meals').select('*').eq('id', mealId).single(),
    supabase.from('meal_ingredients').select('*').eq('meal_id', mealId),
  ]);

  if (mealResult.error) throw mealResult.error;
  if (ingredientsResult.error) throw ingredientsResult.error;

  return {
    meal: mealResult.data,
    ingredients: ingredientsResult.data ?? [],
  };
}

type CreateMealInput = {
  name: string;
  recipe?: string;
  photo_url?: string;
  ingredients: string[];
};

export async function createMeal(input: CreateMealInput): Promise<Meal> {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: user.id,
      name: input.name,
      recipe: input.recipe || null,
      photo_url: input.photo_url || null,
    })
    .select()
    .single();

  if (error) throw error;

  const ingredientLines = input.ingredients.filter((l) => l.trim().length > 0);
  if (ingredientLines.length > 0) {
    const rows = ingredientLines.map((line) => ({
      meal_id: data.id,
      ingredient_name: line.trim(),
    }));
    const { error: ingError } = await supabase.from('meal_ingredients').insert(rows);
    if (ingError) throw ingError;
  }

  return data;
}

export async function fetchAllMealsWithIngredients(): Promise<MealWithIngredients[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*, meal_ingredients(*)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as MealWithIngredients[];
}

export async function logMeal(mealId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .select('times_made')
    .eq('id', mealId)
    .single();
  if (mealError) throw mealError;

  const [historyResult, updateResult] = await Promise.all([
    supabase.from('meal_history').insert({ user_id: user.id, meal_id: mealId }),
    supabase.from('meals').update({
      times_made: (meal.times_made ?? 0) + 1,
      last_made_at: new Date().toISOString(),
    }).eq('id', mealId),
  ]);
  if (historyResult.error) throw historyResult.error;
  if (updateResult.error) throw updateResult.error;

  // Deduct inventory (best-effort — never throws)
  try {
    const [{ data: ingredients }, { data: inventory }] = await Promise.all([
      supabase.from('meal_ingredients').select('ingredient_name').eq('meal_id', mealId),
      supabase.from('inventory_items').select('*').eq('user_id', user.id),
    ]);

    if (!ingredients || !inventory) return;

    const updates: PromiseLike<unknown>[] = [];
    for (const ing of ingredients) {
      const ingName = ing.ingredient_name.toLowerCase();
      const matched = inventory.filter((item) => {
        const invName = item.name.toLowerCase();
        return invName.includes(ingName) || ingName.includes(invName);
      });
      for (const item of matched) {
        const current = parseInt(item.quantity ?? '', 10);
        const level = isNaN(current) ? 4 : current;
        const next = Math.max(0, level - 1);
        updates.push(
          supabase
            .from('inventory_items')
            .update({ quantity: String(next), updated_at: new Date().toISOString() })
            .eq('id', item.id)
        );
      }
    }
    await Promise.all(updates);
  } catch {
    // Deduction failure is non-fatal
  }
}

export async function fetchAllMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('is_archived', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

type UpdateMealInput = {
  name?: string;
  recipe?: string | null;
  photo_url?: string | null;
  ingredients?: string[];
};

export async function updateMeal(id: string, input: UpdateMealInput): Promise<void> {
  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.recipe !== undefined) updates.recipe = input.recipe;
  if (input.photo_url !== undefined) updates.photo_url = input.photo_url;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from('meals').update(updates).eq('id', id);
    if (error) throw error;
  }

  if (input.ingredients !== undefined) {
    const { error: delError } = await supabase
      .from('meal_ingredients')
      .delete()
      .eq('meal_id', id);
    if (delError) throw delError;

    const lines = input.ingredients.filter((l) => l.trim().length > 0);
    if (lines.length > 0) {
      const rows = lines.map((line) => ({ meal_id: id, ingredient_name: line.trim() }));
      const { error: ingError } = await supabase.from('meal_ingredients').insert(rows);
      if (ingError) throw ingError;
    }
  }
}

export async function archiveMeal(id: string): Promise<void> {
  const { error } = await supabase.from('meals').update({ is_archived: true }).eq('id', id);
  if (error) throw error;
}

export async function restoreMeal(id: string): Promise<void> {
  const { error } = await supabase.from('meals').update({ is_archived: false }).eq('id', id);
  if (error) throw error;
}

export async function deleteMeal(id: string): Promise<void> {
  const { error: ingError } = await supabase
    .from('meal_ingredients')
    .delete()
    .eq('meal_id', id);
  if (ingError) throw ingError;
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
}

const MEAL_PHOTOS_BUCKET = process.env.EXPO_PUBLIC_MEAL_PHOTOS_BUCKET!;

export async function uploadMealPhoto(imageUri: string, userId: string): Promise<string> {
  const filename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;

  const formData = new FormData();
  formData.append('file', { uri: imageUri, name: filename, type: 'image/jpeg' } as any);

  const { error } = await supabase.storage
    .from(MEAL_PHOTOS_BUCKET)
    .upload(filename, formData, { contentType: 'image/jpeg', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(MEAL_PHOTOS_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
