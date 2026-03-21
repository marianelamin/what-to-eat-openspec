## 1. Types & Service Layer

- [x] 1.1 Add `Meal` and `MealIngredient` types to `src/types/index.ts`
- [x] 1.2 Create `src/services/mealService.ts` with `fetchMeals()` — fetch all meals for current user from Supabase ordered by created_at desc
- [x] 1.3 Add `createMeal()` to `mealService.ts` — insert meal row and meal_ingredients rows
- [x] 1.4 Add `uploadMealPhoto()` to `mealService.ts` — upload image to `meal-photos/<user_id>/<uuid>.jpg`, return public URL; compress with quality 0.7, maxWidth 1200

<!-- Supabase Storage bucket must be created manually before photo upload works -->

## 2. Supabase Storage Setup (manual user action)

- [x] 2.1 Create `meal-photos` storage bucket in Supabase dashboard (Storage → New bucket → name: `meal-photos`, public: true)

## 3. Catalog Stack Navigator

- [x] 3.1 Create `src/navigation/CatalogNavigator.tsx` — stack navigator with screens: `CatalogList`, `MealDetail`, `AddMeal`
- [x] 3.2 Update `src/navigation/AppNavigator.tsx` — replace `CatalogScreen` component with `CatalogNavigator` for the Catalog tab

## 4. Catalog Screen (photo grid)

- [x] 4.1 Rewrite `src/screens/CatalogScreen.tsx` — fetch meals via `mealService.fetchMeals()` on mount, display in a 2-column `FlatList` grid
- [x] 4.2 Add meal card component (inline or extracted) — meal photo fills card, meal name at bottom; placeholder icon when no photo
- [x] 4.3 Add search input above grid — filters meals client-side by name (case-insensitive)
- [x] 4.4 Add empty state — message when no meals exist or search has no results
- [x] 4.5 Add FAB (floating action button) to catalog screen — navigates to `AddMeal` screen

## 5. Add Meal Screen

- [x] 5.1 Create `src/screens/AddMealScreen.tsx` — form with photo picker, name field (required), ingredients text area (one per line), notes text area
- [x] 5.2 Implement photo picker in Add Meal — tap photo area to open `expo-image-picker` library picker; show preview after selection
- [x] 5.3 Implement form validation — show error if name is empty on submit
- [x] 5.4 Implement save handler — upload photo (if selected), call `mealService.createMeal()`, show loading state on button, navigate back on success
- [x] 5.5 Display error message if save fails

## 6. Meal Detail Screen

- [x] 6.1 Create `src/screens/MealDetailScreen.tsx` — receive meal id via navigation params, load meal + ingredients from Supabase
- [x] 6.2 Display large photo at top (or placeholder), meal name as heading, ingredients list, notes section
- [x] 6.3 Hide ingredients section if no ingredients; hide notes section if notes is empty

## 7. Verification

- [x] 7.1 Add a meal with photo, name, and ingredients — verify it appears in catalog grid
- [x] 7.2 Add a meal without a photo — verify placeholder displays correctly
- [x] 7.3 Search for a meal by name — verify grid filters correctly
- [x] 7.4 Tap a meal in the grid — verify detail screen shows correct data
- [x] 7.5 Tap back from detail screen — verify return to catalog
- [x] 7.6 Try to save without a name — verify validation error appears
