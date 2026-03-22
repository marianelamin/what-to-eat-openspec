# Overview
In this documents we'll capture those features or capabilities we want our product to have but are not added to ay plan.

## Future capabilities

### Priority: High


### Priority: Medium
- [ ] When I update inventory and then go to home, sometimes the ingredients do not show as available, even though I had just updated them on the inventory.
- [ ] When swipe down on a detail meal view, I should be able to re fetch the data so that any updated on the inventory gets reflected on the meal details.
- When I swipe right to delete an ingredient, the row should go back to its normal position if I click anywhere outside of the delete button. This means, only one ingredient can have that option open, not multiple.


### Priority: Low
- [ ] Revisit UX for deleting an item from the inventory
- [ ] **Bug**: Multiple swipe rows can be open simultaneously — swiping row B does not always auto-close row A. Root cause suspected to be FlatList/PureComponent optimization not propagating `openRowId` state changes to all rows reliably.

### Priority: Undefined
- [ ] Upgrade to Expo SDK 55 (currently on 54 — blocked until iPhone is updated to support Expo Go SDK 55)


## Open questions

- [ ] If user has used a meal a few times, then decides to permanently delete the meal. What happens with the history view?


## Feedback from catalog-actions
- [ ] catalog refreshes after each mutation, - think of a better UX so the user doesnot see the screen jump. discuss.
- [ ] search capabilities extend to ingredients
