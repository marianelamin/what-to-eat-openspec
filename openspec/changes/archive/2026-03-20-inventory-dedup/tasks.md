## 1. Dedup Helper

- [x] 1.1 Add a `levenshtein(a: string, b: string): number` helper function in `src/services/inventoryService.ts` — standard iterative DP implementation
- [x] 1.2 Add a `findNearDuplicate(candidate: string, existing: InventoryItem[]): InventoryItem | undefined` helper — normalizes both to lowercase/trim, then checks: exact match, plural/singular variant (trailing "s" / "es"), and edit distance ≤ 1 for names ≥ 4 characters; returns the first matching existing item or undefined

## 2. Service Layer

- [x] 2.1 In `bulkAddItems` in `src/services/inventoryService.ts`, fetch existing inventory items at the start of the function
- [x] 2.2 For each candidate name, call `findNearDuplicate`; if a match is found, call `updateItem(match.id, { quantity: '6' })` to mark it Stocked instead of inserting a new row
- [x] 2.3 Update the return type of `bulkAddItems` to `{ inserted: number; stocked: number }` and return the counts

## 3. UI Feedback

- [x] 3.1 In `InventoryScreen.tsx` `handleQuickAdd`, read the returned `{ inserted, stocked }` from `bulkAddItems`
- [x] 3.2 If `stocked > 0`, show a message after the modal closes — e.g. `Alert.alert('', '${stocked} item(s) already in inventory — marked as stocked.')`

## 4. Verification

- [x] 4.1 Add "chicken" to inventory at level Low; Quick Add "Chicken" — verify no new item, existing "chicken" jumps to Stocked, and a message appears
- [x] 4.2 Quick Add "chickens" with "chicken" existing — verify existing item restocked
- [X] 4.3 Quick Add "chiken" with "chicken" existing — verify existing item restocked
- [x] 4.4 Quick Add "ham" with "yam" existing — verify "ham" is inserted as a new item (short name, no edit-distance check)
- [x] 4.5 Quick Add "rice, broccoli" with no duplicates — verify both inserted at Stocked level, no restock message
