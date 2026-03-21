## 1. Database Migration

- [ ] 1.1 Run the following SQL in the Supabase dashboard SQL editor to add the `meal_type` column:
  ```sql
  ALTER TABLE meals ADD COLUMN meal_type text NOT NULL DEFAULT 'all_day';
  ```

## 2. Types and Service Layer

- [ ] 2.1 In `src/types/index.ts`, add `meal_type: 'breakfast' | 'all_day'` to the `Meal` type
- [ ] 2.2 In `src/services/mealService.ts`, update `createMeal` to accept and write `meal_type` (default `'all_day'`)
- [ ] 2.3 In `src/services/mealService.ts`, update `updateMeal` to accept and write `meal_type`

## 3. Catalog Screen

- [ ] 3.1 Add `activeTab: 'all_day' | 'breakfast'` state to `CatalogScreen` (default `'all_day'`)
- [ ] 3.2 Add a `SegmentedButtons` (React Native Paper) above the `Searchbar` with options "All Day" and "Breakfast"; bind to `activeTab`
- [ ] 3.3 Filter the `meals` array by `meal_type === activeTab` before the name-search filter; clear search text when tab changes
- [ ] 3.4 Update the `MealDetail` navigation call to pass the tab-filtered (then search-filtered) list as `meals`

## 4. Add Meal Screen

- [ ] 4.1 Add `mealType: 'all_day' | 'breakfast'` state to `AddMealScreen` (default `'all_day'`)
- [ ] 4.2 Add a meal type selector (two `Chip` components or a `SegmentedButtons`) to the Add Meal form
- [ ] 4.3 Pass `meal_type: mealType` to `createMeal` on save

## 5. Meal Detail Edit Mode

- [ ] 5.1 Add `editMealType` state to `MealPage` in `MealDetailScreen.tsx`, initialized to `meal.meal_type` in `enterEditMode`
- [ ] 5.2 Add a meal type selector (`SegmentedButtons`) to the edit mode view
- [ ] 5.3 Pass `meal_type: editMealType` to `updateMeal` in `handleSave`

## 6. Verification

- [ ] 6.1 Open catalog — verify All Day tab is selected by default; only all-day meals show
- [ ] 6.2 Tap Breakfast tab — verify only breakfast meals show (or empty state if none)
- [ ] 6.3 Add a new meal with type "Breakfast" — verify it appears under the Breakfast tab, not All Day
- [ ] 6.4 Edit an existing meal and change its type — verify it moves to the correct tab
- [ ] 6.5 Type a search query while on Breakfast tab — verify only breakfast meals matching the query are shown
- [ ] 6.6 Switch tab with a search active — verify search clears and full list for new tab shows
