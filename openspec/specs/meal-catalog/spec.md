## ADDED Requirements

### Requirement: Display meal catalog grid
The system SHALL display all of the authenticated user's meals in a photo-dominant grid layout on the Catalog tab. Each grid item SHALL show the meal photo (or a placeholder if no photo) and the meal name.

#### Scenario: User has meals
- **WHEN** the user navigates to the Catalog tab
- **THEN** the system displays all their meals in a 2-column photo grid sorted by most recently created

#### Scenario: User has no meals
- **WHEN** the user navigates to the Catalog tab and has no meals
- **THEN** the system displays an empty state message prompting them to add their first meal

#### Scenario: Meal photo loads
- **WHEN** a meal has a photo URL
- **THEN** the grid item displays the photo filling the card

#### Scenario: Meal has no photo
- **WHEN** a meal has no photo URL
- **THEN** the grid item displays a placeholder icon or background color

### Requirement: Search meals by name
The system SHALL provide a search input that filters the displayed meal grid client-side by meal name.

#### Scenario: User types a search query
- **WHEN** the user types text in the search input
- **THEN** the grid immediately updates to show only meals whose names contain the search text (case-insensitive)

#### Scenario: No results
- **WHEN** the search query matches no meal names
- **THEN** the grid shows an empty state message indicating no results found

#### Scenario: Clear search
- **WHEN** the user clears the search input
- **THEN** all meals are shown again

### Requirement: Navigate to meal detail from catalog
The system SHALL allow the user to tap a meal in the catalog grid to open the meal detail screen. The catalog SHALL pass the full filtered meal list and the tapped meal's index to the detail screen to enable gallery navigation.

#### Scenario: Tap a meal
- **WHEN** the user taps a meal card in the catalog grid
- **THEN** the system navigates to the meal detail screen for that meal, passing the current filtered meal list and the tapped meal's position within that list

### Requirement: Access Add Meal from catalog
The system SHALL provide a floating action button (FAB) on the catalog screen to open the Add Meal form.

#### Scenario: Tap FAB
- **WHEN** the user taps the FAB on the catalog screen
- **THEN** the system navigates to the Add Meal screen
