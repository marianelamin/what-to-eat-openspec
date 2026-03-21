## Context

Three independent UX improvements touching `MealDetailScreen` and `CatalogScreen`. None require new services, schema changes, or external dependencies — all needed data (`fetchInventory`, `logMeal`) already exists.

## Goals / Non-Goals

**Goals:**
- Ingredient availability tags in detail view (have / missing) using existing inventory data
- Quick-log button on catalog cards (no navigation required)
- Restore archived meal without a confirmation dialog

**Non-Goals:**
- Real-time inventory sync while detail screen is open
- Bulk-log multiple meals from catalog
- Changing the log confirmation flow on the Home screen or detail screen "Choose This Meal" button

## Decisions

### 1. Ingredient availability — fetch inventory alongside ingredient fetch

**Decision:** In `MealDetailScreen`, fetch inventory in parallel with `fetchMealWithIngredients` using `Promise.all`. Store the inventory in local state. Derive a `Set<string>` of available ingredient name tokens. For each meal ingredient, apply the same substring match used in `recommendationService` (`inv.includes(ing) || ing.includes(inv)`) to determine "have" vs "missing". Items with quantity 0 are treated as missing.

**Why:** Reuses exact matching logic already in production. No new service call signatures. Parallel fetch means no extra latency — inventory loads while ingredients load.

**Alternative considered:** Pass inventory as a navigation param from the catalog. Rejected: inventory could be stale by the time the user opens detail, and it creates tight coupling between catalog and detail.

### 2. Quick-log from catalog — icon overlay on card, per-card loading state

**Decision:** Add a small checkmark FAB-style button anchored to the bottom-right of each `MealCard` image. Tapping it calls `logMeal(meal.id)` directly. `CatalogScreen` tracks a `loggingId: string | null` state — if `loggingId === meal.id`, the button shows a spinner. After success, calls `loadMeals()` to refresh the grid. Only active (non-archived) meals show the button.

**Why:** Positioning the button over the photo makes it visually tied to the meal without requiring extra card height. Per-card loading state (rather than a global flag) means the user can see exactly which meal is being logged. Calling `loadMeals()` after success keeps the catalog stats fresh.

**Alternative considered:** Long-press on card to trigger log. Rejected: not discoverable; users expect long-press to be a selection/context-menu pattern.

### 3. Restore — remove Alert, call directly

**Decision:** In `MealPage` (inside `MealDetailScreen`), replace the `Alert.alert` + async callback pattern in `handleRestore` with a direct `await restoreMeal(meal.id)` call guarded by the existing `actioning` state.

**Why:** Restoring is low-risk and fully reversible (user can archive again). The confirmation dialog adds a tap with no safety benefit. Consistent with how other low-risk mobile actions work (e.g., toggling a setting).

## Risks / Trade-offs

- **Ingredient match false positives/negatives** → Same risk exists in recommendations today; accepted for MVP. Users can see the tags and judge.
- **Quick-log without review** → User might log the wrong meal by accident. Mitigation: the existing Home screen confirmation dialog remains; only the catalog quick-log is instant. A logged meal can be viewed in history.
- **Inventory fetch on every detail open** → Adds one extra Supabase call per detail navigation. For a personal app with a small inventory table this is negligible.
