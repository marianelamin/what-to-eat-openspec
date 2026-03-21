## ADDED Requirements

### Requirement: Quick-log a meal from the catalog grid
The system SHALL allow the user to log an active meal directly from the catalog grid without opening the detail screen. Each active meal card SHALL display a quick-log button. Archived meal cards SHALL NOT show the quick-log button.

#### Scenario: Tap quick-log on an active meal
- **WHEN** the user taps the quick-log button on an active meal card in the catalog grid
- **THEN** the meal is logged immediately (no confirmation dialog), the catalog refreshes, and a brief success indicator is shown on the card

#### Scenario: Quick-log shows loading state
- **WHEN** the quick-log button is tapped and the log request is in progress
- **THEN** the button shows a loading indicator and cannot be tapped again until the request completes

#### Scenario: Quick-log fails
- **WHEN** the quick-log request fails
- **THEN** an error message is shown and the card returns to its normal state

#### Scenario: Archived meal has no quick-log button
- **WHEN** a meal is archived and appears in the catalog grid
- **THEN** the quick-log button is not shown on that card
