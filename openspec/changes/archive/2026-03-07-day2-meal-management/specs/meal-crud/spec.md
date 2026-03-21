## ADDED Requirements

### Requirement: Add a new meal
The system SHALL allow the authenticated user to create a new meal with a photo, a required name, optional ingredients, and optional notes.

#### Scenario: Save a complete meal
- **WHEN** the user fills in a meal name, optionally picks a photo and enters ingredients, and taps Save
- **THEN** the system saves the meal to Supabase (with uploaded photo URL if a photo was chosen) and navigates back to the catalog

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
