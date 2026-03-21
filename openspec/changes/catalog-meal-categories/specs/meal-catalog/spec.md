## MODIFIED Requirements

### Requirement: Display meal catalog grid
The system SHALL display the authenticated user's meals in a photo-dominant grid layout on the Catalog tab, filtered by the currently selected meal type tab (Breakfast or All Day). Each grid item SHALL show the meal photo (or a placeholder if no photo) and the meal name.

#### Scenario: User has meals in active tab
- **WHEN** the user navigates to the Catalog tab with All Day selected
- **THEN** the system displays all their all-day meals in a 2-column photo grid sorted by most recently created

#### Scenario: User has no meals in active tab
- **WHEN** the user navigates to the Catalog tab and has no meals for the selected type
- **THEN** the system displays an empty state message prompting them to add a meal

#### Scenario: Meal photo loads
- **WHEN** a meal has a photo URL
- **THEN** the grid item displays the photo filling the card

#### Scenario: Meal has no photo
- **WHEN** a meal has no photo URL
- **THEN** the grid item displays a placeholder icon or background color
