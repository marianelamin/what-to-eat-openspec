## ADDED Requirements

### Requirement: Log a meal from the catalog grid
The system SHALL allow the user to log a meal directly from the catalog grid card. This flow SHALL NOT show a confirmation dialog — the log is immediate. Inventory deduction rules are the same as all other log flows.

#### Scenario: Quick-log from catalog succeeds
- **WHEN** the user taps the quick-log button on a catalog card and the request succeeds
- **THEN** a meal_history row is inserted, meal's times_made increments by 1, last_made_at is set to now, and inventory is decremented per the deduction rules

#### Scenario: Quick-log failure does not corrupt state
- **WHEN** the quick-log request fails
- **THEN** no meal_history row is inserted and inventory is not modified
