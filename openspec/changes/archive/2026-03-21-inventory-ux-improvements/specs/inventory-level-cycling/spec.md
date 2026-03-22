## MODIFIED Requirements

### Requirement: Tap level badge to cycle inventory level inline
The system SHALL allow the user to tap the level icon on any inventory item row to cycle the item's level to the next value and save immediately, without opening a modal. The level SHALL be represented by a horizontal battery icon from `MaterialCommunityIcons` rather than a text label.

#### Scenario: Badge tap cycles forward
- **WHEN** user taps the level icon on an item currently showing Stocked (`battery-high`)
- **THEN** the icon updates to Some (`battery-medium`) and the change is saved to Supabase immediately

#### Scenario: Cycle wraps from Out of stock back to Stocked
- **WHEN** user taps the level icon on an item showing Out of stock (`battery-outline`)
- **THEN** the icon updates to Stocked (`battery-high`) and the change is saved

#### Scenario: Visual confirmation on tap
- **WHEN** user taps a level icon
- **THEN** the icon briefly dims and restores (opacity pulse ~200ms) to confirm the save

#### Scenario: Save failure reverts icon
- **WHEN** the Supabase update fails after a badge tap
- **THEN** the icon reverts to the previous level and a brief error message is shown

#### Scenario: Cycle order is consistent
- **WHEN** user taps the icon repeatedly
- **THEN** levels cycle in order: Stocked → Some → Low → Out of stock → Stocked

#### Scenario: Icon matches level
- **WHEN** an item is at each level
- **THEN** the icon displayed is: Stocked → `battery-high` (amber), Some → `battery-medium` (amber), Low → `battery-low` (amber), Out of stock → `battery-outline` (muted gray)
