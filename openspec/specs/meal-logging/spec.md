### Requirement: Log a chosen meal
The system SHALL log a meal to history and update meal stats when the user confirms "Choose This Meal".

#### Scenario: Meal logged successfully
- **WHEN** user confirms "Choose This Meal" on a recommendation card
- **THEN** a meal_history row is inserted, meal's times_made increments by 1, and last_made_at is set to now

#### Scenario: Recommendations refresh after logging
- **WHEN** a meal is successfully logged
- **THEN** the Home screen reloads recommendations reflecting updated recency

### Requirement: Deduct inventory levels on meal log
The system SHALL decrement the quantity level of matched inventory items by 1 when a meal is logged.

#### Scenario: Matched inventory item decremented
- **WHEN** a meal with ingredient "chicken" is logged and inventory has "chicken" at level 5 (Stocked)
- **THEN** "chicken" inventory quantity becomes 4 (Some)

#### Scenario: Item at level 0 stays at 0
- **WHEN** a meal ingredient matches an inventory item already at level 0
- **THEN** the item remains at 0 (Out of stock) and is not decremented further

#### Scenario: Non-numeric quantity defaulted before decrement
- **WHEN** a matched inventory item has a free-text quantity (e.g. "2 lbs")
- **THEN** quantity is treated as level 4 and decremented to 3

#### Scenario: Deduction failure does not block logging
- **WHEN** inventory deduction fails for any reason
- **THEN** the meal log still succeeds and no error is shown to the user

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

### Requirement: Log a meal from the catalog grid
The system SHALL allow the user to log a meal directly from the catalog grid card. This flow SHALL NOT show a confirmation dialog — the log is immediate. Inventory deduction rules are the same as all other log flows.

#### Scenario: Quick-log from catalog succeeds
- **WHEN** the user taps the quick-log button on a catalog card and the request succeeds
- **THEN** a meal_history row is inserted, meal's times_made increments by 1, last_made_at is set to now, and inventory is decremented per the deduction rules

#### Scenario: Quick-log failure does not corrupt state
- **WHEN** the quick-log request fails
- **THEN** no meal_history row is inserted and inventory is not modified
