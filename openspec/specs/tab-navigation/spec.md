## ADDED Requirements

### Requirement: Bottom tab navigator with 5 tabs
The app SHALL display a bottom tab navigator with 5 tabs: Home, Catalog, Inventory, History, and Profile. The tabs SHALL use icons and labels.

#### Scenario: All tabs visible
- **WHEN** an authenticated user is on any screen
- **THEN** all 5 tabs are visible in the bottom navigation bar

#### Scenario: Tab switching
- **WHEN** the user taps a different tab
- **THEN** the corresponding screen is displayed and the active tab is highlighted

### Requirement: Placeholder screens for each tab
Each tab SHALL render a placeholder screen displaying the screen name. These placeholders will be replaced with full implementations in subsequent sprint days.

#### Scenario: Home tab shows placeholder
- **WHEN** the user navigates to the Home tab
- **THEN** a screen with the title "Home" is displayed

#### Scenario: All tabs have content
- **WHEN** the user navigates to each tab in sequence
- **THEN** each tab renders its respective placeholder screen without errors

### Requirement: Home tab is the default
The Home tab SHALL be the initial/default tab when the user opens the app after authentication.

#### Scenario: App opens to Home
- **WHEN** an authenticated user opens the app
- **THEN** the Home tab is selected and its screen is displayed
