## Why

The inventory screen has three UX rough edges: deletion is a hidden tap target rather than an ergonomic gesture, there's no way to track prepared/cooked foods alongside raw ingredients, and the level badge is a text label when a visual bar icon would communicate stock level at a glance. Resolving these makes inventory interaction faster and more intuitive for daily use.

## What Changes

- Swipe-right on any inventory item row to reveal a "Delete" button; tapping it removes the item immediately (no confirmation). Replaces the current tap-to-delete mechanism.
- Add a "Meal Prep" section to the inventory screen for tracking prepared foods (e.g., ground beef, shredded chicken, black beans). Meal prep items follow the same level-cycling interaction but live in their own top-level section separate from the category-grouped ingredient inventory.
- Replace the text level badge (Stocked / Some / Low / Out of stock) with a horizontal battery icon from `MaterialCommunityIcons`: `battery-high` (Stocked), `battery-medium` (Some), `battery-low` (Low), `battery-outline` (Out of stock).

## Capabilities

### New Capabilities
- `inventory-meal-prep`: A dedicated "Meal Prep" section in the inventory screen for user-prepared foods, with the same add/edit/delete/level-cycling interactions as regular inventory items.

### Modified Capabilities
- `inventory-management`: Delete interaction changes from tap to swipe-right-reveal-delete-button.
- `inventory-level-cycling`: Level visual changes from text badge to a horizontal battery icon (`battery-high` / `battery-medium` / `battery-low` / `battery-outline`).

## Impact

- `what-to-eat/src/screens/InventoryScreen.tsx` — swipe gesture, meal prep section, bar icon
- `what-to-eat/src/types/index.ts` — possibly a `item_kind: 'ingredient' | 'meal_prep'` field on inventory items
- `what-to-eat/src/services/inventoryService.ts` — filter/fetch by kind if stored in DB
- Supabase `inventory_items` table — new `item_kind` column (migration required)
