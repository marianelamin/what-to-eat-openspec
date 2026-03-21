## Context

The current Meal Detail screen is read-only. The catalog has no mutation actions — add-meal works but edit/delete do not exist. Users also can't trigger the "Choose This Meal" flow from anywhere except the Home tab. Bulk photo import requires multi-select from the device library, which needs `expo-image-picker` with `allowsMultipleSelection: true`.

`expo-image-picker` is already a dependency (used on the Add Meal screen). No new package installation is required. `uploadMealPhoto` in `mealService.ts` already handles Supabase storage upload.

## Goals / Non-Goals

**Goals:**
- "Choose This Meal" accessible from Meal Detail (same flow as Home screen)
- Edit meal in-place on the detail screen (photo, name, ingredients, recipe)
- Archive meal (soft-delete) with confirmation — reversible, data retained
- Permanently delete meal (hard-delete) with stronger confirmation — for mistakes
- Archived meals visible in the catalog with a visual indicator; manageable from their detail screen
- Bulk photo import from camera roll into draft meals
- Catalog list refreshes after any mutation

**Non-Goals:**
- Edit meal from the catalog grid (actions only on detail screen)
- Renaming a draft meal during import (user edits afterward via the existing edit flow)
- Changing meal time_category or nutritional tags from this change (separate concern)
- Undo/undo history for delete

## Decisions

### 1. Edit inline on detail screen, not a separate edit screen

**Decision:** Reuse MealDetailScreen for edit mode (toggle between view/edit).

**Why:** The detail screen already shows all the fields. Pushing a new screen adds nav overhead and duplicates UI. A toolbar "Edit" button that swaps the screen into edit mode (like iOS Notes) is simpler to build and feels native.

**Alternative considered:** Separate `EditMealScreen` pushed onto the stack — rejected because it requires duplicating the form layout and a separate route.

### 2. Ingredients as a multiline TextInput in edit mode

**Decision:** In edit mode, ingredients are editable via a single multiline TextInput, one ingredient per line (same pattern as AddMealScreen).

**Why:** Consistent with existing Add Meal UX. When entering edit mode, the ingredient list is joined with `\n`; on save, split and trim to produce the updated rows.

**Alternative considered:** Per-row add/remove buttons — more interactive but higher implementation cost; deferred to a future polish pass.

### 3. Two distinct removal actions: Archive and Delete Permanently

**Decision:** The detail screen exposes two separate destructive actions with different semantics:
- **Archive** (`is_archived = true`) — hides the meal from recommendations and marks it visually in the catalog. Reversible via Restore. Preserves all data including meal_history.
- **Delete Permanently** — hard-deletes the meal row and its `meal_ingredients` rows. Shown with a stronger confirmation ("This cannot be undone"). Intended for accidental adds.

**Why:** A single "Delete" action forced the choice between losing data (too destructive for a stale meal) and being overly cautious (archiving an accidental duplicate feels wrong). Surfacing both makes the intent explicit. Archive is the everyday action; Delete Permanently is an escape hatch for mistakes.

**Alert copy distinction:**
- Archive: "Archive this meal?" / "This meal will be hidden from suggestions. You can restore it later."
- Delete Permanently: "Delete permanently?" / "This meal and all its data will be removed. This cannot be undone."

### 4. Archived meals remain visible in the catalog

**Decision:** `CatalogScreen` fetches all meals (active + archived) and renders archived meals at the bottom of the grid with a greyed-out style and an "Archived" badge. They are not filtered out.

**Why:** The user needs to be able to identify what they've archived and act on it (restore or permanently delete). Hiding archived meals entirely would require a separate "archived" screen, which adds navigation complexity. Showing them inline at the bottom is lower-friction and makes the catalog the single place for all meal management.

**Alternative considered:** Separate "Archived" tab or section behind a toggle — more organized for large catalogs but over-engineered for MVP where archiving will be rare.

### 5. Bulk import creates draft meals immediately on selection

**Decision:** After the user selects photos from the camera roll, the app uploads each image and inserts a `Meal` row with `name = "Unnamed Meal"` in sequence (not batched). If a single upload fails, that photo is skipped and a count of failures is shown at the end.

**Why:** Sequential upload avoids overwhelming the upload service. Partial failure tolerance means the user gets as many drafts as possible.

**Alternative considered:** Upload all in parallel — higher throughput but risks rate limiting and makes partial failures harder to track.

### 6. Catalog refresh via navigation param callback

**Decision:** `CatalogNavigator` passes a `onMealMutated` callback to `MealDetailScreen` via route params. After any mutation (edit, delete, choose), `onMealMutated()` is called, which triggers a reload in `CatalogScreen`.

**Why:** Clean, explicit signal. Avoids global state or event buses for a single screen relationship.

**Alternative considered:** `useFocusEffect` reload on every catalog focus — simpler but reloads even when nothing changed (e.g., user just browses); also resets scroll position unnecessarily.

## Risks / Trade-offs

- **Edit mode UX regression** → Mitigation: show clear "Editing" header state and a Cancel button to discard changes
- **Accidental permanent delete** → Mitigation: distinct confirmation copy ("This cannot be undone") and red destructive button styling to signal severity
- **meal_history rows reference deleted meals** → Acceptable for MVP; history rows for hard-deleted meals will have a dangling meal_id but this only affects a future History screen (Day 5); add `ON DELETE SET NULL` or handle gracefully there
- **Bulk import with many photos** → Mitigation: sequential upload + progress feedback ("Importing 3 of 8..."); cap at 20 photos per import session
- **Ingredient edit round-trip may trim whitespace** → Acceptable; all existing ingredient names are already trimmed on creation
- **`onMealMutated` callback becomes stale** → Mitigation: wrap in `useCallback` with stable deps; this is a known React Navigation pattern

## Open Questions

- None blocking implementation.
