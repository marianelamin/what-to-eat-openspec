## 1. Database Migration

- [x] 1.1 Run in Supabase SQL editor: `ALTER TABLE inventory_items ADD COLUMN item_kind text NOT NULL DEFAULT 'ingredient';`

## 2. Types and Service Layer

- [x] 2.1 In `src/types/index.ts`, add `item_kind: 'ingredient' | 'meal_prep'` to the `InventoryItem` type
- [x] 2.2 In `src/services/inventoryService.ts`, update `createItem` to accept and write `item_kind` (default `'ingredient'`)
- [x] 2.3 In `src/services/inventoryService.ts`, update `updateItem` to accept and write `item_kind` if provided

## 3. Battery Icon Level Visual

- [x] 3.1 Add `MaterialCommunityIcons` import to `InventoryScreen.tsx`
- [x] 3.2 Add a `levelIcon(q: string | null)` helper that returns the icon name: `battery-high` (≥5), `battery-medium` (≥3), `battery-low` (≥1), `battery-outline` (0/null)
- [x] 3.3 Replace the `levelBadge` View+Text in the item row with `<MaterialCommunityIcons>` using the helper — amber color (`#f59e0b`) for all levels except Out of stock (muted gray), size 24
- [x] 3.4 Remove the `levelBadgeText` and `levelBadge` styles that are no longer used; keep `badgeBtn` and the `Animated.View` wrapper

## 4. Swipe-to-Delete Row

- [x] 4.1 Create a `SwipeableRow` component (in the same file or as a local component) using `PanResponder` + `Animated.Value` for the horizontal translate offset
- [x] 4.2 Activate the pan responder only when horizontal movement exceeds vertical movement (`Math.abs(dx) > Math.abs(dy)`) to avoid conflicting with list scroll
- [x] 4.3 On release: if `dx > 60` snap the row open (translate to 80px) and show the Delete button; otherwise snap back to 0
- [x] 4.4 Render a red "Delete" button behind the row (absolute positioned left side, revealed by the translate)
- [x] 4.5 Tapping Delete calls the existing `handleDelete` logic and snaps the row closed
- [x] 4.6 Remove the existing inline "Delete" `TouchableOpacity` from the item row render
- [x] 4.7 Wrap each item row (in both the ingredient sections and the meal prep section) with `SwipeableRow`

## 5. Dedup Fix

- [x] 5.0 In `bulkAddItems`, scope `findNearDuplicate` to items of the same `item_kind` so ingredient and meal prep items with the same name can coexist

## 6. Meal Prep Section

- [x] 6.1 In `InventoryScreen.tsx`, add `quickAddKind: 'ingredient' | 'meal_prep'` state (default `'ingredient'`)
- [x] 6.2 In the Quick Add modal, add two `Chip` components ("Ingredients" / "Meal Prep") above the text input bound to `quickAddKind`; selecting one chip deselects the other
- [x] 6.3 Pass `item_kind: quickAddKind` to `bulkAddItems` (update `bulkAddItems` signature to accept and forward `item_kind`)
- [x] 6.4 In the screen render, split `items` into `prepItems` (`item_kind === 'meal_prep'`) and `ingredientItems` (everything else) before grouping
- [x] 6.5 Render a "MEAL PREP" section header + flat list of `prepItems` above the grouped ingredient sections; hide the section entirely when `prepItems` is empty
- [x] 6.6 Reset `quickAddKind` back to `'ingredient'` when the Quick Add modal closes

## 7. Verification

- [x] 7.1 Open inventory — level badges show battery icons; tapping cycles levels correctly with pulse animation
- [x] 7.2 Swipe an item right — Delete button appears; tap it removes the item immediately with no confirmation; swipe back closes without deleting
- [x] 7.3 Open Quick Add, select "Meal Prep", add "ground beef, black beans" — items appear in Meal Prep section, not in ingredient categories
- [x ] 7.4 If "ground beef" already exists as an ingredient, Quick Adding "ground beef" as Meal Prep creates a new meal prep entry instead of restocking the ingredient
- [x] 7.5 Open a meal whose ingredient list includes "ground beef" — with a meal prep inventory item "ground beef" at Stocked, it shows as "have" on meal detail
- [x] 7.6 Open Home screen — a meal whose ingredient includes a Stocked meal prep item scores higher in recommendations than one that doesn't
- [x] 7.7 Quick Add with "Ingredients" chip selected adds items to the normal category sections as before
