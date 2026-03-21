## ADDED Requirements

### Requirement: Filter catalog by meal type via segmented control
The system SHALL display a segmented control above the search bar on the Catalog screen with two options: **Breakfast** and **All Day**. The catalog grid SHALL show only meals matching the selected meal type. The default selected tab SHALL be **All Day**.

#### Scenario: All Day tab shows non-breakfast meals
- **WHEN** the user opens the Catalog screen
- **THEN** the All Day tab is selected and the grid shows only meals with meal_type = 'all_day'

#### Scenario: Breakfast tab shows breakfast meals
- **WHEN** the user taps the Breakfast tab
- **THEN** the grid updates to show only meals with meal_type = 'breakfast'

#### Scenario: Empty state when no meals in selected type
- **WHEN** the user selects Breakfast and no meals are classified as breakfast
- **THEN** the grid shows an empty state message prompting the user to add a breakfast meal

#### Scenario: Search scoped to active tab
- **WHEN** the user is on the Breakfast tab and types a search query
- **THEN** only breakfast meals matching the query are shown

#### Scenario: Tab selection resets search
- **WHEN** the user types a search query, then switches tabs
- **THEN** the search input clears and all meals of the newly selected type are shown
