### Requirement: Bulk add items via text
The system SHALL allow the user to enter a comma- or newline-separated list of item names and bulk-insert them as inventory items with no quantity required.

#### Scenario: Items added from comma-separated text
- **WHEN** user submits "chicken, eggs, broccoli" in the Quick Add input
- **THEN** three inventory items are created: "chicken", "eggs", "broccoli" with quantity null

#### Scenario: Items added from newline-separated text
- **WHEN** user submits "rice\nolive oil\ngarlic" in the Quick Add input
- **THEN** three inventory items are created with quantity null

#### Scenario: Empty or whitespace-only entries are ignored
- **WHEN** user submits "chicken,  , ,eggs"
- **THEN** only "chicken" and "eggs" are created; blank entries are skipped

### Requirement: Auto-categorize items by keyword
The system SHALL assign a category to each new item based on keyword matching of the item name. Items that match no keyword SHALL be assigned "Other".

#### Scenario: Known protein keyword matched
- **WHEN** item name contains "chicken" (case-insensitive)
- **THEN** item is assigned category "Protein"

#### Scenario: Unknown keyword defaults to Other
- **WHEN** item name is "sriracha"
- **THEN** item is assigned category "Other"

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

### Requirement: Edit individual inventory items
The system SHALL allow the user to edit an item's name and category via a modal. The modal SHALL NOT include level/quantity editing — level is changed via the inline badge tap interaction.

#### Scenario: User updates item name
- **WHEN** user taps the item row text area to open the edit modal, changes the name, and saves
- **THEN** item shows the updated name in the inventory list

#### Scenario: User changes category
- **WHEN** user taps the item row text area to open the edit modal, selects a different category chip, and saves
- **THEN** item moves to the newly selected category section

### Requirement: Delete inventory items
The system SHALL allow the user to delete an inventory item permanently.

#### Scenario: Item deleted
- **WHEN** user taps delete on an item and confirms
- **THEN** item is removed from the list and deleted from Supabase

### Requirement: Staleness warning
The system SHALL display a warning banner when the inventory has not been updated in more than 3 days, or when the inventory is empty.

#### Scenario: Banner shown when inventory is stale
- **WHEN** the most recent `updated_at` timestamp across all items is more than 3 days ago
- **THEN** a warning banner is displayed prompting the user to update their inventory

#### Scenario: Banner shown when inventory is empty
- **WHEN** user has no inventory items
- **THEN** the warning banner is displayed
