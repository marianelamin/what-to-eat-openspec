## ADDED Requirements

### Requirement: View meal detail
The system SHALL display a read-only detail screen for a meal showing its photo, name, ingredients, and notes.

#### Scenario: Meal with all fields
- **WHEN** the user opens a meal that has a photo, name, ingredients, and notes
- **THEN** the detail screen displays all fields: large photo at top, name as heading, ingredients list, and notes

#### Scenario: Meal with no photo
- **WHEN** the user opens a meal that has no photo
- **THEN** the detail screen shows a placeholder in place of the photo

#### Scenario: Meal with no ingredients
- **WHEN** the user opens a meal that has no ingredients
- **THEN** the ingredients section is hidden or shows an empty state

#### Scenario: Meal with no notes
- **WHEN** the user opens a meal that has no notes
- **THEN** the notes section is hidden or shows an empty state

### Requirement: Navigate back from meal detail
The system SHALL allow the user to navigate back to the catalog from the meal detail screen.

#### Scenario: Back navigation
- **WHEN** the user taps the back button on the meal detail screen
- **THEN** the system navigates back to the catalog grid
