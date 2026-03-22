## MODIFIED Requirements

### Requirement: Recommendations refresh on Home tab focus
The system SHALL re-fetch recommendations silently whenever the user navigates to the Home tab. If recommendations are already loaded, the current results SHALL remain visible during the background re-fetch — no loading spinner is shown. The spinner is only shown on the very first load when no results exist yet.

#### Scenario: Navigating to Home after updating inventory refreshes recommendations
- **WHEN** the user updates inventory and then navigates to the Home tab
- **THEN** recommendations are re-fetched in the background and updated to reflect the new inventory without a loading spinner

#### Scenario: First load shows spinner
- **WHEN** the user opens the app and the Home tab has no recommendations yet
- **THEN** a loading spinner is shown until the first fetch completes

#### Scenario: Pull-to-refresh still works
- **WHEN** user pulls down on the Home screen
- **THEN** recommendations are re-fetched and updated (existing behavior preserved)

## REMOVED Requirements

### Requirement: Recommendations persist across tab switches
**Reason:** Replaced by "Recommendations refresh on Home tab focus" — persisting stale data caused ingredient availability to appear incorrect after inventory updates.
**Migration:** No migration needed; behavior changes automatically with the useFocusEffect switch.
