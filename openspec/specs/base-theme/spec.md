## ADDED Requirements

### Requirement: Golden amber accent color
The app theme SHALL use golden amber as the primary accent color (`#f59e0b` for light mode, `#d97706` for dark mode) consistently across interactive elements, tab bar highlights, and buttons.

#### Scenario: Accent color applied to buttons
- **WHEN** a primary button is rendered
- **THEN** the button uses the golden amber accent color

#### Scenario: Active tab uses accent color
- **WHEN** a tab is selected in the bottom navigator
- **THEN** the tab icon and label use the golden amber accent color

### Requirement: Clean minimal aesthetic
The app SHALL follow a clean, minimal design with generous whitespace, calm neutral backgrounds, and a photo-dominant layout philosophy.

#### Scenario: Screens have consistent spacing
- **WHEN** any screen is rendered
- **THEN** the screen uses consistent padding, margins, and spacing from the base theme

### Requirement: React Native Paper theme configuration
The app SHALL configure React Native Paper's `PaperProvider` with a custom theme that sets the primary color to golden amber and applies to all Paper components.

#### Scenario: Paper components use custom theme
- **WHEN** a React Native Paper component (Button, Card, etc.) is rendered
- **THEN** it inherits the golden amber accent from the custom theme

### Requirement: Light and dark mode support
The app SHALL support both light and dark color schemes, following the device's system preference.

#### Scenario: Device in light mode
- **WHEN** the device is set to light mode
- **THEN** the app renders with light backgrounds and dark text

#### Scenario: Device in dark mode
- **WHEN** the device is set to dark mode
- **THEN** the app renders with dark backgrounds and light text
