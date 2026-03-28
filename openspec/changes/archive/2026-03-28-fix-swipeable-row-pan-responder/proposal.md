## Why

The custom `SwipeableRow` PanResponder in `InventoryScreen` has three bugs that cause visually broken behavior: rows get stuck open when FlatList steals the gesture, swiping on an already-open row causes a jarring jump, and left-swiping an open row does nothing. Together these make the swipe-to-delete interaction feel unreliable and glitchy.

## What Changes

- Add `onPanResponderGrant` to capture the row's position at the start of each gesture
- Add `onPanResponderTerminate` to snap the row to a settled state when FlatList steals the gesture
- Make `onPanResponderMove` relative to the starting position (not always from 0)
- Extend `onPanResponderMove` to handle left swipes (dx < 0) so open rows can be closed by swiping left
- Track settled position in a `currentX` ref updated after each spring animation completes
- Fix section headers so tapping them closes the open row (replace `TouchableWithoutFeedback` + Paper `Text` with a proper `View` wrapper)
- Confirm that tapping any other inventory item row already calls `setOpenRowId(null)` (existing behavior, verify only)

## Capabilities

### New Capabilities
- `inventory-swipe-row-gesture`: Correct gesture state machine for the swipeable delete row

### Modified Capabilities
- `inventory-management`: Swipe row behavior requirements are changing (terminate handling, bidirectional swipe, relative-offset movement, dismiss on section header tap)

## Impact

- `src/screens/InventoryScreen.tsx` — `SwipeableRow` component only
