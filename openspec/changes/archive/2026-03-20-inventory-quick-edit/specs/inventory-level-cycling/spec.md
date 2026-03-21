## ADDED Requirements

### Requirement: Tap level badge to cycle inventory level inline
The system SHALL allow the user to tap the level badge on any inventory item row to cycle the item's level to the next value and save immediately, without opening a modal.

#### Scenario: Badge tap cycles forward
- **WHEN** user taps the level badge on an item currently showing "Stocked"
- **THEN** the badge updates to "Some" and the change is saved to Supabase immediately

#### Scenario: Cycle wraps from Out of stock back to Stocked
- **WHEN** user taps the level badge on an item showing "Out of stock"
- **THEN** the badge updates to "Stocked" and the change is saved

#### Scenario: Visual confirmation on tap
- **WHEN** user taps a level badge
- **THEN** the badge briefly dims and restores (opacity pulse ~200ms) to confirm the save

#### Scenario: Save failure reverts badge
- **WHEN** the Supabase update fails after a badge tap
- **THEN** the badge reverts to the previous level and a brief error message is shown

#### Scenario: Cycle order is consistent
- **WHEN** user taps the badge repeatedly
- **THEN** levels cycle in order: Stocked → Some → Low → Out of stock → Stocked
