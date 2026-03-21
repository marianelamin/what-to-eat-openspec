## Requirements

### Requirement: Swipe between meals in detail view
The system SHALL allow the user to swipe left or right in the meal detail screen to navigate to the adjacent meal in the currently-filtered catalog list.

#### Scenario: Swipe left advances to next meal
- **WHEN** the user swipes left on the meal detail screen and there is a next meal in the list
- **THEN** the detail view transitions to the next meal's content

#### Scenario: Swipe right returns to previous meal
- **WHEN** the user swipes right on the meal detail screen and there is a previous meal in the list
- **THEN** the detail view transitions to the previous meal's content

#### Scenario: No swipe at the first meal
- **WHEN** the user is viewing the first meal in the list and swipes right
- **THEN** the swipe does not navigate (the pager does not scroll past the beginning)

#### Scenario: No swipe at the last meal
- **WHEN** the user is viewing the last meal in the list and swipes left
- **THEN** the swipe does not navigate (the pager does not scroll past the end)

#### Scenario: Swipe order matches filtered catalog
- **WHEN** the user searched for "pasta" in the catalog and tapped the first result
- **THEN** swiping left shows the second "pasta" result, not an unfiltered neighbor

#### Scenario: Swipe disabled while editing
- **WHEN** the user has tapped "Edit Meal" and is in edit mode
- **THEN** left/right swipe gestures are disabled; the user must save or cancel before swiping to another meal
