## Context

The `InventoryScreen` uses a custom `SwipeableRow` component backed by `PanResponder` and an `openRowId` state variable. When a row is swiped open, sibling rows close automatically (handled via `isOpen` prop). However, tapping on section headers or scrolling the list leaves the open row in its swiped state. Most in-row tap targets (item name, battery icon) already call `setOpenRowId(null)`, leaving section headers and scroll as the only gaps.

## Goals / Non-Goals

**Goals:**
- Close the open swipe row when the user starts scrolling the inventory list
- Close the open swipe row when the user taps any section header (category or Meal Prep)

**Non-Goals:**
- Overlay-based dismiss (not needed — existing tap targets cover in-row and cross-row cases)
- Changes to the `SwipeableRow` component itself
- Any changes outside `InventoryScreen.tsx`

## Decisions

**`onScrollBeginDrag` over a transparent overlay**
A full-screen overlay would require z-index coordination with the absolutely positioned delete button. `onScrollBeginDrag` on the `FlatList` is simpler, zero-risk, and covers the scroll case completely.

**`TouchableWithoutFeedback` on section headers**
Section headers are display-only `Text` components. Wrapping them in `TouchableWithoutFeedback` adds tap dismissal with no visual side-effect — appropriate for a passive label that gains a secondary dismiss behavior.

## Risks / Trade-offs

- `TouchableWithoutFeedback` slightly increases the tap target size of section headers — acceptable since it aids usability and has no visual change.
- Tapping in empty FlatList whitespace (rare, between sections) still won't dismiss — acceptable edge case given the list is typically dense.
