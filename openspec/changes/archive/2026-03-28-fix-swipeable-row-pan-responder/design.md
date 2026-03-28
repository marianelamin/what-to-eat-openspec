## Context

`SwipeableRow` uses a React Native `PanResponder` created once via `useRef`. The current implementation has three gaps in its gesture state machine:

1. **No `onPanResponderTerminate`**: FlatList's ScrollView can steal a gesture mid-swipe. When this happens, neither `onPanResponderRelease` nor any cleanup fires — `translateX` is left frozen mid-animation and `openRowId` is never updated.

2. **No starting offset tracking**: `onPanResponderMove` always treats `dx` as relative to 0, but when a row is already open (`translateX = 80`), a new gesture's `dx` starts from 0. Touching an open row and moving 10px right produces `translateX = 10`, causing a visible jump backward.

3. **Right-only swipe**: `onPanResponderMove` guards with `if (dx > 0)`, so left swipes on an open row are silently dropped. The user cannot close a row by swiping left.

## Goals / Non-Goals

**Goals:**
- Rows always snap to a settled position (0 or 80) — no stuck mid-swipe state
- Gestures on an already-open row feel natural (relative to current position)
- Left swipe on an open row closes it
- No new dependencies

**Non-Goals:**
- Replacing PanResponder with `react-native-gesture-handler` (not installed, would require dev build)
- Changing the visual design or swipe threshold
- Fixing the "tap outside to close" behavior (separate concern, separate change)

## Decisions

**Track settled position in a `currentX` ref**
After each spring animation completes (callback), update `currentX.current` to 0 or 80. Capture this value in `onPanResponderGrant` as `startX.current`. All subsequent `onPanResponderMove` deltas are applied relative to `startX`.

This avoids `translateX.__getValue()` (private API) and is reliable because the only settled states are exactly 0 and 80.

**`onPanResponderTerminate` snaps to nearest settled state**
On termination, snap to 0 or 80 based on current `startX` + any accumulated `dx`. Since the gesture was stolen, we don't have a reliable final `dx` — use `startX` as the best approximation of where the row was heading and snap accordingly. Simpler: always snap to 0 on terminate (close the row). This is the safest UX — unexpected gesture steals should result in a closed, stable state.

**Allow termination requests**
`onPanResponderTerminationRequest` returns `true` (default). This lets the ScrollView reclaim vertical scrolls. The terminate handler ensures the row recovers cleanly.

## Risks / Trade-offs

- [Terminate always closes] If a row is at `x=80` and a vertical scroll steals the gesture, the row closes. This is acceptable — the user will just re-swipe. Better than a stuck row.
- [startX approximation on terminate] We don't have the final dx on terminate, so the snap decision uses `startX`. If the user had dragged significantly before the steal, the visual snap might feel abrupt. Mitigation: this is rare and the result (a closed row) is always correct.
