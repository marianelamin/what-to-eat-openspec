## 1. Remove Confirmation Dialog

- [x] 1.1 In `InventoryScreen.tsx`, replace `handleDelete` with a direct async call: capture the item being deleted, remove it from local state optimistically, call `deleteItem(item.id)`, and on failure restore the item to the list and show `Alert.alert('Error', 'Failed to delete item.')`
- [x] 1.2 Remove the `Alert.alert('Delete Item', ...)` wrapper and the `{ text: 'Cancel' }` / `{ text: 'Delete', onPress }` options object

## 2. Verification

- [x] 2.1 Tap "Delete" on any inventory item — verify item disappears immediately with no confirmation dialog
- [x] 2.2 Verify the item is removed from Supabase (navigate away and back — item should not reappear)
