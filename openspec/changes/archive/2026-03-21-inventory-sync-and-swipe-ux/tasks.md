## 1. Home Screen — Re-fetch on Focus

- [x] 1.1 In `HomeScreen.tsx`, add `useFocusEffect` and `useCallback` imports from `@react-navigation/native` and `react`
- [x] 1.2 Replace `useEffect(() => { load(); }, [])` with `useFocusEffect(useCallback(() => { load(false); }, [load]))`
- [x] 1.3 In the `load` function, only set `loading = true` when `recommendations.length === 0` (i.e., skip the spinner on background re-fetches when results are already showing)

## 2. Meal Detail — Pull-to-Refresh

- [x] 2.1 In `MealDetailScreen.tsx`, add a `refreshing` boolean state (default `false`)
- [x] 2.2 Extract the existing `Promise.all([fetchMealWithIngredients, fetchInventory])` load logic into a reusable `loadData` function
- [x] 2.3 Add an `onRefresh` async function that sets `refreshing = true`, calls `loadData`, then sets `refreshing = false`
- [x] 2.4 Add `RefreshControl` to the main `ScrollView` bound to `refreshing` and `onRefresh`

## 3. SwipeableRow — Controlled Open State

- [x] 3.1 Add `openRowId: string | null` state to `InventoryScreen` (default `null`)
- [x] 3.2 Update `SwipeableRow` props to accept `id: string`, `isOpen: boolean`, and `onOpen: (id: string | null) => void`
- [x] 3.3 In `SwipeableRow`, add a `useEffect` that watches `isOpen`: when `isOpen` becomes `false`, animate `translateX` back to 0
- [x] 3.4 In the `onPanResponderRelease` handler, call `onOpen(id)` when snapping open and `onOpen(null)` when snapping closed
- [x] 3.5 When `isOpen === true`, render a transparent `Pressable` overlay over the row content (same size, absolute positioned) that calls `onOpen(null)` on press — this closes the row on tap-outside
- [x] 3.6 In `renderItemRow`, pass `id={inv.id}`, `isOpen={openRowId === inv.id}`, and `onOpen={setOpenRowId}` to each `SwipeableRow`

## 4. Verification

- [ ] 4.1 Update inventory, navigate to Home — recommendations update within seconds without a loading spinner
- [x] 4.2 On meal detail, pull down to refresh — spinner shows briefly, ingredient availability updates to reflect current inventory
- [x] 4.3 Swipe row A open, then swipe row B — row A closes automatically, row B opens
- [ ] 4.4 Swipe a row open, then tap the row content (item name area) — row closes, no delete occurs
- [x] 4.5 Swipe row back to the left manually — row closes (existing behavior still works)
