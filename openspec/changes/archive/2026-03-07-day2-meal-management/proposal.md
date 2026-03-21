## Why

The app's core value proposition is recommending meals from the user's own recipe collection. Before any recommendations can happen, users need a way to add and browse their meals. Day 2 builds the meal catalog — the foundational data layer that everything else (inventory, history, recommendations) depends on.

## What Changes

- Add meal form: photo picker, name field (required), optional ingredients and notes
- Meal catalog screen: photo-dominant grid replacing the current Catalog placeholder
- Supabase Storage integration: upload meal photos to `meal-photos` bucket; store public URL in `meals.photo_url`
- Meal detail screen: read-only view of a meal (photo, name, ingredients, notes)
- Basic filtering: client-side search by meal name on the catalog screen
- Catalog tab gets a stack navigator (catalog list → meal detail → add meal)

## Capabilities

### New Capabilities

- `meal-catalog`: Photo-dominant grid view of all user meals with search/filter by name
- `meal-crud`: Add meal form (photo + name required, optional ingredients/notes); edit and delete from detail screen
- `photo-storage`: Upload meal photos to Supabase Storage; retrieve and display via public URL
- `meal-detail`: Read-only detail screen showing meal photo, name, ingredients, and notes

### Modified Capabilities

<!-- No existing specs are changing requirements -->

## Impact

- `src/screens/CatalogScreen.tsx` — replaced with real grid implementation
- `src/navigation/AppNavigator.tsx` — Catalog tab becomes a stack navigator
- `src/types/index.ts` — add `Meal` and `MealIngredient` types
- `src/services/` — add `mealService.ts` for Supabase CRUD and storage operations
- New screens: `MealDetailScreen.tsx`, `AddMealScreen.tsx`
- Supabase Storage: new `meal-photos` bucket (public) must be created in dashboard
- No schema changes needed — `meals` and `meal_ingredients` tables already exist from Day 1
