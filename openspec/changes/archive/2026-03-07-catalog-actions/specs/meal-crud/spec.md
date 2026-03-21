## ADDED Requirements

### Requirement: Edit an existing meal
The system SHALL allow the authenticated user to edit a meal's name, photo, ingredients, and recipe notes from the Meal Detail screen.

#### Scenario: Enter edit mode
- **WHEN** the user taps the "Edit" button on the Meal Detail screen
- **THEN** the screen switches to edit mode with editable fields for name, photo, ingredients (as multiline text), and recipe notes

#### Scenario: Save edits successfully
- **WHEN** the user modifies fields and taps Save
- **THEN** the meal record is updated in Supabase, ingredient rows are replaced with the new list, and the screen returns to view mode showing updated content

#### Scenario: Cancel edit discards changes
- **WHEN** the user taps Cancel while in edit mode
- **THEN** no changes are saved and the screen returns to view mode with the original content

#### Scenario: Edit photo
- **WHEN** the user taps the photo area in edit mode
- **THEN** the device photo library opens and the selected photo replaces the current photo preview

#### Scenario: Replace ingredients on save
- **WHEN** the user edits the ingredient list (one per line) and saves
- **THEN** existing meal_ingredients rows for the meal are deleted and new rows are inserted for each non-empty line

### Requirement: Archive a meal
The system SHALL allow the authenticated user to archive a meal from the Meal Detail screen; archiving sets `is_archived = true` and is reversible via Restore.

#### Scenario: Archive confirmation required
- **WHEN** the user taps "Archive" on the Meal Detail screen
- **THEN** a confirmation alert is shown with copy indicating the action is reversible ("You can restore it later")

#### Scenario: Confirm archive hides meal from recommendations
- **WHEN** the user confirms archiving
- **THEN** the meal's is_archived field is set to true, it no longer appears in recommendations, it is rendered with an "Archived" badge in the catalog, and the user is navigated back to the catalog

#### Scenario: Cancel archive keeps meal active
- **WHEN** the user dismisses the archive confirmation alert
- **THEN** no changes are made and the user remains on the Meal Detail screen

### Requirement: Permanently delete a meal
The system SHALL allow the authenticated user to permanently delete a meal from the Meal Detail screen; this removes the meal row and all associated meal_ingredients rows and cannot be undone.

#### Scenario: Delete permanently requires strong confirmation
- **WHEN** the user taps "Delete Permanently" on the Meal Detail screen
- **THEN** a confirmation alert is shown with copy that explicitly states "This cannot be undone"

#### Scenario: Confirm permanent delete removes meal
- **WHEN** the user confirms permanent deletion
- **THEN** the meal row and all its meal_ingredients rows are deleted from Supabase, the meal no longer appears anywhere in the catalog, and the user is navigated back to the catalog

#### Scenario: Cancel permanent delete keeps meal
- **WHEN** the user dismisses the permanent delete confirmation alert
- **THEN** no changes are made and the user remains on the Meal Detail screen

### Requirement: Restore an archived meal
The system SHALL allow the user to restore an archived meal to active status from the archived meal's detail screen.

#### Scenario: Restore sets meal to active
- **WHEN** the user taps "Restore" on an archived meal's detail screen
- **THEN** the meal's is_archived field is set to false, the meal returns to the active catalog without the "Archived" badge, and appears in recommendations again

### Requirement: Archived meals visible in catalog
The system SHALL display archived meals in the catalog with a visual indicator so users can identify and manage them.

#### Scenario: Archived meals shown with badge
- **WHEN** the catalog is displayed and the user has archived meals
- **THEN** archived meals appear in the catalog grid with a greyed-out style and an "Archived" badge

#### Scenario: Active meals unaffected by archived meals
- **WHEN** active and archived meals coexist
- **THEN** active meals display normally; archived meals appear visually distinct, positioned after active meals
