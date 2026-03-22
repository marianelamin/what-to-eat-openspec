## ADDED Requirements

### Requirement: Pull-to-refresh updates ingredient availability on meal detail
The system SHALL allow the user to pull down on the meal detail screen to re-fetch both the meal data and the current inventory. After the refresh, ingredient availability indicators SHALL reflect the latest inventory state.

#### Scenario: Pull-to-refresh updates a previously missing ingredient
- **WHEN** an ingredient shows as "missing" and the user updates inventory then pulls to refresh on the meal detail screen
- **THEN** the ingredient now shows as "have"

#### Scenario: Refresh spinner shown during re-fetch
- **WHEN** user pulls down to refresh
- **THEN** a refresh spinner is shown until both the meal data and inventory have been re-fetched

#### Scenario: Refresh with no inventory changes
- **WHEN** user pulls to refresh and inventory has not changed
- **THEN** availability indicators remain the same after refresh completes
