## Context

The current `InventoryScreen` shows each item as a row with the item name and a level label badge. Tapping anywhere on the row opens a full edit modal. The modal contains: a name TextInput, category chips, level chips (Stocked/Some/Low/Out of stock), and Save/Cancel buttons.

The level badge is the most frequently changed field — users typically restock several items at once after shopping. The full-modal round-trip is unnecessary for this single-field update.

`updateItem(id, { quantity })` in `inventoryService.ts` already handles saving; no service changes are needed.

## Goals / Non-Goals

**Goals:**
- Single tap on the level badge cycles to the next level and saves immediately
- Visual confirmation of save (brief highlight) so user knows the tap registered
- Edit modal simplified to name + category only (level removed)

**Non-Goals:**
- Swipe-to-edit or swipe-to-delete (separate future improvement)
- Undo after a badge tap (out of scope for MVP)
- Custom cycle order per item

## Decisions

### 1. Tap cycles forward through levels, wraps around

**Decision:** Badge tap cycles: Stocked (6) → Some (4) → Low (2) → Out of stock (0) → Stocked (6).

**Why:** Forward-only cycle is the simplest interaction — one direction, predictable, no ambiguity. Users restocking go from a lower level upward; users consuming go downward. Since both directions are equally common, a wrap-around cycle is the most neutral choice. If the user overshoots, one more tap gets them back.

**Alternative considered:** Tap opens a small inline popover with 4 options — more precise but requires more taps and a popover component; not worth the complexity given only 4 levels.

### 2. Save on every tap (no pending state)

**Decision:** Each badge tap immediately calls `updateItem` and saves to Supabase. No "confirm" step.

**Why:** The action is low-stakes and easily reversible by tapping again. Instant save removes the need for any pending/dirty state management. This is consistent with how toggle switches work in mobile settings UIs.

**Alternative considered:** Accumulate changes and save on swipe-away/blur — increases implementation complexity, introduces risk of lost changes if user navigates away.

### 3. Visual feedback via brief opacity pulse

**Decision:** On tap, the badge briefly dims (opacity 0.4) then returns to full opacity over ~200ms using `Animated.sequence`. No toast or snackbar.

**Why:** A toast would be too noisy when tapping multiple items in a row. The opacity pulse is subtle, immediate, and spatially located at the element the user just touched — ideal for confirming a fast interaction.

### 4. Remove level chips from edit modal

**Decision:** The edit modal retains only name TextInput and category chips. Level chips are removed entirely.

**Why:** With inline badge cycling, the modal's level chips are fully redundant. Removing them simplifies the modal and removes the question of which mechanism "wins" if they conflict.

## Risks / Trade-offs

- **Unintended taps** → Mitigation: the badge is small but distinctly styled (pill shape); accidental taps are recoverable with one more tap
- **Save fails silently** → Mitigation: on `updateItem` failure, revert the displayed level to the previous value and show a brief error snackbar
- **Out of stock items stay visible** → This is intentional; users should see what they're out of to know what to buy

## Open Questions

- None blocking implementation.
