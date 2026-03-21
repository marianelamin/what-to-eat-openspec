## 1. Types & Service Layer

- [x] 1.1 Add `InventoryItem` type to `src/types/index.ts` (id, user_id, name, quantity, category, added_at, updated_at)
- [x] 1.2 Create `src/services/inventoryService.ts` with `fetchInventory()` — fetch all items for current user ordered by category, name
- [x] 1.3 Add `bulkAddItems(names: string[])` to inventoryService — auto-categorize each name via keyword map, bulk insert with quantity null
- [x] 1.4 Add `updateItem(id, updates)` to inventoryService — update name/quantity/category and set updated_at to now
- [x] 1.5 Add `deleteItem(id)` to inventoryService — delete item by id

## 2. Inventory Screen — List View

- [x] 2.1 Rewrite `src/screens/InventoryScreen.tsx` — fetch items on mount via `inventoryService.fetchInventory()`
- [x] 2.2 Group items by category and render as sectioned list (category header with count + item rows)
- [x] 2.3 Each item row shows: name, quantity (or "—" if null), edit icon, delete icon
- [x] 2.4 Add empty state message when no items exist
- [x] 2.5 Add staleness banner — shown when no items OR most recent `updated_at` > 3 days ago

## 3. Quick Add Modal

- [x] 3.1 Add FAB (floating action button) that opens the Quick Add modal
- [x] 3.2 Quick Add modal: large multiline `TextInput` with placeholder "chicken, eggs, broccoli\nrice, olive oil..."
- [x] 3.3 "Add Items" button: parse text by comma/newline, call `bulkAddItems()`, close modal, refresh list
- [x] 3.4 Show loading state on "Add Items" button while saving; show error if save fails

## 4. Edit Modal

- [x] 4.1 Tapping edit icon on an item opens an Edit modal pre-filled with item's name, quantity, category
- [x] 4.2 Edit modal: TextInput for name (required), TextInput for quantity (optional, placeholder "e.g. 2 lbs")
- [x] 4.3 Edit modal: 6 category chip buttons (Protein / Vegetables / Fruit / Grains / Pantry / Other)
- [x] 4.4 Save button calls `updateItem()`, closes modal, refreshes list
- [x] 4.5 Delete button in edit modal (or on item row) calls `deleteItem()` after confirmation, refreshes list

## 5. Verification

- [x] 5.1 Open Inventory tab — empty state and staleness banner both display
- [x] 5.2 Tap Quick Add, type "chicken, eggs, broccoli" → items appear grouped under Protein and Vegetables
- [x] 5.3 Use iOS keyboard mic to dictate items → text captured correctly in Quick Add field
- [x] 5.4 Tap edit on an item → add quantity "2 lbs" and save → quantity appears in list
- [x] 5.5 Change an item's category via edit → item moves to correct section
- [x] 5.6 Delete an item → removed from list immediately
- [x] 5.7 "Other" category used for unrecognized item name (e.g., "sriracha")
