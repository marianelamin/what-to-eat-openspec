## MODIFIED Requirements

### Requirement: Navigate to meal detail from catalog
The system SHALL allow the user to tap a meal in the catalog grid to open the meal detail screen. The catalog SHALL pass the full filtered meal list and the tapped meal's index to the detail screen to enable gallery navigation.

#### Scenario: Tap a meal
- **WHEN** the user taps a meal card in the catalog grid
- **THEN** the system navigates to the meal detail screen for that meal, passing the current filtered meal list and the tapped meal's position within that list
