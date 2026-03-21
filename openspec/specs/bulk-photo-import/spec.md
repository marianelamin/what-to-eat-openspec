## ADDED Requirements

### Requirement: Select multiple photos from camera roll to create draft meals
The system SHALL allow the user to select multiple photos from their device library at once; each selected photo SHALL be uploaded to storage and create a draft Meal row with name "Unnamed Meal".

#### Scenario: User imports photos successfully
- **WHEN** the user selects 3 photos from the camera roll via the bulk import action
- **THEN** 3 draft meals are created, each with a unique uploaded photo URL and name "Unnamed Meal", and all appear in the catalog

#### Scenario: Name is optional on import
- **WHEN** a draft meal is created via bulk import
- **THEN** the meal is saved with name "Unnamed Meal" and the user is NOT required to provide a name before the record is created

#### Scenario: Partial import failure
- **WHEN** one photo fails to upload during a bulk import of 5 photos
- **THEN** the 4 successful drafts are created and a summary message indicates 1 photo could not be imported

#### Scenario: Import cap enforced
- **WHEN** the user attempts to select more than 20 photos at once
- **THEN** the system limits selection to 20 and notifies the user

#### Scenario: Progress feedback during import
- **WHEN** bulk import is in progress
- **THEN** the system shows progress feedback (e.g., "Importing 2 of 5…") so the user knows the operation is ongoing

#### Scenario: Draft meal editable after import
- **WHEN** the user taps a draft meal named "Unnamed Meal" in the catalog
- **THEN** the detail screen opens in edit mode so the user can update the name and details
