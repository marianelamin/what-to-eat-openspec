## ADDED Requirements

### Requirement: Display meal catalog grid
The system SHALL display the authenticated user's meals in a photo-dominant grid layout on the Catalog tab, filtered by the currently selected meal type chip (Breakfast or All Day). Each grid item SHALL show the meal photo (or a placeholder if no photo) and the meal name.

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

### Requirement: Quick-log a meal from the catalog grid
The system SHALL allow the user to log an active meal directly from the catalog grid without opening the detail screen. Each active meal card SHALL display a quick-log button. Archived meal cards SHALL NOT show the quick-log button.

#### Scenario: Tap quick-log on an active meal
- **WHEN** the user taps the quick-log button on an active meal card in the catalog grid
- **THEN** the meal is logged immediately (no confirmation dialog), the catalog refreshes, and a brief success indicator is shown on the card

#### Scenario: Quick-log shows loading state
- **WHEN** the quick-log button is tapped and the log request is in progress
- **THEN** the button shows a loading indicator and cannot be tapped again until the request completes

#### Scenario: Quick-log fails
- **WHEN** the quick-log request fails
- **THEN** an error message is shown and the card returns to its normal state

#### Scenario: Archived meal has no quick-log button
- **WHEN** a meal is archived and appears in the catalog grid
- **THEN** the quick-log button is not shown on that card
