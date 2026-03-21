## MODIFIED Requirements

### Requirement: Bulk add items via text
The system SHALL allow the user to enter a comma- or newline-separated list of item names and bulk-insert them as inventory items with no quantity required. Before inserting, each name SHALL be checked against existing inventory items for near-duplicate matches. Near-duplicate names SHALL NOT be inserted; instead, the matching existing item SHALL be set to Stocked (quantity '6'). After the operation, the system SHALL report how many items were restocked if any were.

#### Scenario: Items added from comma-separated text
- **WHEN** user submits "chicken, eggs, broccoli" in the Quick Add input and none of those names exist
- **THEN** three inventory items are created: "chicken", "eggs", "broccoli" with quantity null

#### Scenario: Items added from newline-separated text
- **WHEN** user submits "rice\nolive oil\ngarlic" in the Quick Add input and none of those names exist
- **THEN** three inventory items are created with quantity stocked

#### Scenario: Empty or whitespace-only entries are ignored
- **WHEN** user submits "chicken,  , ,eggs"
- **THEN** only "chicken" and "eggs" are considered; blank entries are skipped

#### Scenario: Near-duplicate names restock existing item
- **WHEN** user submits "Chicken, broccoli" and "chicken" already exists in inventory
- **THEN** only "broccoli" is inserted; the existing "chicken" item is set to Stocked; user sees "1 item(s) already in inventory — marked as stocked"
