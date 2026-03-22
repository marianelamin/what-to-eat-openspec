## MODIFIED Requirements

### Requirement: Delete inventory items
The system SHALL allow the user to delete an inventory item permanently by swiping the item row to the right to reveal a "Delete" button. Tapping the "Delete" button SHALL remove the item immediately with no confirmation dialog. The item SHALL be removed from the local list optimistically, and restored if the delete fails. There is no inline delete button — deletion is only accessible via the swipe gesture.

Only one row may have the delete button revealed at a time. Opening a new row SHALL auto-close any previously open row. Tapping anywhere on the row content while the delete button is revealed SHALL close that row without deleting the item.

#### Scenario: Swipe right reveals delete button
- **WHEN** user swipes an item row to the right
- **THEN** a red "Delete" button is revealed behind the row on the left side

#### Scenario: Tapping delete removes item immediately
- **WHEN** user taps the revealed "Delete" button
- **THEN** item is removed from the list immediately (optimistic) and deleted from Supabase in the background — no confirmation dialog is shown

#### Scenario: Swiping back closes the delete button
- **WHEN** user swipes the row back to the left
- **THEN** the Delete button is hidden and the row returns to its default position

#### Scenario: Tapping row content closes the delete button
- **WHEN** the delete button is revealed and user taps anywhere on the row content (not the Delete button)
- **THEN** the row closes back to its default position and no delete occurs

#### Scenario: Opening one row closes the previously open row
- **WHEN** row A has the delete button revealed and user swipes row B to the right
- **THEN** row A closes and row B reveals its delete button

#### Scenario: Delete failure reverts item
- **WHEN** the Supabase delete call fails after an optimistic removal
- **THEN** the item is restored to its original position in the list and an error message is shown
