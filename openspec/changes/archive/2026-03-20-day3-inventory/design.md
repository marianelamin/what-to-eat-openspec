## Context

The `inventory_items` table already exists in Supabase (created Day 1). The `InventoryScreen` is a placeholder. This change wires up the full CRUD layer and replaces the screen with a functional UI. The key constraint is speed of capture — the user wants to quickly name items and add details later.

## Goals / Non-Goals

**Goals:**
- Fast bulk entry: type or dictate a list of item names, bulk-insert in one action
- Grouped list view by category
- Edit individual items to add quantities and correct categories
- Delete items
- Staleness warning when inventory hasn't been updated in 3+ days

**Non-Goals:**
- Receipt scanning (Phase 2)
- Confidence levels (schema field exists, defaulting to `'certain'`, no UI needed now)
- Predictive inventory or expiry tracking (Phase 2)
- Quantity unit parsing or normalization — quantity is a free-text field

## Decisions

**Voice input via iOS keyboard dictation (no library)**
iOS shows a mic button on the keyboard for any `TextInput`. Tapping it enables speech-to-text natively. No `@react-native-voice/voice` or dev build required. Trade-off: less discoverable, no in-app mic button — acceptable for a personal-use MVP.

**Bulk entry as free-text parse, not structured form**
A multiline `TextInput` accepting comma- or newline-separated names is faster than a per-item form. Items are parsed client-side before insert. Alternative (one item per form submission) was rejected as too slow for initial catalog setup.

**Auto-categorize by keyword matching**
A static keyword map assigns each item to a category. Covers the common cases; anything unmatched defaults to "Other". User can correct via the edit modal. Alternative (user manually picks category on entry) adds friction to the fast-capture flow.

**Quantities deferred, not required**
Items are inserted with `quantity: null`. The edit modal lets users add quantities per-item. This matches the user's stated preference: name first, details later.

**Staleness based on most recent `updated_at`**
Find the max `updated_at` across all items. If > 3 days ago (or no items), show the warning banner. Simple and requires no extra DB fields.

**No separate stack navigator for Inventory**
Unlike Catalog (which has a stack for detail/add screens), Inventory uses a single screen with modal overlays for Quick Add and Edit. Keeps navigation simple.

## Risks / Trade-offs

- **Keyword matching is incomplete** → User can tap edit to reassign category. The list can be expanded over time.
- **Duplicate items** → No dedup on bulk insert. If user runs Quick Add twice with same items, duplicates will appear. Acceptable for MVP; user can delete.
- **`updated_at` not auto-updated by Supabase** → The `updateItem` service function must explicitly set `updated_at: new Date().toISOString()` on every update call. Bulk insert sets it to `now()` via DB default.
