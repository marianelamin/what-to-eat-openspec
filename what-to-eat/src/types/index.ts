import { Session, User } from '@supabase/supabase-js';

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export type AuthContextType = AuthState & {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export type Meal = {
  id: string;
  user_id: string;
  name: string;
  photo_url: string | null;
  recipe: string | null;
  time_category: string | null;
  has_protein: boolean;
  has_vegetables: boolean;
  has_fruit: boolean;
  has_grains: boolean;
  meal_type: 'breakfast' | 'all_day';
  is_archived: boolean;
  created_at: string;
  last_made_at: string | null;
  times_made: number;
};

export type MealIngredient = {
  id: string;
  meal_id: string;
  ingredient_name: string;
  quantity: string | null;
  created_at: string;
};

export type InventoryItem = {
  id: string;
  user_id: string;
  name: string;
  quantity: string | null;
  category: string | null;
  item_kind: 'ingredient' | 'meal_prep';
  added_at: string;
  updated_at: string;
};

export type ScoredMeal = Meal & {
  ingredients: MealIngredient[];
  matchedIngredients: string[];
  missingIngredients: string[];
  score: number;
  daysSinceLastMade: number;
};
