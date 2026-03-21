## 1. Ingredient Availability in Detail View

- [x] 1.1 In `MealPage` (`MealDetailScreen.tsx`), fetch inventory in parallel with ingredients: replace the single `fetchMealWithIngredients` call with `Promise.all([fetchMealWithIngredients(id), fetchInventory()])`
- [x] 1.2 Build a helper `isAvailable(ingredientName: string, inventory: InventoryItem[]): boolean` — returns true if any inventory item with quantity > 0 fuzzy-matches the ingredient name (`inv.includes(ing) || ing.includes(inv)`, case-insensitive)
- [x] 1.3 In the ingredients list render, replace the plain `• {name}` text with a row showing a colored dot or label: green/"have" if available, muted/"missing" if not

## 2. Quick-Log from Catalog Grid

- [x] 2.1 Add `loggingId: string | null` state to `CatalogScreen` (tracks which meal is currently being logged)
- [x] 2.2 Add a quick-log icon button (e.g. checkmark) to `MealCard`, visible only when `meal.is_archived === false`; button shows a spinner when `loggingId === meal.id`
- [x] 2.3 On quick-log tap: set `loggingId = meal.id`, call `logMeal(meal.id)`, then call `loadMeals()`, then clear `loggingId`; on failure, clear `loggingId` and show `Alert.alert('Error', 'Failed to log meal.')`

## 3. Remove Restore Confirmation Dialog

- [x] 3.1 In `MealPage`, replace the `Alert.alert` + callback in `handleRestore` with a direct `await restoreMeal(meal.id)` call (keep the `actioning` loading state and error handling)

## 4. Verification

- [x] 4.1 Open a meal with ingredients — "have" ingredients show green, "missing" show muted
- [x] 4.2 Open a meal with no inventory — all ingredients show "missing"
- [ ] 4.3 Update an inventory item level to 0, reopen the meal — that ingredient flips to "missing"
- [x] 4.4 Tap the quick-log button on a catalog card — meal logs without opening detail, catalog refreshes
- [x] 4.5 Quick-log shows spinner on the tapped card while in progress
- [x] 4.6 Archived meal cards do not show the quick-log button
- [x] 4.7 Tap "Restore Meal" on an archived meal — restores immediately, no dialog shown
