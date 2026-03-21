### Requirement: Filter catalog by meal type via scrollable chip row
The system SHALL display a single header row on the Catalog screen combining a horizontally scrollable chip list (meal type filters) on the left and a compact search field on the right. The chip order SHALL be: **Breakfast** first (leftmost), then **All Day**. The default selected chip SHALL be **All Day**. The catalog grid SHALL show only meals matching the selected meal type.

#### Scenario: All Day chip selected by default
- **WHEN** the user opens the Catalog screen
- **THEN** the All Day chip is selected and the grid shows only meals with meal_type = 'all_day'

#### Scenario: Breakfast chip shows breakfast meals
- **WHEN** the user taps the Breakfast chip
- **THEN** the grid updates to show only meals with meal_type = 'breakfast'

#### Scenario: Empty state when no meals in selected type
- **WHEN** the user selects a chip and no meals exist for that type
- **THEN** the grid shows an empty state message prompting the user to add a meal

#### Scenario: Search scoped to active chip
- **WHEN** the user is on the Breakfast chip and types a search query
- **THEN** only breakfast meals matching the query are shown

#### Scenario: Chip selection resets search
- **WHEN** the user types a search query, then taps a different chip
- **THEN** the search input clears and all meals of the newly selected type are shown

### Requirement: Search bar expands to full row on focus
The system SHALL expand the search bar to occupy the full header row width when the user focuses it, hiding the meal type chips. When the search bar loses focus (blur), the chips SHALL reappear and the search bar SHALL return to its compact form. The search query SHALL be preserved on blur.

#### Scenario: Search expands on focus
- **WHEN** the user taps the search field
- **THEN** the meal type chips disappear and the search bar expands to fill the full row width

#### Scenario: Search collapses on blur
- **WHEN** the user dismisses the keyboard or taps outside the search field
- **THEN** the meal type chips reappear and the search bar returns to its compact form

#### Scenario: Search query preserved on blur
- **WHEN** the user types a query, then dismisses the keyboard
- **THEN** the filtered results remain visible with the chips restored alongside the compact search showing the active query
