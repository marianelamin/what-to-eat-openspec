## Why

The app has a complete product spec and visual mockup but no code yet. Before any features can be built, we need the foundational project structure: an Expo project with TypeScript, Supabase backend connectivity, authentication, navigation shell, and consistent styling. This is Day 1 of the 7-day sprint — everything else depends on this foundation being solid.

## What Changes

- Initialize a new Expo project with TypeScript template
- Configure Supabase client with environment variables (URL + publishable key)
- Create the database schema in Supabase: `meals`, `meal_ingredients`, `inventory_items`, `meal_history` tables with indexes
- Implement email/password authentication using Supabase Auth
- Set up React Navigation with bottom tab navigator (Home, Catalog, Inventory, History, Profile)
- Create placeholder screens for all 5 tabs
- Establish the base theme: clean/minimal aesthetic with golden amber accent (#f59e0b / #d97706), light and dark mode support
- Set up project structure: `src/screens/`, `src/components/`, `src/services/`, `src/navigation/`, `src/types/`, `src/utils/`

## Capabilities

### New Capabilities
- `project-setup`: Expo + TypeScript project initialization, directory structure, and dependency installation
- `supabase-backend`: Supabase client configuration, database schema creation, and Row Level Security policies
- `user-auth`: Email/password authentication flow (sign up, sign in, sign out) with auth state management
- `tab-navigation`: Bottom tab navigator with 5 screens and consistent navigation structure
- `base-theme`: App-wide styling theme with golden amber accent, typography, spacing, and light/dark mode

### Modified Capabilities

None — this is a greenfield project.

## Impact

- **New files**: ~15-20 files (screens, services, navigation, types, config)
- **Dependencies**: `@supabase/supabase-js`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-paper`, `expo-image-picker`, `react-native-screens`, `react-native-safe-area-context`
- **External systems**: Supabase project must be created at supabase.com; database schema applied via SQL editor
- **Environment**: `.env` file with `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (not committed)
