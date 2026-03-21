## Why

The confirmation dialog before deleting an inventory item adds unnecessary friction for a low-stakes action. Inventory items are quick to re-add, so the risk of accidental deletion is low. Removing the dialog makes the interaction feel faster and less heavy.

## What Changes

- Tapping "Delete" on an inventory item immediately deletes it — no `Alert.alert` confirmation step
- The delete is still optimistic: the item is removed from the local list immediately, and reverted on failure
- On failure, a brief error message is shown (e.g., `Alert.alert('Error', 'Failed to delete item.')`)

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `inventory-management`: The delete-item requirement changes — deletion must execute immediately without a confirmation dialog

## Impact

- `src/screens/InventoryScreen.tsx` — `handleDelete` removes the `Alert.alert` wrapper and calls `deleteItem` directly with optimistic UI update
