### Requirement: Detect near-duplicate inventory items and restock on add
The system SHALL check each new item name against existing inventory items before inserting. A name SHALL be considered a near-duplicate if it matches any existing item name by: exact match after case normalization, is a plural/singular variant (differs only by trailing "s" or "es"), or has a Levenshtein edit distance of 1 or less (for names 4 characters or longer). When a near-duplicate is detected, the new name SHALL NOT be inserted; instead, the matching existing item's quantity SHALL be set to '6' (Stocked).

#### Scenario: Exact duplicate restocks existing item (case difference)
- **WHEN** the user submits "Chicken" in Quick Add and "chicken" already exists in inventory
- **THEN** "Chicken" is not inserted; the existing "chicken" item's quantity is set to '6' (Stocked)

#### Scenario: Plural variant restocks existing item
- **WHEN** the user submits "eggs" in Quick Add and "egg" already exists in inventory
- **THEN** "eggs" is not inserted; the existing "egg" item's quantity is set to '6' (Stocked)

#### Scenario: Singular variant restocks existing item
- **WHEN** the user submits "carrot" in Quick Add and "carrots" already exists in inventory
- **THEN** "carrot" is not inserted; the existing "carrots" item's quantity is set to '6' (Stocked)

#### Scenario: Typo variant restocks existing item (1-character difference)
- **WHEN** the user submits "chiken" in Quick Add and "chicken" already exists in inventory
- **THEN** "chiken" is not inserted; the existing "chicken" item's quantity is set to '6' (Stocked)

#### Scenario: Non-duplicate inserted normally
- **WHEN** the user submits "rice" in Quick Add and no similar item exists in inventory
- **THEN** "rice" is inserted as a new inventory item

#### Scenario: Short names only exact-matched
- **WHEN** the user submits "ham" in Quick Add and "yam" already exists in inventory
- **THEN** "ham" is inserted as a new item (edit distance 1 is only applied to names 4+ characters long)

### Requirement: Report restocked items after Quick Add
The system SHALL inform the user how many items were matched as near-duplicates and marked as Stocked after a Quick Add operation completes. The notification SHALL appear only when at least one item was restocked.

#### Scenario: Restocked count shown
- **WHEN** user submits 5 items via Quick Add and 2 are near-duplicates of existing items
- **THEN** 3 items are inserted, 2 existing items are set to Stocked, and a message reads "2 item(s) already in inventory — marked as stocked"

#### Scenario: No message shown when nothing restocked
- **WHEN** user submits 3 items via Quick Add and none are near-duplicates
- **THEN** all 3 are inserted and no restock message is shown
