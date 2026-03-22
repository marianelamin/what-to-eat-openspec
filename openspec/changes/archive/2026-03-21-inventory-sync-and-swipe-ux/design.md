## Context

Three quality-of-life fixes discovered through daily use. All touch existing screens — no new screens or services. The root causes are: (1) `useEffect` fires once on mount vs `useFocusEffect` fires on every focus; (2) no `RefreshControl` on the meal detail scroll view; (3) `SwipeableRow` is fully self-contained with no parent coordination.

## Goals / Non-Goals

**Goals:**
- Home recommendations reflect current inventory every time the user navigates to the tab
- Meal detail ingredient indicators can be refreshed without leaving the screen
- Swipe-to-delete rows close when tapping outside and can't stack open

**Non-Goals:**
- No real-time / push-based inventory sync
- No global state management / context for inventory caching
- No animation changes to the swipe gesture itself

## Decisions

### Home screen: useFocusEffect with background refresh

Replace `useEffect(() => { load(); }, [])` with `useFocusEffect(useCallback(() => { load(); }, [load]))`. The existing `load()` function already handles the loading state — but to avoid a spinner flash on every tab switch, skip setting `loading = true` when recommendations are already present (only show spinner on first load). Use an `isRefresh` flag (already exists) to distinguish initial load from focus re-fetch.

### Meal detail: RefreshControl on ScrollView

`MealDetailScreen` renders a `ScrollView`. Add `RefreshControl` bound to a new `refreshing` boolean state. The `onRefresh` handler re-runs the existing `Promise.all([fetchMealWithIngredients, fetchInventory])` call. The scroll view is already present — this is a minimal addition.

### SwipeableRow: controlled open state with parent coordination

Refactor `SwipeableRow` from fully self-contained to partially controlled:

```
InventoryScreen
  openRowId: string | null   ← tracks which row is currently open
  setOpenRowId(id | null)

  SwipeableRow (id, isOpen, onOpen)
    when isOpen changes false → Animated.spring to 0
    on swipe open → onOpen(id)
    on tap-outside-close → onOpen(null)
```

`SwipeableRow` receives three new props:
- `id: string` — the inventory item's id (used for identity)
- `isOpen: boolean` — controlled open state from parent
- `onOpen: (id: string | null) => void` — called when row opens or closes

When `isOpen` transitions from `true` to `false` (another row opened or tap-outside), animate back to 0.

For tap-outside-to-close: when `isOpen === true`, render a transparent `Pressable` overlay over the row content that calls `onOpen(null)` on press. This overlay sits on top of the children so taps on the row content (not the delete button) are intercepted. The delete button is rendered behind the row (already absolute-positioned) and is not covered by the overlay.

The parent (`InventoryScreen`) adds `openRowId` state (default `null`) and passes `isOpen={openRowId === inv.id}` and `onOpen={setOpenRowId}` to each `SwipeableRow`.

## Risks / Trade-offs

- **useFocusEffect re-fetch on every tab visit**: Adds one network call each time the user navigates to Home. Acceptable for a personal app with small data sets. If this becomes noticeable, a time-based throttle can be added later.
- **Overlay intercepts taps on row content**: When a row is open, tapping the item name (to edit) won't work — the overlay closes the row instead. This is intentional and expected UX (close first, then interact). No mitigation needed.
- **Controlled SwipeableRow re-renders**: `openRowId` state in `InventoryScreen` causes all rows to re-render when any row opens. With typical inventory sizes (< 50 items) this is not a performance concern.
