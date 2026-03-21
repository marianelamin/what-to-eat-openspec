## 1. Database Migration

- [x] 1.1 Run the following SQL in the Supabase dashboard SQL editor to add the `meal_type` column:
  ```sql
  ALTER TABLE meals ADD COLUMN meal_type text NOT NULL DEFAULT 'all_day';
  ```

## 2. Types and Service Layer

- [x] 2.1 In `src/types/index.ts`, add `meal_type: 'breakfast' | 'all_day'` to the `Meal` type
- [x] 2.2 In `src/services/mealService.ts`, update `createMeal` to accept and write `meal_type` (default `'all_day'`)
- [x] 2.3 In `src/services/mealService.ts`, update `updateMeal` to accept and write `meal_type`

## 3. Catalog Screen

- [x] 3.1 Add `activeTab: 'all_day' | 'breakfast'` state to `CatalogScreen` (default `'all_day'`)
- [x] 3.2 Add a `SegmentedButtons` (React Native Paper) above the `Searchbar` with options "All Day" and "Breakfast"; bind to `activeTab`
- [x] 3.3 Filter the `meals` array by `meal_type === activeTab` before the name-search filter; clear search text when tab changes
- [x] 3.4 Update the `MealDetail` navigation call to pass the tab-filtered (then search-filtered) list as `meals`

## 4. Add Meal Screen

- [x] 4.1 Add `mealType: 'all_day' | 'breakfast'` state to `AddMealScreen` (default `'all_day'`)
- [x] 4.2 Add a meal type selector (two `Chip` components or a `SegmentedButtons`) to the Add Meal form
- [x] 4.3 Pass `meal_type: mealType` to `createMeal` on save

## 5. Meal Detail Edit Mode

- [x] 5.1 Add `editMealType` state to `MealPage` in `MealDetailScreen.tsx`, initialized to `meal.meal_type` in `enterEditMode`
- [x] 5.2 Add a meal type selector (`SegmentedButtons`) to the edit mode view
- [x] 5.3 Pass `meal_type: editMealType` to `updateMeal` in `handleSave`

## 6. Catalog Header UI Rework

- [x] 6.1 Replace `SegmentedButtons` in `CatalogScreen` with a single header row: horizontal `ScrollView` of `Chip` buttons on the left (Breakfast first, then All Day) + compact `Searchbar` on the right, using `flexDirection: 'row'`
- [x] 6.2 Add `searchFocused: boolean` state; when `true`, hide the chip `ScrollView` and expand `Searchbar` to `flex: 1`; bind `onFocus` and `onBlur` on the `Searchbar`
- [x] 6.3 Remove the old `SegmentedButtons` import from `CatalogScreen` (no longer used there)
- [x] 6.4 In `AddMealScreen`, replace `SegmentedButtons` with two `Chip` components (Breakfast first, All Day second) in a `View` row for consistency
- [x] 6.5 In `MealDetailScreen` edit mode, replace `SegmentedButtons` with two `Chip` components (Breakfast first, All Day second)

## 7. Verification

- [x] 7.1 Open catalog — Breakfast chip on left, All Day on right; All Day selected by default
- [x] 7.2 Tap search — chips disappear, search expands full width
- [x] 7.3 Dismiss keyboard — chips reappear, search collapses; query preserved if typed
- [x] 7.4 Tap Breakfast chip — only breakfast meals show
- [x] 7.5 Switch chip with active search — search clears, new tab's full list shows
- [x] 7.6 Add a new meal with type "Breakfast" — appears under Breakfast chip, not All Day
- [x] 7.7 Edit an existing meal and change its type — moves to the correct chip's list
