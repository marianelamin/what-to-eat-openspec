## ADDED Requirements

### Requirement: Expo TypeScript project initialization
The system SHALL be initialized as an Expo managed workflow project using the TypeScript template via `create-expo-app`.

#### Scenario: Fresh project creation
- **WHEN** the developer runs the project creation command
- **THEN** a new Expo project is created with TypeScript configured and `tsconfig.json` present

### Requirement: Standard directory structure
The project SHALL follow the directory structure defined in the product spec with `src/` subdirectories: `screens/`, `components/`, `services/`, `navigation/`, `types/`, `utils/`.

#### Scenario: Directory structure exists after setup
- **WHEN** the project setup is complete
- **THEN** all required directories exist under `src/`

### Requirement: Required dependencies installed
The project SHALL include all dependencies needed for Day 1: `@supabase/supabase-js`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-paper`, `expo-image-picker`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`.

#### Scenario: All dependencies resolve
- **WHEN** the developer runs the app
- **THEN** all required packages are installed and importable without errors

### Requirement: Environment variable configuration
The project SHALL use a `.env` file for `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (the new `sb_publishable_...` format). The `.env` file SHALL be listed in `.gitignore`.

#### Scenario: Environment variables are accessible
- **WHEN** the app starts
- **THEN** Supabase URL and anon key are available to the Supabase client

#### Scenario: Secrets not committed
- **WHEN** the developer runs `git status`
- **THEN** the `.env` file does not appear as a tracked file
