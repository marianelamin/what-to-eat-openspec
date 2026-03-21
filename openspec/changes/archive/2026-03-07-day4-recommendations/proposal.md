## Why

The app has meals and inventory but no way to connect them. Day 4 closes the core loop — the app scores meals against the user's inventory and recommends what to cook, then logs the choice and updates inventory levels when a meal is chosen.

## What Changes

- New recommendation algorithm scores meals by ingredient availability and days since last made
- Home screen replaced with recommendation cards (top 2-3 meals)
- "Choose This Meal" logs the meal and depletes matched inventory items by one level
- Inventory items now use a 0–6 numeric level scale (Stocked/Some/Low/Out of stock) instead of free text for automatic deduction tracking
- Pull-to-refresh on Home screen gets fresh recommendations; state persists between tab switches
- Quick Add defaults new inventory items to level 6 ("Stocked")
- Inventory edit modal gains level chips for quick level selection

## Capabilities

### New Capabilities
- `recommendations`: Score and surface top 2-3 meals based on inventory match + recency; home screen recommendation cards with "Choose This Meal" flow
- `meal-logging`: Log a chosen meal — insert meal_history, update meal stats (last_made_at, times_made), deduct matched inventory items

### Modified Capabilities
- `inventory-management`: Quantity field now uses 0–6 numeric level scale; edit modal gains level chips; bulkAddItems defaults to "6" (Stocked)

## Impact

- `src/screens/HomeScreen.tsx` — rewritten from placeholder
- `src/services/recommendationService.ts` — new
- `src/services/mealService.ts` — add `fetchAllMealsWithIngredients()`, `logMeal()`
- `src/services/inventoryService.ts` — change bulk add default, no other logic changes
- `src/screens/InventoryScreen.tsx` — add level chips to edit modal
- `src/types/index.ts` — add `ScoredMeal` type
