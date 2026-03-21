## 1. Navigation Types — Pass Meal List to Detail

- [x] 1.1 Update `CatalogStackParamList` in `src/navigation/CatalogNavigator.tsx` — add `meals: Meal[]` and `initialIndex: number` to the `MealDetail` route params (keep `onMealMutated` as-is)

## 2. Catalog Scroll Restore

- [x] 2.1 Add `flatListRef = useRef<FlatList>(null)` and `scrollOffsetRef = useRef(0)` to `CatalogScreen`
- [x] 2.2 Remove `setLoading(true)` from the `useFocusEffect` reload (use a separate `refreshing` boolean if needed, but do not unmount the FlatList during background reloads)
- [x] 2.3 Wire `flatListRef` to the FlatList and add `onScroll={(e) => { scrollOffsetRef.current = e.nativeEvent.contentOffset.y }}` with `scrollEventThrottle={100}`
- [x] 2.4 After reload in `useFocusEffect`, restore scroll: `requestAnimationFrame(() => flatListRef.current?.scrollToOffset({ offset: scrollOffsetRef.current, animated: false }))`
- [x] 2.5 When navigating to `MealDetail`, pass `meals={filtered}` and `initialIndex={index}` (the tapped item's index in the filtered array)

## 3. Meal Detail — Horizontal Pager

- [x] 3.1 Update `MealDetailRouteProp` to include `meals: Meal[]` and `initialIndex: number` from route params
- [x] 3.2 Add `currentIndex` state (initialized from `initialIndex`) and `meals` local const from params
- [x] 3.3 Add `pagerRef = useRef<FlatList>(null)` for the horizontal pager
- [x] 3.4 Wrap the existing detail content in a horizontal `FlatList` with `pagingEnabled`, `showsHorizontalScrollIndicator={false}`, and `scrollEnabled={!isEditing}` — render one page per meal in the `meals` array
- [x] 3.5 On `onMomentumScrollEnd`, compute new index from `e.nativeEvent.contentOffset.x / screenWidth` and update `currentIndex`
- [x] 3.6 Load ingredients for the current meal whenever `currentIndex` changes (replace the existing single-meal `useEffect` with one keyed to `meals[currentIndex].id`)
- [x] 3.7 Update all action handlers (log, archive, restore, delete, save) to operate on `meals[currentIndex]` rather than `initialMeal` directly
- [x] 3.8 Scroll the pager to `initialIndex` on mount using `pagerRef.current?.scrollToIndex({ index: initialIndex, animated: false })`

## 4. Verification

- [x] 4.1 Scroll catalog to a meal near the bottom, tap it, go back — catalog is at the same scroll position
- [x] 4.2 Search for a meal, tap it, go back — catalog is at the same position with search text intact
- [x] 4.3 From a meal mid-list, swipe left — next meal content loads correctly
- [x] 4.4 Swipe right from a non-first meal — previous meal content loads correctly
- [x] 4.5 At the first meal, swipe right — does nothing (pager does not over-scroll)
- [x] 4.6 At the last meal, swipe left — does nothing
- [x] 4.7 Tap Edit on a meal — swiping is disabled while in edit mode
- [x] 4.8 Swipe order matches the filtered search results, not the full unfiltered list
