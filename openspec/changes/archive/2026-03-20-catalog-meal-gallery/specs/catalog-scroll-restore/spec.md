## ADDED Requirements

### Requirement: Preserve catalog scroll position across meal detail navigation
The system SHALL restore the catalog grid scroll position to where it was when the user tapped into a meal, after they return from the meal detail screen.

#### Scenario: Return from meal detail restores position
- **WHEN** the user scrolls down in the catalog, taps a meal to open the detail screen, and then navigates back
- **THEN** the catalog grid is scrolled to the same vertical position it was at before the user tapped the meal

#### Scenario: Position preserved after editing a meal
- **WHEN** the user opens a meal, edits and saves it, then navigates back to the catalog
- **THEN** the catalog grid restores to the pre-navigation scroll position

#### Scenario: Position preserved after logging a meal
- **WHEN** the user opens a meal, taps "Choose This Meal", and the catalog regains focus
- **THEN** the catalog grid restores to the pre-navigation scroll position

#### Scenario: First load always starts at top
- **WHEN** the user opens the app and navigates to the Catalog tab for the first time
- **THEN** the catalog grid starts at the top (scroll offset 0)
