### Requirement: Show ingredient availability status in meal detail
The system SHALL display each ingredient in the meal detail screen with a visual indicator showing whether the ingredient is available in the user's inventory ("have") or not available ("missing"). An ingredient is considered available if it matches an inventory item with quantity greater than 0.

#### Scenario: Ingredient found in inventory at non-zero level
- **WHEN** the user opens a meal detail and an ingredient name fuzzy-matches an inventory item with quantity > 0
- **THEN** that ingredient is shown with a "have" indicator (e.g. green label or checkmark)

#### Scenario: Ingredient not found in inventory
- **WHEN** the user opens a meal detail and an ingredient name does not match any inventory item
- **THEN** that ingredient is shown with a "missing" indicator (e.g. muted color or dash)

#### Scenario: Ingredient found but out of stock
- **WHEN** the user opens a meal detail and an ingredient matches an inventory item with quantity 0
- **THEN** that ingredient is shown with a "missing" indicator

#### Scenario: No inventory items
- **WHEN** the user has no inventory items
- **THEN** all ingredients are shown with "missing" indicators

#### Scenario: Meal has no ingredients
- **WHEN** the meal has no ingredients listed
- **THEN** no availability indicators are shown (the ingredients section is hidden as before)

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
