## ADDED Requirements

### Requirement: Score and surface meal recommendations
The system SHALL score all active meals using ingredient availability and recency, and surface the top 2-3 results on the Home screen.

#### Scenario: Meals with matching ingredients score higher
- **WHEN** meal A has 3 of 4 ingredients in inventory and meal B has 1 of 4
- **THEN** meal A appears before meal B in recommendations

#### Scenario: Recently made meals score lower
- **WHEN** two meals have equal ingredient matches but meal A was made 2 days ago and meal B was made 14 days ago
- **THEN** meal B appears before meal A

#### Scenario: Out-of-stock items excluded from matching
- **WHEN** an inventory item has quantity level 0 (Out of stock)
- **THEN** that item is NOT counted as available for ingredient matching

#### Scenario: Empty state when no meals score above threshold
- **WHEN** no meals have a score above 50
- **THEN** Home screen shows an empty state with prompts to update inventory or add meals

### Requirement: Recommendations persist across tab switches
The system SHALL display the same recommendations when the user navigates away from the Home tab and returns, without re-fetching.

#### Scenario: Navigating away and back preserves recommendations
- **WHEN** recommendations are loaded and user switches to another tab then back
- **THEN** the same recommendations are shown without a loading spinner

### Requirement: Pull-to-refresh loads new recommendations
The system SHALL reload recommendations when the user pulls down on the Home screen.

#### Scenario: Swipe down triggers reload
- **WHEN** user pulls down on the Home screen
- **THEN** recommendations are re-fetched and updated
