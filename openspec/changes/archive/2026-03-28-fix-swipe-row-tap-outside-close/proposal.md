## Why

When a swipe row is opened in the Inventory screen, the delete button stays visible even if the user taps on a section header or starts scrolling — there is no way to dismiss it without tapping the delete button or swiping another row. This creates a confusing UX where the delete affordance hangs open unexpectedly.

## What Changes

- The `FlatList` in `InventoryScreen` will close the open swipe row when the user begins scrolling (`onScrollBeginDrag`)
- Section headers (category labels and the Meal Prep header) will close the open swipe row when tapped

## Capabilities

### New Capabilities
- `inventory-swipe-row-dismiss`: Swipe row in inventory closes on scroll or section header tap

### Modified Capabilities
- `inventory-management`: Swipe row dismiss behavior is an extension of existing inventory interaction UX

## Impact

- `src/screens/InventoryScreen.tsx` — `FlatList` and section header rendering
