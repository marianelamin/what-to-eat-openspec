## 1. InventoryScreen — Close on Scroll

- [x] 1.1 Add `onScrollBeginDrag={() => setOpenRowId(null)}` to the `FlatList` in `InventoryScreen`

## 2. InventoryScreen — Close on Section Header Tap

- [x] 2.1 Import `TouchableWithoutFeedback` from `react-native` in `InventoryScreen`
- [x] 2.2 Wrap the category section header `Text` in `renderSection` with `TouchableWithoutFeedback` that calls `setOpenRowId(null)`
- [x] 2.3 Wrap the Meal Prep section header `Text` in `ListHeaderComponent` with `TouchableWithoutFeedback` that calls `setOpenRowId(null)`
