## Context

The current `handleDelete` in `InventoryScreen.tsx` wraps the delete call in `Alert.alert('Delete Item', ...)`, requiring the user to confirm before the item is removed. For an app where items are fast to re-add (just type the name again), this confirmation adds friction without meaningful protection.

The Restore-Meal flow already established a precedent in this codebase: low-risk reversible actions (or easily re-done actions) should execute immediately without a dialog (see `meal-detail-ux` change).

## Goals / Non-Goals

**Goals:**
- Delete an inventory item immediately on tap, without a confirmation dialog
- Use optimistic UI: remove the item from local state first, revert on failure
- Show an error alert only on failure

**Non-Goals:**
- No undo / snackbar "undo" mechanism (out of scope; item can be re-added)
- No change to the Edit Item flow
- No change to the bulk-delete path (none exists)

## Decisions

### 1. Optimistic delete

**Decision:** Remove the item from local `items` state immediately before the async `deleteItem` call. Revert on error.

**Why:** Makes the UI feel instant. Consistent with how `handleBadgeTap` works (optimistic level update with revert). The list re-render is fast and the success path is overwhelmingly more common than failure.

**Alternative considered:** Wait for the server to confirm before updating local state. Rejected — introduces visible lag on tap.

### 2. Error handling

**Decision:** On failure, revert the item back into its original position in the list and show `Alert.alert('Error', 'Failed to delete item.')`.

**Why:** Same pattern as the badge tap failure path. Simple and consistent.

## Risks / Trade-offs

- [Accidental delete] No confirmation means a single misplaced tap permanently removes the item. Mitigation: the swipe-to-reveal edit/delete interaction (Priority Medium future improvement) will solve this ergonomically — the current Delete button position already requires a deliberate tap on a small target.
- [No undo] Once deleted the item is gone. Acceptable for a personal-use app where re-adding takes seconds.
