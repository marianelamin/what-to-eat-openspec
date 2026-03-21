## Why

Users can accidentally add the same ingredient multiple times under slightly different names (e.g., "chicken", "Chicken", "chickens", "chiken"), causing a cluttered, confusing inventory that undermines meal recommendation accuracy. Preventing near-duplicate entries keeps the inventory clean without requiring manual dedup work.

## What Changes

- When adding an item via Quick Add, each name is checked against existing inventory items before inserting
- If a near-duplicate is detected (case-insensitive, singular/plural, or 1-character mismatch), the new item is silently skipped — it is not inserted again, instead the item becomes stocked.
- Duplicate detection applies to bulk add (Quick Add modal) and any single-item add paths
- No UI change needed for the happy path; a subtle summary after Quick Add can note "X items already in inventory" if any were skipped

## Capabilities

### New Capabilities
- `inventory-dedup`: Logic for detecting near-duplicate inventory item names before insert, covering case normalization, singular/plural folding, and 1-character edit-distance tolerance

### Modified Capabilities
- `inventory-management`: The add-item requirement changes — duplicates must be rejected before write, not just stored

## Impact

- `src/services/inventoryService.ts` — `bulkAddItems` must check for near-matches before inserting each name
- `src/screens/InventoryScreen.tsx` — Quick Add modal may surface a "skipped N duplicates" message after save
- No schema changes needed (Supabase `inventory_items` table unchanged)
