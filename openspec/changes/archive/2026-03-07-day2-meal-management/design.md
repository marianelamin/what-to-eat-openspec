## Context

Day 1 delivered auth, navigation shell, and the database schema (`meals`, `meal_ingredients` tables with RLS). Day 2 turns the Catalog placeholder into a real, working meal catalog. The `meals` table is already in Supabase; this change adds the UI and service layer, plus Supabase Storage for photos.

Existing foundation:
- `src/services/supabase.ts` — Supabase client (configured with AsyncStorage)
- `src/types/index.ts` — auth types; will extend with meal types
- `src/screens/CatalogScreen.tsx` — placeholder to replace
- `src/navigation/AppNavigator.tsx` — bottom tab navigator; Catalog tab needs a stack

## Goals / Non-Goals

**Goals:**
- Users can add a meal with a photo, name (required), optional ingredients and notes
- Catalog tab shows a photo-dominant grid of all user meals
- Tapping a meal opens a read-only detail screen
- Search by meal name filters the catalog list client-side
- Meal photos stored in Supabase Storage (`meal-photos` bucket)

**Non-Goals:**
- Edit/delete meals (deferred — detail screen is read-only for now)
- Tags / Healthy Eating Plate classification (Day 4)
- Nutritional data
- Sharing meals between users

## Decisions

### 1. Supabase Storage for photos (public bucket)

Photos are uploaded to a `meal-photos` Supabase Storage bucket configured as public. The resulting public URL is stored in `meals.photo_url`. This avoids signed URL complexity for a personal app, and public URLs work directly in `<Image>` components.

**Alternative considered:** Signed URLs — more secure but adds complexity (URL expiry, refresh logic). Unnecessary for a single-user personal app.

### 2. Client-side filtering

Search/filter by meal name is done in-memory on the already-fetched list. No server-side full-text search.

**Alternative considered:** Supabase `ilike` query per keystroke — overkill for a personal catalog that will have tens to hundreds of meals, not thousands.

### 3. Stack navigator for Catalog tab

The Catalog tab is converted from a single screen to a stack navigator (`CatalogStack`) containing `CatalogScreen` (list), `MealDetailScreen`, and `AddMealScreen`. This allows back-navigation within the tab without leaving it.

**Alternative considered:** Modal navigation for Add Meal — simpler but inconsistent with the mockup's in-tab flow.

### 4. Meal service layer (`src/services/mealService.ts`)

All Supabase meal operations (fetch, insert, upload photo) are extracted into a dedicated service module. Screens call the service; no raw Supabase calls in components.

### 5. Ingredients as free-text lines (MVP)

In the Add Meal form, ingredients are entered as a multi-line text field (one per line). On save, each non-empty line is inserted as a row in `meal_ingredients` with just the `name` field. The `quantity`/`unit` fields (nullable in schema) are left null for now.

**Alternative considered:** Structured ingredient entry (name + quantity + unit per row) — better UX but complex form; deferred to a later day.

## Risks / Trade-offs

- **Storage bucket must be created manually** — The `meal-photos` bucket doesn't exist yet; user must create it in Supabase dashboard and set it to public. → Documented as a user action in tasks.
- **No optimistic UI** — Save operations hit Supabase before updating the list. On slow connections this feels sluggish. → Acceptable for MVP; add optimistic updates in polish sprint if needed.
- **Photos are not resized before upload** — Large photos increase storage costs and load times. → Expo Image Picker's `quality` option (0.7) and `maxWidth`/`maxHeight` compression mitigate this sufficiently for MVP.

## Open Questions

- None — scope is clear and constrained.
