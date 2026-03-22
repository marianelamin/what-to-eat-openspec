## Why

Three post-launch UX issues discovered in daily use: the Home screen shows stale recommendations after updating inventory because it only loads on first mount; the meal detail screen has no way to re-fetch fresh inventory data without navigating away; and the swipe-to-delete gesture has no auto-close behavior, leaving multiple rows open at once with no easy way to dismiss them.

## What Changes

- **Home screen re-fetches on focus**: Recommendations are re-fetched silently whenever the user returns to the Home tab (no loading spinner — current results stay visible while background refresh runs). Fixes stale ingredient availability after inventory updates.
- **Meal detail pull-to-refresh**: Swipe down on the meal detail screen re-fetches both the meal data and the inventory, updating ingredient availability indicators.
- **Swipe row auto-close and mutual exclusivity**: Tapping anywhere on the row content while the delete button is open closes it. Only one row can have the delete button revealed at a time — opening a new row auto-closes the previously open one.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `recommendations`: Remove "persist across tab switches" — replace with silent re-fetch on Home tab focus.
- `meal-ingredient-availability`: Add pull-to-refresh that re-fetches inventory and updates availability indicators.
- `inventory-management`: Swipe-to-delete rows auto-close on outside tap and enforce mutual exclusivity (one open at a time).

## Impact

- `what-to-eat/src/screens/HomeScreen.tsx` — `useEffect` → `useFocusEffect` with background refresh
- `what-to-eat/src/screens/MealDetailScreen.tsx` — add `RefreshControl` + re-fetch inventory on pull
- `what-to-eat/src/screens/InventoryScreen.tsx` — `SwipeableRow` refactor: add `isOpen`/`onOpen` props, tap-outside-to-close, parent tracks open row ID
