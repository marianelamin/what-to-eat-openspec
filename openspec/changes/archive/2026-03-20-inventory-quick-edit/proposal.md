## Why

Updating an item's stock level after shopping currently requires 3 taps: tap the item row to open a modal, tap a level chip, tap Save. When restocking many items at once this friction adds up fast. A direct inline tap on the level badge lets the user cycle through levels without leaving the list.

## What Changes

- Tapping the level badge (Stocked / Some / Low / Out of stock) on any inventory item row cycles to the next level and saves immediately — no modal required
- The cycle order is: Stocked → Some → Low → Out of stock → Stocked (wraps)
- The badge shows a brief visual confirmation (highlight pulse) after each tap to confirm the save
- Name and category edits continue to use the existing modal (tap the item row text area to open)
- The edit modal's level chips are removed (redundant with the new inline interaction) — the modal retains only name and category editing

## Capabilities

### New Capabilities
- `inventory-level-cycling`: Inline tap-to-cycle interaction on the inventory level badge; saves immediately to Supabase on each tap

### Modified Capabilities
- `inventory-management`: The "Edit item quantity via level chips" requirement changes — level is now set inline on the list row, not in the edit modal. The modal no longer includes level chips.

## Impact

- `src/screens/InventoryScreen.tsx` — item row gains a tappable badge; edit modal loses level chips; `updateItem()` called on each badge tap
- `src/services/inventoryService.ts` — no changes needed (`updateItem` already handles quantity updates)
- No new dependencies
