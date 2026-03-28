## ADDED Requirements

### Requirement: Open swipe row closes on section header tap
The inventory list SHALL close any open swipe row when the user taps a section header (category or Meal Prep). The section header tap target SHALL use a proper `View` wrapper to ensure touch events are captured correctly.

#### Scenario: Category header tap closes open row
- **WHEN** a swipe row is open
- **THEN** tapping any category section header (e.g., "VEGETABLES") closes the row

#### Scenario: Meal Prep header tap closes open row
- **WHEN** a swipe row is open
- **THEN** tapping the Meal Prep section header closes the row

### Requirement: Open swipe row closes on other item tap
The inventory list SHALL close any open swipe row when the user taps any other inventory item's name or level badge.

#### Scenario: Other item name tap closes open row
- **WHEN** a swipe row is open
- **THEN** tapping the name of any other inventory item closes the open row (and opens the edit modal for the tapped item)

#### Scenario: Other item badge tap closes open row
- **WHEN** a swipe row is open
- **THEN** tapping the level badge of any other inventory item closes the open row (and cycles that item's level)
