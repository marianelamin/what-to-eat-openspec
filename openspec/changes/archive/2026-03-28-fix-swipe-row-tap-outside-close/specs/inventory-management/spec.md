## ADDED Requirements

### Requirement: Only one swipe row open at a time, dismissed by outside interaction
The inventory list SHALL ensure that any open swipe row is dismissed when the user interacts outside of it — specifically when scrolling the list or tapping a section header.

#### Scenario: Scrolling closes open row
- **WHEN** a swipe row is open
- **THEN** beginning a scroll gesture on the inventory list closes the row

#### Scenario: Section header tap closes open row
- **WHEN** a swipe row is open
- **THEN** tapping a section header closes the row
