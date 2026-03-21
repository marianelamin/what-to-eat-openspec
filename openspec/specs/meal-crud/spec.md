## ADDED Requirements

### Requirement: Add a new meal
The system SHALL allow the authenticated user to create a new meal with a photo, a required name, a meal type (Breakfast or All Day), optional ingredients, and optional notes. The meal type field SHALL default to All Day.

#### Scenario: Save a complete meal
- **WHEN** the user fills in a meal name, selects a meal type, optionally picks a photo and enters ingredients, and taps Save
- **THEN** the system saves the meal to Supabase (with the selected meal type) and navigates back to the catalog

#### Scenario: Name is required
- **WHEN** the user taps Save without entering a meal name
- **THEN** the system displays a validation error and does not submit the form

#### Scenario: Save without photo
- **WHEN** the user saves a meal without selecting a photo
- **THEN** the meal is saved with `photo_url` set to null and displayed in the catalog with a placeholder

#### Scenario: Save with ingredients
- **WHEN** the user enters ingredients (one per line) and saves
- **THEN** each non-empty line is saved as a separate `meal_ingredients` row linked to the meal

### Requirement: Pick a meal photo from device library
The system SHALL allow the user to select a photo from their device photo library when adding a meal.

#### Scenario: User taps photo picker
- **WHEN** the user taps the photo area or "Add Photo" button on the Add Meal screen
- **THEN** the system opens the device photo library (via expo-image-picker)

#### Scenario: User selects a photo
- **WHEN** the user selects an image from the library
- **THEN** the selected image is shown as a preview in the form

#### Scenario: User cancels photo picker
- **WHEN** the user dismisses the photo picker without selecting an image
- **THEN** the form remains unchanged

### Requirement: Loading and error feedback on save
The system SHALL display a loading indicator while saving and an error message if saving fails.

#### Scenario: Save in progress
- **WHEN** the user taps Save and the system is uploading/saving
- **THEN** a loading indicator is shown and the Save button is disabled

#### Scenario: Save fails
- **WHEN** a network or Supabase error occurs during save
- **THEN** the system displays an error message and remains on the Add Meal screen

### Requirement: Edit an existing meal
The system SHALL allow the authenticated user to edit a meal's name, photo, meal type, ingredients, and recipe notes from the Meal Detail screen.

#### Scenario: Enter edit mode
- **WHEN** the user taps the "Edit" button on the Meal Detail screen
- **THEN** the screen switches to edit mode with editable fields for name, photo, meal type, ingredients (as multiline text), and recipe notes

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
