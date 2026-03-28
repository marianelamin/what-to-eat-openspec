## 1. Fix SwipeableRow PanResponder

- [x] 1.1 Add `currentX` ref (initialized to 0) and `startX` ref to `SwipeableRow` to track settled and gesture-start positions
- [x] 1.2 Add `onPanResponderGrant` handler that sets `startX.current = currentX.current`
- [x] 1.3 Update `onPanResponderMove` to apply `dx` relative to `startX`, clamp result to [0, 90], and handle both positive and negative dx
- [x] 1.4 Update `onPanResponderRelease` to use `startX.current + dx` for threshold decision; update `currentX.current` in spring callbacks
- [x] 1.5 Add `onPanResponderTerminate` that springs to x=0 and calls `onOpenRef.current(null)`; update `currentX.current` in callback
- [x] 1.6 Update the `isOpen` effect's spring callback to set `currentX.current = 0` when closing from parent signal

## 2. Fix Section Header Tap-to-Dismiss

- [x] 2.1 Replace `TouchableWithoutFeedback` + Paper `Text` pattern on category section headers with `TouchableOpacity` wrapping a `View` containing the `Text` (ensures touch events fire correctly); set `activeOpacity={1}` for no visual feedback
- [x] 2.2 Apply same fix to the Meal Prep section header in `ListHeaderComponent`

## 3. Verify Other Item Tap-to-Dismiss

- [x] 3.1 Confirm that `renderItemRow` name `TouchableOpacity` and badge `TouchableOpacity` both call `setOpenRowId(null)` before their actions (already in code — verify no regression)
