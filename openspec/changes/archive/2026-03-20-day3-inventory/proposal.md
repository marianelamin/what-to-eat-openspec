## Why

The recommendation engine needs to know what ingredients the user has on hand. Without inventory data, the app cannot score meals by ingredient availability — the core loop (recommend → choose → log → deduct) is incomplete. Day 3 builds the inventory foundation that Day 4 recommendations depend on.

## What Changes

- New Inventory screen replaces the placeholder with a functional ingredient list
- Users can quickly add items by typing or dictating a comma/newline-separated list (iOS keyboard dictation works in any text field — no library needed)
- Items are bulk-inserted without quantities; quantities are added later by editing individual items
- Items are auto-categorized by keyword matching (Protein, Vegetables, Fruit, Grains, Pantry, Other)
- Items are grouped by category in the list view
- Users can edit (name, quantity, category) or delete individual items
- A staleness banner appears when inventory has not been updated in 3+ days
- Items stored in Supabase `inventory_items` table (schema already exists from Day 1)

## Capabilities

### New Capabilities
- `inventory-management`: Full CRUD for inventory items — bulk add via text/voice, list grouped by category, edit name/quantity/category, delete, with staleness indicator

### Modified Capabilities
<!-- None -->

## Impact

- `src/screens/InventoryScreen.tsx` — rewritten from placeholder
- `src/services/inventoryService.ts` — new service file
- `src/types/index.ts` — add `InventoryItem` type
- Supabase `inventory_items` table (already exists, no schema changes needed)
