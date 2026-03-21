## Why

Tapping into a meal detail always resets the catalog scroll position to the top, making it tedious to browse meals deep in the list. Users also have no way to swipe between meals once inside the detail view — every comparison requires backing out and tapping into a new card.

## What Changes

- Catalog FlatList preserves scroll position when navigating back from MealDetailScreen
- MealDetailScreen gains horizontal swipe navigation — swipe left/right to move between meals in the current filtered list
- Swiping in detail view does not affect the catalog scroll position; returning via the back button restores the correct position

## Capabilities

### New Capabilities
- `catalog-scroll-restore`: Preserve catalog FlatList scroll offset across navigation to/from MealDetailScreen
- `meal-gallery-swipe`: Swipe left/right in MealDetailScreen to navigate between adjacent meals in the catalog list

### Modified Capabilities
- `meal-catalog`: CatalogScreen passes the full filtered meal list (and current index) to MealDetailScreen so it can support swipe navigation
- `meal-detail`: MealDetailScreen accepts an ordered list of meals and current index; renders swipe gesture to advance or retreat through the list

## Impact

- `src/screens/CatalogScreen.tsx` — pass `meals` array and tapped index to MealDetail route; use a ref to capture and restore FlatList scroll offset
- `src/screens/MealDetailScreen.tsx` — accept `meals: Meal[]` and `initialIndex: number` params; implement horizontal swipe with a pager or gesture handler
- `src/navigation/CatalogNavigator.tsx` — update `CatalogStackParamList` to include `meals` and `initialIndex` on the MealDetail route
