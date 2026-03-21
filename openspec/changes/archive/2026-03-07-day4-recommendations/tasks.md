## 1. Types

- [x] 1.1 Add `ScoredMeal` type to `src/types/index.ts` (extends Meal with ingredients, matchedIngredients, missingIngredients, score, daysSinceLastMade)

## 2. Meal Service

- [x] 2.1 Add `fetchAllMealsWithIngredients()` to `src/services/mealService.ts` — Supabase nested select `'*, meal_ingredients(*)'` on active meals
- [x] 2.2 Add `logMeal(mealId: string)` to `src/services/mealService.ts` — insert meal_history, update meal stats (times_made+1, last_made_at), then fetch ingredients + inventory and decrement matched items

## 3. Inventory Service

- [x] 3.1 Change `bulkAddItems` default quantity from `null` to `"6"` in `src/services/inventoryService.ts`

## 4. Inventory Screen — Level Chips

- [x] 4.1 Add level display helper `quantityLabel(q: string | null): string` in `src/screens/InventoryScreen.tsx` — maps 0="Out of stock", 1-2="Low", 3-4="Some", 5-6="Stocked", else show raw value
- [x] 4.2 Replace quantity text shown on item rows with `quantityLabel(item.quantity)`
- [x] 4.3 Add 4 level chips to edit modal: Stocked / Some / Low / Out of stock — tapping sets editQuantity to "6" / "4" / "2" / "0"
- [x] 4.4 Remove free-text quantity TextInput from edit modal (level chips replace it)

## 5. Recommendation Service

- [x] 5.1 Create `src/services/recommendationService.ts` with `getRecommendations()` function
- [x] 5.2 Implement scoring: fetch inventory (exclude level 0 items), fetch all meals+ingredients, score each meal, filter >50, sort desc, return top 3

## 6. Home Screen

- [x] 6.1 Rewrite `src/screens/HomeScreen.tsx` — fetch recommendations on mount only; show loading state
- [x] 6.2 Render recommendation cards: photo (or placeholder), meal name, last made info, matched/missing ingredients, "Choose This Meal" amber button
- [x] 6.3 "Choose This Meal" flow: Alert confirmation → call `logMeal()` → reload recommendations
- [x] 6.4 Add `RefreshControl` to ScrollView for pull-to-refresh
- [x] 6.5 Add empty state when no recommendations
- [x] 6.6 Add "Browse All Meals" link at bottom + "Swipe down for new suggestions" hint

## 7. Verification

- [x] 7.1 Open Home tab — recommendation cards appear with photos and ingredient info
- [x] 7.2 Meals with more inventory matches appear first
- [x] 7.3 Switch to another tab and back — same recommendations shown, no reload
- [x] 7.4 Pull down on Home — recommendations reload
- [x] 7.5 Tap "Choose This Meal" → confirm → meal logged, inventory levels decremented
- [x] 7.6 After logging, check inventory — matched items stepped down one level
- [x] 7.7 Set an inventory item to level 0 → verify it no longer counts as available in recommendations
- [x] 7.8 Quick Add new inventory items → verify they appear at "Stocked" level
- [x] 7.9 Tap Edit on inventory item → level chips visible; tap "Low" → saves as "2"
