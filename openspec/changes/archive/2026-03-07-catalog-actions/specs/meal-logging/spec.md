## ADDED Requirements

### Requirement: Log a meal from the Meal Detail screen
The system SHALL allow the user to trigger "Choose This Meal" from the Meal Detail screen, following the same confirmation and logging flow as the Home screen.

#### Scenario: Choose from detail screen prompts confirmation
- **WHEN** the user taps "Choose This Meal" on the Meal Detail screen
- **THEN** a confirmation alert is shown (same as on the Home screen)

#### Scenario: Confirm logs the meal
- **WHEN** the user confirms on the Meal Detail screen
- **THEN** a meal_history row is inserted, times_made increments by 1, last_made_at is set to now, and inventory is decremented per the deduction rules

#### Scenario: Post-log navigation
- **WHEN** logging succeeds from the Meal Detail screen
- **THEN** the user is navigated back to the catalog and the Home screen recommendations will refresh on next view
