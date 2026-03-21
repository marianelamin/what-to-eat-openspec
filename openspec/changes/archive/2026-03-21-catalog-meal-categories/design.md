## Context

The catalog currently shows all meals in a single mixed grid. As meal counts grow (20–50+ meals is realistic for a personal-use app), breakfast items like "oatmeal" or "scrambled eggs" clutter the lunch/dinner grid and vice versa. The user wants a simple way to scope their browsing to the right meal context.

The `meals` table has no category/type column today. We need a data model change, a migration, and UI updates across three screens.

## Goals / Non-Goals

**Goals:**
- Add a `meal_type` field (`'breakfast'` | `'all_day'`) to the meals data model
- Show segmented Breakfast / All Day tabs on the catalog screen
- Support assigning and editing meal type on Add Meal and Edit Meal

**Non-Goals:**
- No "Lunch" / "Dinner" split — keeping it binary keeps the UI simple
- No server-side filtering (client-side tab filter is sufficient)
- No recommendation changes based on meal type (could be a future improvement)
- No automatic detection of meal type from name or ingredients

## Decisions

### 1. Data model: column vs. tag

**Decision:** Add a `meal_type text NOT NULL DEFAULT 'all_day'` column to the `meals` table in Supabase.

**Why:** Simple, cheap to filter on, no extra join. The two values are a closed set that won't grow frequently.

**Alternative considered:** A tag/label system (like categories on inventory). Rejected — overkill for a binary split; tags would require a separate table join.

### 2. Default value for existing meals

**Decision:** All existing meals default to `'all_day'`.

**Why:** The safer default — existing meals don't lose visibility. Users can reclassify breakfast items manually.

### 3. Catalog UI: combined row with scrollable chips + expandable search

**Decision:** The type filter and search live in a single row. The left side is a horizontally scrollable list of `Chip`-style buttons (Breakfast first, then All Day). The right side is a compact search icon/field. When the user focuses search, the chips slide out and the search bar expands to fill the full row. Chips return when search blurs.

**Tab order:** Breakfast on the left, All Day on the right.

**Why chips instead of SegmentedButtons:** `SegmentedButtons` is fixed-width and cannot scroll. A horizontal `ScrollView` with `Chip` components (already used in inventory edit modal) is future-ready — adding "Meal Prep" or other types later requires no layout changes.

**Why single row:** Saves vertical real estate. The catalog is photo-dominant; every pixel of grid height matters.

**Why conditional render (not animation) for search expand:** Simpler to implement, no `Animated.Value` needed. The instant swap feels clean and calm, matching the app's aesthetic.

**Alternative considered:** Full tab bar (React Navigation tabs). Rejected — adds another navigation layer and would require restructuring the catalog stack.

**Alternative considered:** Keep chips and search on separate rows. Rejected — wastes vertical space.

### 4. Search expand/collapse behavior

**Decision:** Search expands to full row width on focus. Chips are hidden (not rendered) while search is active. On blur, chips reappear and search collapses back to its compact form. Search text is preserved on blur — it clears only when the user explicitly clears it or switches tabs.

**Why:** Blur is the most natural collapse trigger. Preserving the query on blur lets the user dismiss the keyboard while still seeing filtered results.

### 5. Active tab state persistence

**Decision:** Tab selection is in-memory state (`useState`), not persisted to AsyncStorage.

**Why:** It resets on app restart, which is fine — the user can quickly re-select. No complexity needed for a personal app.

### 6. Search scope

**Decision:** Search filters within the active tab only.

**Why:** If the user is in the Breakfast tab and searches, they expect breakfast results. Cross-tab search would be confusing and harder to implement cleanly.

## Risks / Trade-offs

- [Migration] Existing users need the Supabase column added. Mitigation: run the migration before deploying the app update; the `DEFAULT 'all_day'` ensures backward compatibility.
- [Empty tab state] If the user hasn't classified any meals as Breakfast, the Breakfast tab will be empty. Mitigation: show the same empty-state message already used for the catalog ("No meals yet — add your first!").
- [RLS] The meals table RLS policy uses `user_id`. Adding a column doesn't affect RLS.

## Migration Plan

1. Add column in Supabase SQL editor:
   ```sql
   ALTER TABLE meals ADD COLUMN meal_type text NOT NULL DEFAULT 'all_day';
   ```
2. Deploy updated app (reads and writes `meal_type`; existing rows already have the default)
3. No rollback risk — old app versions simply ignore the new column

## Open Questions

- Should "All Day" be the label, or "Lunch & Dinner"? "All Day" is more inclusive (covers snacks, meal preps, etc.) and was the user's original language.
