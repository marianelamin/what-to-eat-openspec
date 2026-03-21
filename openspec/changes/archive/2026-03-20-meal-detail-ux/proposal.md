## Why

Three small friction points in the meal detail and catalog flows make the app feel slower than it should: the ingredient list gives no signal about what's actually in stock, logging a meal requires two taps into a detail screen, and restoring an archived meal adds an unnecessary confirmation step.

## What Changes

- Meal detail screen shows each ingredient tagged as "have" (in inventory) or "missing" (not in inventory or out of stock)
- Catalog grid cards gain a quick-log button so the user can log a meal without opening the detail screen
- Restoring an archived meal no longer shows a confirmation dialog — it restores immediately

## Capabilities

### New Capabilities
- `meal-ingredient-availability`: Cross-reference meal ingredients against inventory and display availability status (have / missing) on the detail screen

### Modified Capabilities
- `meal-detail`: Restore action is immediate — no confirmation alert required before restoring an archived meal
- `meal-catalog`: Catalog grid cards show a quick-log button that logs the meal without navigating to the detail screen
- `meal-logging`: Logging can be triggered directly from the catalog grid card (in addition to the existing detail screen and home screen flows)

## Impact

- `src/screens/MealDetailScreen.tsx` — fetch inventory on load, tag each ingredient as have/missing; remove `Alert.alert` from `handleRestore`
- `src/screens/CatalogScreen.tsx` — add a quick-log button to `MealCard`; call `logMeal` on tap with inline loading state
- `src/services/inventoryService.ts` — `fetchInventory` already exists; no service changes needed
- `src/services/mealService.ts` — `logMeal` already exists; no service changes needed
