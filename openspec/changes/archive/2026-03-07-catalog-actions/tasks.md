## 1. Service Layer

- [x] 1.1 Add `updateMeal(id, updates)` to `mealService.ts` — updates name, photo_url, recipe in the meals table, then replaces meal_ingredients rows (delete all for meal_id, re-insert new lines)
- [x] 1.2 Add `archiveMeal(id)` to `mealService.ts` — sets `is_archived = true` on the meals row
- [x] 1.3 Add `restoreMeal(id)` to `mealService.ts` — sets `is_archived = false` on the meals row
- [x] 1.4 Add `deleteMeal(id)` to `mealService.ts` — deletes meal_ingredients rows first, then hard-deletes the meal row

## 2. Catalog — Archived Meal Visibility

- [x] 2.1 Update `fetchMeals()` (or add a new `fetchAllMeals()`) to return active + archived meals; active meals first, archived meals last
- [x] 2.2 In `CatalogScreen`, render archived meal cards with reduced opacity and an "Archived" badge overlay
- [x] 2.3 Pass the `is_archived` flag through to `MealDetailScreen` via route params so the detail screen knows which action set to show

## 3. Meal Detail — Action Buttons (view mode)

- [x] 3.1 Add "Choose This Meal" button to `MealDetailScreen` — triggers the same Alert confirmation + `logMeal()` flow as HomeScreen; on success navigate back and call `onMealMutated` (active meals only)
- [x] 3.2 Add "Edit" button to the header/toolbar of `MealDetailScreen` that switches screen to edit mode (active meals only)
- [x] 3.3 Add "Archive" button to `MealDetailScreen` — shows Alert ("You can restore it later"), calls `archiveMeal()`, navigates back, calls `onMealMutated` (active meals only)
- [x] 3.4 Add "Restore" button to `MealDetailScreen` for archived meals — calls `restoreMeal()`, navigates back, calls `onMealMutated`
- [x] 3.5 Add "Delete Permanently" button to `MealDetailScreen` for archived meals — shows Alert ("This cannot be undone"), calls `deleteMeal()`, navigates back, calls `onMealMutated`

## 4. Meal Detail — Edit Mode

- [x] 4.1 Add edit mode state (`isEditing`) to `MealDetailScreen`
- [x] 4.2 In edit mode, render editable `TextInput` fields for name and recipe notes
- [x] 4.3 In edit mode, render multiline `TextInput` for ingredients (ingredients joined with `\n`; on save split and trim)
- [x] 4.4 In edit mode, make photo tappable to open `ImagePicker` and replace preview
- [x] 4.5 Add Save button in edit mode — calls `updateMeal()`, uploads new photo if changed, then exits edit mode and refreshes displayed data
- [x] 4.6 Add Cancel button in edit mode — discards all changes and returns to view mode

## 5. Catalog Navigation — Refresh Callback

- [x] 5.1 Update `CatalogNavigator` param types to include `onMealMutated?: () => void` on the `MealDetail` route
- [x] 5.2 In `CatalogScreen`, pass `onMealMutated` callback when navigating to `MealDetail` — callback triggers meal list reload
- [x] 5.3 In `MealDetailScreen`, call `route.params.onMealMutated?.()` after successful choose, edit, archive, restore, or delete

## 6. Bulk Photo Import

- [x] 6.1 Add bulk import trigger to `CatalogScreen` (FAB or header button) that opens `ImagePicker` with `allowsMultipleSelection: true` and `mediaTypes: Images`, capped at 20 photos
- [x] 6.2 Implement sequential upload loop: for each selected image, call `uploadMealPhoto()` then insert a meal row with `name = "Unnamed Meal"` and the returned photo URL
- [x] 6.3 Show progress feedback during import ("Importing 2 of 5…") via a modal or status banner
- [x] 6.4 After import completes, show summary (e.g., "3 meals added, 1 failed") and refresh the catalog list

## 7. Verification

- [x] 7.1 Choose This Meal from detail screen logs the meal and decrements inventory
- [x] 7.2 Edit meal saves name, photo, and ingredients correctly; Cancel discards changes
- [x] 7.3 Archive meal: meal gets "Archived" badge in catalog; does not appear in recommendations
- [x] 7.4 Restore meal: badge removed, meal returns to active state and recommendations
- [x] 7.5 Delete Permanently: meal gone from catalog entirely, no recovery possible
- [x] 7.6 Bulk import creates draft meals visible in catalog with correct photos
- [x] 7.7 Catalog refreshes automatically after any mutation (choose, edit, archive, restore, delete, import)
