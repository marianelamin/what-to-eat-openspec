## Context

`CatalogScreen` uses `useFocusEffect` to reload meals every time the screen comes back into focus. The current implementation calls `setLoading(true)` at the start of each reload, which swaps the FlatList for a spinner — causing React Native to unmount and remount the list, losing scroll position entirely.

`MealDetailScreen` is a standalone screen with no knowledge of adjacent meals in the catalog. Navigation between meals requires backing out to the catalog and tapping a new card.

No additional navigation libraries are in use (React Navigation native stack + React Native core only).

## Goals / Non-Goals

**Goals:**
- Restore catalog scroll position after returning from MealDetailScreen
- Enable left/right swipe between meals in MealDetailScreen using the currently-filtered catalog list
- Keep the solution dependency-free (no react-native-pager-view or gesture-handler additions)

**Non-Goals:**
- Swipe navigation while in edit mode (swiping is disabled while editing a meal)
- Infinite scroll or lazy loading of meals
- Position memory across app restarts

## Decisions

### 1. Suppress the loading spinner on background reloads

**Decision:** Remove `setLoading(true)` from the `useFocusEffect` reload path. The `loading` state becomes true only on initial mount. Background refreshes update state silently while the list remains visible.

**Why:** The spinner causes the FlatList to unmount. Keeping the list mounted is a precondition for any scroll-restore strategy. Silent background refresh is standard UX for list screens — users see their content immediately with any changes diffed in.

**Alternative considered:** Keep the spinner but restore scroll via `scrollToOffset` after load. This causes a flash (spinner → list at top → jump to offset) that is more disruptive than no spinner at all.

### 2. Track and restore FlatList scroll offset with a ref

**Decision:** Add a `scrollOffsetRef` (ref, not state) to `CatalogScreen`. Update it on `onScroll` events with `scrollEventThrottle={100}`. After `useFocusEffect` reloads complete, call `flatListRef.current?.scrollToOffset({ offset: scrollOffsetRef.current, animated: false })`.

**Why:** A ref avoids triggering re-renders on every scroll event. `scrollToOffset` with `animated: false` is imperatively instant — no jump visible to users. The restore call happens after the data reload settles so the list has the right number of items before jumping.

### 3. Horizontal paging via FlatList in MealDetailScreen

**Decision:** Wrap the detail content in a horizontal `FlatList` with `pagingEnabled` at the top level of `MealDetailScreen`. Each page is an independent vertical `ScrollView` containing one meal's content. Track the visible page with `onMomentumScrollEnd`.

**Why:** React Native's built-in `FlatList + pagingEnabled` gives iOS-native paging feel with no extra dependencies. Horizontal outer / vertical inner scroll doesn't conflict on iOS because the gesture recognizer resolves the scroll direction from initial touch angle. `FlatList` also gives free lazy rendering — only the current page and its neighbors are rendered.

**Alternative considered:** `ScrollView` with `pagingEnabled` — simpler but renders all pages eagerly and loses the lazy-rendering benefit for large catalogs.

### 4. Pass filtered meal list and initial index through navigation params

**Decision:** When tapping a meal card, `CatalogScreen` passes `meals: filtered` (current search-filtered array) and `initialIndex: number` to the `MealDetail` route. `MealDetailScreen` uses these to populate the pager.

**Why:** The detail screen needs the full ordered list to support swiping. Passing the filtered list (not the full catalog) ensures swipe order matches what the user sees on the catalog. Passing the index avoids a linear scan in MealDetailScreen.

**Trade-off:** If the catalog list changes while the user is in the detail pager (e.g., background sync), the pager reflects the snapshot from when they navigated in. Acceptable for MVP; the user can go back and re-enter if needed.

### 5. Disable swipe while in edit mode

**Decision:** The horizontal pager's scrolling is disabled (`scrollEnabled={false}`) when `isEditing` is true for the current page.

**Why:** Swiping away while editing would silently discard changes. Disabling the scroll gesture is simpler than adding a confirmation dialog on swipe.

## Risks / Trade-offs

- **Large catalogs**: Passing the entire filtered meals array as a navigation param is fine for personal-use scale (< 200 meals). For very large lists, this could be optimized with IDs + lazy fetch, but that's out of scope.
- **onMealMutated callback with pager**: The existing `onMealMutated` callback reloads the catalog list. When triggered from inside a paged meal (e.g., after logging or archiving), the catalog reloads in the background and navigation goes back normally. No issues expected.
- **Scroll restore timing**: If the FlatList hasn't finished laying out before `scrollToOffset` is called, the scroll may not land correctly. Mitigation: call `scrollToOffset` inside a `requestAnimationFrame` or after a short delay inside `useFocusEffect`.
