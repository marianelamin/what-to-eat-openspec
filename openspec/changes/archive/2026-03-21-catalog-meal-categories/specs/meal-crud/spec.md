## MODIFIED Requirements

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
- **THEN** the meal is saved with photo_url set to null and displayed in the catalog with a placeholder

#### Scenario: Save with ingredients
- **WHEN** the user enters ingredients (one per line) and saves
- **THEN** each non-empty line is saved as a separate meal_ingredients row linked to the meal

#### Scenario: Default meal type is All Day
- **WHEN** the user opens the Add Meal screen
- **THEN** the meal type selector defaults to "All Day"

#### Scenario: User selects Breakfast type
- **WHEN** the user selects "Breakfast" in the meal type selector and saves
- **THEN** the meal is saved with meal_type = 'breakfast' and appears in the Breakfast catalog tab

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

#### Scenario: Change meal type in edit mode
- **WHEN** the user changes the meal type from All Day to Breakfast and saves
- **THEN** the meal's meal_type is updated and it moves to the Breakfast catalog tab
