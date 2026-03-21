## MODIFIED Requirements

### Requirement: Edit individual inventory items
The system SHALL allow the user to edit an item's name and category via a modal. The modal SHALL NOT include level/quantity editing — level is changed via the inline badge tap interaction.

#### Scenario: User updates item name
- **WHEN** user taps the item row text area to open the edit modal, changes the name, and saves
- **THEN** item shows the updated name in the inventory list

#### Scenario: User changes category
- **WHEN** user taps the item row text area to open the edit modal, selects a different category chip, and saves
- **THEN** item moves to the newly selected category section

## REMOVED Requirements

### Requirement: Edit item quantity via level chips
**Reason**: Replaced by the inline badge tap interaction (inventory-level-cycling). Level is now changed directly on the list row without opening a modal.
**Migration**: Tap the level badge on any inventory item row to cycle through Stocked / Some / Low / Out of stock levels. The edit modal no longer contains level chips.
