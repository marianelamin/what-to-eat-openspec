## ADDED Requirements

### Requirement: View meal detail
The system SHALL display a meal detail screen for a meal showing its photo, name, ingredients, and notes. Active meals SHALL show Choose This Meal, Edit, and Archive actions. Archived meals SHALL show Restore and Delete Permanently actions instead.

#### Scenario: Active meal with all fields
- **WHEN** the user opens an active meal that has a photo, name, ingredients, and notes
- **THEN** the detail screen displays all fields: large photo at top, name as heading, ingredients list, notes, and action buttons (Choose This Meal, Edit, Archive)

#### Scenario: Archived meal detail
- **WHEN** the user opens an archived meal from the catalog
- **THEN** the detail screen shows the meal's content with an "Archived" indicator and action buttons (Restore, Delete Permanently); Choose This Meal and Edit are not shown

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
The system SHALL allow the user to navigate back to the catalog from the meal detail screen. The catalog SHALL restore its scroll position to where it was before the user tapped into the detail view.

#### Scenario: Back navigation restores catalog scroll
- **WHEN** the user taps the back button on the meal detail screen
- **THEN** the system navigates back to the catalog grid, which is scrolled to the position it was at before the user opened the meal
