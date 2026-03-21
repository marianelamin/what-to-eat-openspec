## 1. Level Badge — Inline Tap Interaction

- [x] 1.1 Define the cycle sequence constant: `[{label:'Stocked',value:'6'}, {label:'Some',value:'4'}, {label:'Low',value:'2'}, {label:'Out of stock',value:'0'}]` and a `nextLevel(current)` helper that wraps around
- [x] 1.2 Make the level badge in each inventory item row a `TouchableOpacity` (currently it is just a `Text`/`View`)
- [x] 1.3 On badge tap: compute next level, optimistically update local state for the item, then call `updateItem(id, { quantity: nextValue })`
- [x] 1.4 On save failure: revert the item's quantity in local state to the previous value and show a brief error snackbar/Alert

## 2. Visual Confirmation Pulse

- [x] 2.1 Add an `Animated.Value` (opacity) per item row (or a single shared one keyed to the tapped item id)
- [x] 2.2 On badge tap, run `Animated.sequence([Animated.timing(opacity, {toValue:0.4, duration:80}), Animated.timing(opacity, {toValue:1, duration:120})])` to pulse the badge

## 3. Edit Modal — Remove Level Chips

- [x] 3.1 Remove the LEVELS chip row from the edit modal in `InventoryScreen`
- [x] 3.2 Ensure the edit modal Save still only updates name and category (quantity field should not be included in the modal's save call)
- [x] 3.3 Update the item row tap target so tapping the text/name area opens the modal, while tapping the badge area triggers the cycle (ensure the two touch areas don't overlap)

## 4. Verification

- [x] 4.1 Tapping a badge cycles the level correctly through all 4 states including wrap-around
- [x] 4.2 Level change is persisted to Supabase (reload the screen and confirm the level stuck)
- [x] 4.3 Edit modal no longer shows level chips; name and category still save correctly
- [x] 4.4 Badge pulse animation plays on each tap
- [x] 4.5 Recommendations reflect updated levels after cycling (items at level 0 excluded from inventory match)
