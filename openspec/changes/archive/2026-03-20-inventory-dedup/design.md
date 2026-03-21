## Context

The inventory Quick Add modal calls `bulkAddItems(names)` which inserts all parsed names directly into Supabase `inventory_items` without any dedup check. Users who re-run Quick Add (which is encouraged by the staleness banner) or who forget what they already added end up with duplicates like "chicken" and "Chicken", or "egg" and "eggs".

The current `isAvailable()` helper in MealDetailScreen already does fuzzy substring matching to check if an ingredient is in inventory. We can apply similar logic — plus edit distance — in a pre-insert guard.

## Goals / Non-Goals

**Goals:**
- Block insertion of any item whose normalized name is too similar to an existing inventory item name
- Cover: case differences, plural/singular (trailing "s"), and 1-character typo (edit distance ≤ 1)
- When a near-duplicate is detected, set the **existing** matching item to Stocked (quantity = '6') — treating re-adding as an intent to restock
- Report to the user how many items were already in inventory after Quick Add

**Non-Goals:**
- No UI for "did you mean X?" — just update silently and report the count
- No retroactive dedup of items already in the database
- No server-side enforcement (client-side guard is sufficient for a personal-use app)
- No fuzzy match on the edit modal rename path (only on add)

## Decisions

### 1. Where to place dedup logic

**Decision:** In `inventoryService.ts`, inside `bulkAddItems`, before the Supabase insert call.

**Why:** Keeps the logic in the service layer, co-located with the insert. The screen doesn't need to know about the matching algorithm. The service fetches existing items, runs the check, inserts non-duplicates, and updates the quantity of matched duplicates to '6' (Stocked).

**Alternative considered:** Client-side in the screen. Rejected — mixing business logic into the UI layer.

### 2. Matching algorithm

**Decision:** Three-step check, any match = near-duplicate:
1. Normalize: lowercase + trim both sides
2. Exact match after normalization
3. One is a plural/singular variant (trailing "s" or "es")
4. Levenshtein edit distance ≤ 1 (covers 1-letter typo) — only applied when both names are ≥ 4 characters

**Why:** Covers the stated cases without pulling in a fuzzy-match library. Edit distance ≤ 1 is simple to implement inline (~15 lines).

**Alternative considered:** Substring containment (like `isAvailable()`). Rejected — too aggressive for dedup; "rice" would block "fried rice".

### 3. Behavior on near-duplicate detection

**Decision:** When a candidate name matches an existing item, call `updateItem(existingId, { quantity: '6' })` to set it to Stocked, and do not insert a new row.

**Why:** The user re-adding an item they already have is most likely expressing "I have this, I just stocked up." Silently marking it Stocked is more useful than doing nothing. It also means running Quick Add after a grocery run properly refreshes levels on existing items.

### 4. Reporting to the user

**Decision:** `bulkAddItems` returns `{ inserted: number; stocked: number }`. The Quick Add handler shows a message if `stocked > 0`: "X item(s) already in inventory — marked as stocked."

**Why:** Users need feedback that their input was recognized. Silent update without any signal would be confusing.

## Risks / Trade-offs

- [False positives] "ham" and "yam" have edit distance 1. Mitigation: edit-distance check only applies to names ≥ 4 characters; short names get exact-match-only treatment.
- [Unintended restock] If the user accidentally types a near-duplicate, the existing item gets bumped to Stocked. Mitigation: acceptable trade-off; the level badge tap makes it trivial to adjust back.
- [Performance] Fetching all existing inventory items on every Quick Add. Mitigation: personal-use app, typically < 100 items; negligible.
