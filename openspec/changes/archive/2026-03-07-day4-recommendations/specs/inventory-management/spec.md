## MODIFIED Requirements

### Requirement: Display inventory grouped by category
The system SHALL display all inventory items in a scrollable list grouped by category, with a count per category. Each item row SHALL show the item's qualitative level label (Stocked / Some / Low / Out of stock) derived from its numeric quantity.

#### Scenario: Items grouped under category headers
- **WHEN** inventory contains "chicken" (Protein) and "broccoli" (Vegetables)
- **THEN** screen shows "Protein (1)" section with chicken, and "Vegetables (1)" section with broccoli

#### Scenario: Empty state shown when no items
- **WHEN** user has no inventory items
- **THEN** screen shows an empty state message prompting the user to add items

#### Scenario: Level label shown for numeric quantity
- **WHEN** an item has quantity "5"
- **THEN** the item row shows "Stocked" as the quantity label

#### Scenario: Level label shown for zero quantity
- **WHEN** an item has quantity "0"
- **THEN** the item row shows "Out of stock"

## ADDED Requirements

### Requirement: Edit item quantity via level chips
The system SHALL allow the user to set an item's quantity level by tapping a chip in the edit modal (Stocked / Some / Low / Out of stock), in addition to the existing free-text quantity input.

#### Scenario: Tapping level chip sets numeric quantity
- **WHEN** user taps "Stocked" chip in the edit modal and saves
- **THEN** item quantity is set to "6"

#### Scenario: Tapping "Out of stock" chip
- **WHEN** user taps "Out of stock" chip and saves
- **THEN** item quantity is set to "0" and item is excluded from recommendations
