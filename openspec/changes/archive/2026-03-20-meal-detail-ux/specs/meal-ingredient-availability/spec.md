## ADDED Requirements

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
