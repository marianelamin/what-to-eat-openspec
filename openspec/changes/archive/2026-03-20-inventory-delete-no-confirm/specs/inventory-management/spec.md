## MODIFIED Requirements

### Requirement: Delete inventory items
The system SHALL allow the user to delete an inventory item permanently. Deletion SHALL execute immediately upon tap — no confirmation dialog is shown. The item SHALL be removed from the local list optimistically, and restored if the delete fails.

#### Scenario: Item deleted immediately on tap
- **WHEN** user taps delete on an item
- **THEN** item is removed from the list immediately (optimistic) and deleted from Supabase in the background — no confirmation dialog is shown

#### Scenario: Delete failure reverts item
- **WHEN** the Supabase delete call fails after an optimistic removal
- **THEN** the item is restored to its original position in the list and an error message is shown
