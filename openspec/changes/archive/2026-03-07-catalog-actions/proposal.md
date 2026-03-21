## Why

The meal catalog is currently read-only — users can browse meals but can't act on them. This creates friction in the core loop: choosing, editing, and building out the meal library all require leaving the catalog or are simply impossible. Adding actions directly in the catalog makes the app useful as a daily driver.

## What Changes

- Add "Choose This Meal" button to the Meal Detail screen (logs the meal, deducts inventory, same flow as Home screen)
- Add edit meal capability from the detail screen: name, photo, ingredients (add/remove lines), recipe notes
- Add **Archive** action on the detail screen — hides the meal from recommendations (sets `is_archived = true`) but keeps data. Reversible.
- Add **Delete Permanently** action on the detail screen — hard-deletes the meal and its ingredient rows. Intended for mistakes (e.g., accidental adds). Requires a stronger confirmation ("This cannot be undone").
- Archived meals remain visible in the catalog with a clear visual indicator (greyed out + "Archived" badge) so users can identify and manage them
- From an archived meal's detail screen, user can Restore (unarchive back to active) or Delete Permanently
- Add bulk photo import: select multiple photos from camera roll → each creates a draft meal record with name "Unnamed Meal" (editable later); name is optional on import
- Pass navigation callbacks so the catalog list refreshes after edit/delete/add

## Capabilities

### New Capabilities
- `bulk-photo-import`: Select multiple images from camera roll; each image uploads to storage and creates a draft `Meal` row with `name = "Unnamed Meal"` and the uploaded photo URL. User can tap any draft later to rename and fill in details.

### Modified Capabilities
- `meal-crud`: Edit meal, archive meal (soft-delete), permanently delete meal (hard-delete), and restore archived meal are new CRUD operations not currently covered.
- `meal-logging`: "Choose This Meal" can now be triggered from the Meal Detail screen in addition to the Home screen.
- `meal-detail`: Screen transitions from read-only to interactive — adds Choose, Edit, Archive, Delete Permanently, and Restore (for archived meals) actions.

## Impact

- `src/screens/MealDetailScreen.tsx` — add action buttons; active meals show Choose/Edit/Archive; archived meals show Restore/Delete Permanently
- `src/screens/CatalogScreen.tsx` — show archived meals with visual indicator; add bulk import FAB or header button; refresh list after mutations
- `src/services/mealService.ts` — add `updateMeal()`, `archiveMeal()`, `restoreMeal()`, `deleteMeal()` functions
- `src/navigation/CatalogNavigator.tsx` — may need updated param types for passing refresh callbacks
- Supabase storage — photo uploads already handled by `uploadMealPhoto()`; no schema changes needed
- Expo ImagePicker — new dependency for camera roll access (`expo-image-picker`)
