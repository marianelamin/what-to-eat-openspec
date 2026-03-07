## 1. Project Initialization

- [x] 1.1 Create Expo project with TypeScript template using `create-expo-app`
- [x] 1.2 Create directory structure: `src/screens/`, `src/components/`, `src/services/`, `src/navigation/`, `src/types/`, `src/utils/`
- [x] 1.3 Install dependencies: `@supabase/supabase-js`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-paper`, `expo-image-picker`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`, `react-native-vector-icons`
- [x] 1.4 Create `.env` file with `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` placeholders; add `.env` to `.gitignore`
- [x] 1.5 Configure environment variable loading (Expo built-in EXPO_PUBLIC_ prefix — no extra config needed)

<!-- After Group 1, the following three streams can run in parallel -->

## 2. Stream A: Supabase + Auth (depends on: Group 1)

- [x] 2.1 Create Supabase client in `src/services/supabase.ts` with AsyncStorage adapter
- [x] 2.2 Create `src/types/index.ts` with auth-related type definitions
- [x] 2.3 Create `AuthProvider` context in `src/services/auth.tsx` exposing user, session, loading state, signUp, signIn, and signOut functions
- [x] 2.4 Create sign-in screen (`src/screens/SignInScreen.tsx`) with email/password fields, sign-in button, and link to sign-up
- [x] 2.5 Create sign-up screen (`src/screens/SignUpScreen.tsx`) with email/password fields, sign-up button, and link to sign-in
- [x] 2.6 Add error handling and display for auth errors (invalid credentials, duplicate email, etc.)

## 3. Stream B: Base Theme (depends on: Group 1 | parallel with Streams A, C, D)

- [x] 3.1 Configure React Native Paper custom theme with golden amber primary color (`#f59e0b` light / `#d97706` dark)
- [x] 3.2 Implement light/dark mode detection using device system preference (`useColorScheme`)
- [x] 3.3 Apply consistent spacing, typography, and background colors across all screens

## 4. Stream C: Tab Navigation (depends on: Group 1 | parallel with Streams A, B, D)

- [x] 4.1 Create placeholder screens for all 5 tabs (`HomeScreen.tsx`, `CatalogScreen.tsx`, `InventoryScreen.tsx`, `HistoryScreen.tsx`, `ProfileScreen.tsx`)
- [x] 4.2 Create bottom tab navigator in `src/navigation/AppNavigator.tsx` with 5 tabs: Home, Catalog, Inventory, History, Profile

## 5. Stream D: Database Schema (depends on: nothing | parallel with all streams)

- [x] 5.1 Write database schema SQL (meals, meal_ingredients, inventory_items, meal_history tables with defaults and indexes)
- [x] 5.2 Write RLS policies SQL: enable RLS on all tables, add `auth.uid() = user_id` policies for SELECT/INSERT/UPDATE/DELETE; add meal_ingredients policy based on parent meal ownership
- [x] 5.3 Apply schema and RLS SQL to Supabase project via SQL editor

## 6. Integration (depends on: Streams A + B + C merged)

- [x] 6.1 Create auth stack navigator for sign-in/sign-up screens
- [x] 6.2 Implement auth-gated navigation in `App.tsx`: show auth stack when unauthenticated, tab navigator when authenticated
- [x] 6.3 Add tab bar icons and labels with golden amber active tint
- [x] 6.4 Wire everything together in `App.tsx`: AuthProvider > PaperProvider > NavigationContainer > auth-gated navigator

## 7. Verification (depends on: Groups 5 + 6)

- [ ] 7.1 Verify app runs on iOS device via Expo Go
- [x] 7.2 Test sign-up, sign-in, sign-out flows end-to-end
- [x] 7.3 Verify all 5 tabs render and switch correctly
- [x] 7.4 Confirm theme (accent color, light/dark mode) applies across all screens
