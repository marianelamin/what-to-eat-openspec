## Why

As the meal catalog grows, finding the right meal takes longer because breakfast meals are mixed in with lunch/dinner options. Splitting the catalog into "Breakfast" and "All Day" sections lets users scan a shorter, contextually relevant list rather than scrolling through the full grid.

## What Changes

- Each meal gains a `meal_type` field: `breakfast` or `all_day` (default `all_day`)
- The catalog screen shows two tabs or a segmented control: **Breakfast** / **All Day**
- The active tab filters the grid to only show meals of that type
- Add Meal form includes a meal type selector (Breakfast / All Day)
- Edit Meal form includes the same selector so existing meals can be reclassified
- Search remains scoped to the active tab

## Capabilities

### New Capabilities
- `catalog-meal-type-filter`: Segmented Breakfast / All Day tabs on the catalog screen, filtering the grid by meal type

### Modified Capabilities
- `meal-catalog`: Requirement changes — catalog must support filtering by meal type; active tab persists within a session
- `meal-crud`: Requirement changes — create and edit meal must include a meal type field

## Impact

- Supabase `meals` table — add `meal_type` column (`text`, default `'all_day'`, values: `'breakfast'`, `'all_day'`)
- `src/types/index.ts` — `Meal` type gains `meal_type: 'breakfast' | 'all_day'`
- `src/services/mealService.ts` — `createMeal` and `updateMeal` accept and write `meal_type`
- `src/screens/CatalogScreen.tsx` — add tab/segmented control, filter `meals` by `meal_type`
- `src/screens/AddMealScreen.tsx` — add meal type selector
- `src/screens/MealDetailScreen.tsx` — add meal type selector in edit mode
