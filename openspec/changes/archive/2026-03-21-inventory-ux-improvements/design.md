## Context

The inventory screen (`InventoryScreen.tsx`) currently renders item rows with an inline "Delete" text button, text-label level badges, and no concept of prepared foods. All three improvements touch this single screen plus the data layer. No gesture library is installed — only React Native's built-in `Animated` and `PanResponder` are available.

## Goals / Non-Goals

**Goals:**
- Swipe-right gesture on any item row reveals a "Delete" button; tap it removes immediately (no confirmation)
- A "Meal Prep" section in the inventory screen for tracking prepared/cooked foods, using the same level-cycling and edit interactions as ingredients
- Battery icon replaces the text-level badge, using `MaterialCommunityIcons` icons already imported elsewhere in the app

**Non-Goals:**
- No new npm packages (gesture handler, reanimated, etc.)
- Meal prep items are not linked to meals or used in the recommendation engine (just inventory tracking)
- No per-item-kind statistics or separate staleness tracking

## Decisions

### Swipe-to-delete via PanResponder + Animated

`react-native-gesture-handler` is not installed. The existing code already uses `Animated` (for badge pulse). We implement a `SwipeableRow` component using `PanResponder` that tracks horizontal translation. When the user drags right past a threshold (e.g., 60px), a red "Delete" button is revealed behind the row. Releasing past the threshold keeps the button visible; tapping Delete calls the existing `handleDelete` logic. Swiping back or tapping elsewhere closes the row.

The current inline "Delete" text button is removed entirely.

### Meal prep as `item_kind` column

Meal prep items are structurally identical to ingredients (name, category, quantity, level). Adding an `item_kind: 'ingredient' | 'meal_prep'` column to `inventory_items` in Supabase is the simplest approach — no new table, same service functions, same CRUD. The screen splits items into two lists: grouped-by-category ingredients and a flat "Meal Prep" section.

The Quick Add modal gets a two-chip toggle (Ingredients / Meal Prep) that sets the `item_kind` for all items in the batch. Default remains `'ingredient'`.

`fetchInventory` returns all items; the screen filters locally. No service layer changes beyond passing `item_kind` through create/update.

### Battery icon for level

Replace the `levelBadge` View+Text with a single `MaterialCommunityIcons` icon. The pulse animation (`Animated.View` wrapping) remains. Icon mapping:

| Level | Quantity | Icon |
|---|---|---|
| Stocked | ≥ 5 | `battery-high` |
| Some | ≥ 3 | `battery-medium` |
| Low | ≥ 1 | `battery-low` |
| Out of stock | 0 | `battery-outline` |

Icon size 24, amber color (`#f59e0b`) for Stocked/Some/Low; muted gray for Out of stock.

## Risks / Trade-offs

- **PanResponder + FlatList scroll conflict**: Horizontal swipes can interfere with vertical scroll in FlatList. Mitigation: only activate the pan responder when `dx > dy` (more horizontal than vertical movement).
- **Swipe state across re-renders**: If the list re-renders while a row is swiped open, the animation state resets. Mitigation: acceptable for MVP — row closes on any list refresh, which is expected behavior.
- **Migration**: Existing rows have no `item_kind`. Default `'ingredient'` in the migration covers all existing data.

## Migration Plan

1. Run SQL in Supabase dashboard:
   ```sql
   ALTER TABLE inventory_items ADD COLUMN item_kind text NOT NULL DEFAULT 'ingredient';
   ```
2. Update `InventoryItem` type in `src/types/index.ts`
3. Update `createItem` / `updateItem` in `src/services/inventoryService.ts` to pass `item_kind`
4. Update `InventoryScreen.tsx`: swipe rows, meal prep section, battery icon
