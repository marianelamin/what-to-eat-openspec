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

### Requirement: Recommendations refresh on Home tab focus
The system SHALL re-fetch recommendations silently whenever the user navigates to the Home tab. If recommendations are already loaded, the current results SHALL remain visible during the background re-fetch — no loading spinner is shown. The spinner is only shown on the very first load when no results exist yet.

#### Scenario: Navigating to Home after updating inventory refreshes recommendations
- **WHEN** the user updates inventory and then navigates to the Home tab
- **THEN** recommendations are re-fetched in the background and updated to reflect the new inventory without a loading spinner

#### Scenario: First load shows spinner
- **WHEN** the user opens the app and the Home tab has no recommendations yet
- **THEN** a loading spinner is shown until the first fetch completes

#### Scenario: Pull-to-refresh still works
- **WHEN** user pulls down on the Home screen
- **THEN** recommendations are re-fetched and updated (existing behavior preserved)

### Requirement: Pull-to-refresh loads new recommendations
The system SHALL reload recommendations when the user pulls down on the Home screen.

#### Scenario: Swipe down triggers reload
- **WHEN** user pulls down on the Home screen
- **THEN** recommendations are re-fetched and updated
