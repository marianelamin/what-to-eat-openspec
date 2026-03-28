### Requirement: Swipe row tracks current settled position
The `SwipeableRow` component SHALL maintain a ref tracking its last settled position (0 = closed, 80 = open) so that subsequent gestures start relative to that position.

#### Scenario: Gesture on closed row starts from 0
- **WHEN** the row is closed (settled at x=0) and the user begins a rightward swipe
- **THEN** the row moves right proportionally from 0

#### Scenario: Gesture on open row starts from 80
- **WHEN** the row is open (settled at x=80) and the user begins a leftward swipe
- **THEN** the row moves left proportionally from 80 with no jump

### Requirement: Swipe row snaps on gesture termination
When FlatList's ScrollView steals a gesture from `SwipeableRow`, the row SHALL snap immediately to its closed position (x=0).

#### Scenario: FlatList steals gesture mid-swipe
- **WHEN** the user starts swiping a row and FlatList claims the gesture
- **THEN** the row animates to x=0 and `openRowId` is cleared

### Requirement: Left swipe closes an open row
An open row SHALL close when the user swipes left with sufficient velocity/distance.

#### Scenario: Left swipe past threshold closes row
- **WHEN** the row is open and the user swipes left past the close threshold
- **THEN** the row animates to x=0 and `openRowId` is cleared

#### Scenario: Short left swipe snaps back to open
- **WHEN** the row is open and the user swipes left but not past the threshold
- **THEN** the row springs back to x=80 (remains open)
