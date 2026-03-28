## ADDED Requirements

### Requirement: Swipe row closes on scroll
The inventory list SHALL close any open swipe row when the user begins scrolling the list.

#### Scenario: Scroll dismisses open row
- **WHEN** a swipe row is open (delete button visible)
- **THEN** starting a scroll gesture closes the row and returns it to its default position

### Requirement: Swipe row closes on section header tap
The inventory list SHALL close any open swipe row when the user taps a section header.

#### Scenario: Category header tap dismisses open row
- **WHEN** a swipe row is open (delete button visible)
- **THEN** tapping any category section header (e.g., "VEGETABLES") closes the row

#### Scenario: Meal Prep header tap dismisses open row
- **WHEN** a swipe row is open (delete button visible)
- **THEN** tapping the Meal Prep section header closes the row
