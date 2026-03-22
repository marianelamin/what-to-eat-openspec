## ADDED Requirements

### Requirement: Meal prep section in inventory
The system SHALL display a "Meal Prep" section in the inventory screen, separate from the category-grouped ingredient inventory. Meal prep items represent prepared or cooked foods (e.g., ground beef, shredded chicken, black beans) that are ready to use. The section SHALL appear above the ingredient categories.

#### Scenario: Meal prep section shown when items exist
- **WHEN** at least one inventory item has `item_kind = 'meal_prep'`
- **THEN** a "MEAL PREP" section header appears at the top of the inventory list with those items

#### Scenario: Meal prep section hidden when empty
- **WHEN** no inventory items have `item_kind = 'meal_prep'`
- **THEN** no "MEAL PREP" section header is shown

### Requirement: Add meal prep items via Quick Add
The system SHALL allow the user to add meal prep items through the Quick Add modal. The modal SHALL include a two-chip toggle (Ingredients / Meal Prep) to select which kind of items are being added. All items in a single Quick Add batch SHALL be the same kind. The default SHALL be "Ingredients".

#### Scenario: Quick Add defaults to Ingredients
- **WHEN** user opens the Quick Add modal
- **THEN** the "Ingredients" chip is selected by default

#### Scenario: Switching to Meal Prep adds items as meal_prep kind
- **WHEN** user selects the "Meal Prep" chip and submits "ground beef, black beans"
- **THEN** two inventory items are created with `item_kind = 'meal_prep'` and appear in the Meal Prep section

### Requirement: Meal prep items support same interactions as ingredients
Meal prep items SHALL support the same tap-to-edit, swipe-to-delete, and level-cycling interactions as ingredient items.

#### Scenario: Level cycling works on meal prep items
- **WHEN** user taps the level icon on a meal prep item
- **THEN** the level cycles in the same order as for ingredients (Stocked → Some → Low → Out of stock → Stocked)

#### Scenario: Swipe-to-delete works on meal prep items
- **WHEN** user swipes a meal prep item row to the right
- **THEN** the Delete button is revealed and tapping it removes the item

#### Scenario: Edit modal works on meal prep items
- **WHEN** user taps the name area of a meal prep item
- **THEN** the edit modal opens with the item's current name and category

### Requirement: Meal prep items count toward ingredient availability
Meal prep items SHALL be included in the ingredient availability check on the meal detail screen. A meal ingredient whose name fuzzy-matches a meal prep inventory item with quantity > 0 SHALL be shown as available ("have"), the same as a matching ingredient item.

#### Scenario: Prepared food satisfies a meal ingredient
- **WHEN** a meal lists "ground beef" as an ingredient and a meal prep inventory item named "ground beef" has quantity > 0
- **THEN** "ground beef" is shown with a "have" indicator on the meal detail screen

#### Scenario: Depleted meal prep item does not satisfy ingredient
- **WHEN** a meal prep inventory item named "shredded chicken" has quantity 0
- **THEN** "shredded chicken" is shown with a "missing" indicator on the meal detail screen

### Requirement: Meal prep items count toward recommendation scoring
Meal prep items SHALL be included when the recommendation engine scores meals by ingredient availability. A meal ingredient that fuzzy-matches a meal prep inventory item with quantity > 0 SHALL count as available, boosting that meal's score the same way a matching ingredient item would.

#### Scenario: Prepared ingredient boosts meal score
- **WHEN** a meal lists "black beans" as an ingredient and a meal prep inventory item named "black beans" has quantity > 0
- **THEN** "black beans" counts as an available ingredient when scoring that meal's recommendation

#### Scenario: Depleted meal prep item does not boost score
- **WHEN** a meal prep inventory item named "ground beef" has quantity 0
- **THEN** "ground beef" is NOT counted as available when scoring recommendations
