## ADDED Requirements

### Requirement: Upload meal photo to Supabase Storage
The system SHALL upload the selected meal photo to the `meal-photos` Supabase Storage bucket and store the resulting public URL in `meals.photo_url`.

#### Scenario: Photo uploaded successfully
- **WHEN** the user saves a meal with a photo
- **THEN** the system uploads the image to `meal-photos/<user_id>/<uuid>.jpg` and stores the public URL in `meals.photo_url`

#### Scenario: Upload fails
- **WHEN** the photo upload to Supabase Storage fails
- **THEN** the system reports an error and does not save the meal record

### Requirement: Display meal photos from public URL
The system SHALL display meal photos using the public URL stored in `meals.photo_url` without requiring authentication headers.

#### Scenario: Photo displays in catalog
- **WHEN** a meal has a `photo_url`
- **THEN** the catalog grid displays the photo by loading it from the public URL

#### Scenario: Photo displays in detail screen
- **WHEN** the user opens a meal detail screen for a meal with a photo
- **THEN** the photo is displayed at the top of the detail screen using the public URL

### Requirement: Compress photo before upload
The system SHALL compress and resize photos before uploading to reduce storage usage and load times.

#### Scenario: Photo is compressed
- **WHEN** the user selects a photo
- **THEN** the system uses expo-image-picker quality settings (quality: 0.7, max 1200px wide) before uploading
