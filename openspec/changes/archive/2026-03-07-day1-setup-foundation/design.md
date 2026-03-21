## Context

This is a greenfield React Native meal planning app. No code exists yet — only a product spec and HTML mockup. The tech stack is confirmed: Expo + TypeScript + Supabase + React Navigation + React Native Paper. The developer is experienced with TypeScript and React but this is their first React Native / Expo project. The app targets iOS first via Expo Go for rapid development.

## Goals / Non-Goals

**Goals:**
- Runnable Expo app on iPhone via Expo Go
- Working email/password auth (sign up, sign in, sign out)
- 5-tab navigation shell with placeholder screens
- Supabase database schema deployed and accessible
- Consistent base theme applied across the app
- Clean project structure that supports the remaining 6 days of sprint work

**Non-Goals:**
- No feature implementation beyond auth and navigation (meals, inventory, recommendations are Day 2+)
- No receipt OCR, family sharing, or advanced features
- No CI/CD, testing infrastructure, or deployment pipeline
- No Android testing (iOS-only for now)
- No custom auth flows (social login, magic link) — email/password only

## Decisions

### 1. Expo managed workflow (not bare)
**Choice:** Use Expo managed workflow with `create-expo-app`.
**Rationale:** Managed workflow provides OTA updates, simpler config, and Expo Go for quick device testing. No native modules needed for MVP.
**Alternative considered:** Bare workflow — rejected because it adds complexity with no benefit at this stage.

### 2. Supabase client via `@supabase/supabase-js` with AsyncStorage
**Choice:** Configure Supabase client with `@react-native-async-storage/async-storage` for session persistence, using the new `sb_publishable_...` key format (not the legacy anon key).
**Rationale:** Supabase JS client needs a storage adapter for React Native to persist auth sessions across app restarts. AsyncStorage is the standard React Native solution. The new publishable key format is the current standard — legacy anon keys are deprecated.
**Alternative considered:** SecureStore — more secure but adds complexity; AsyncStorage is sufficient for MVP.

### 3. Auth state via React Context
**Choice:** Wrap the app in an `AuthProvider` context that exposes the current user and loading state.
**Rationale:** Simple, no external state management library needed. Auth state is global and rarely changes — Context is ideal for this.
**Alternative considered:** Zustand or Redux — overkill for a single piece of global state.

### 4. React Native Paper for UI components
**Choice:** Use React Native Paper as the component library.
**Rationale:** Material Design 3 support, good TypeScript types, built-in theming that supports light/dark mode, active maintenance.
**Alternative considered:** NativeBase — less actively maintained and heavier.

### 5. Database schema deployed via Supabase SQL Editor
**Choice:** Run schema SQL manually in Supabase dashboard during setup.
**Rationale:** One-time setup for personal MVP. No migration tooling needed.
**Alternative considered:** Supabase migrations CLI — useful for teams but unnecessary overhead for solo developer.

### 6. Row Level Security (RLS) from day one
**Choice:** Enable RLS on all tables with policies scoped to `auth.uid()`.
**Rationale:** Security should be built in from the start, not bolted on later. Simple policies (user can only access their own data) are easy to write now and prevent data leaks.

## Risks / Trade-offs

- **[Expo Go limitations]** → Some native modules may not work in Expo Go. Mitigation: MVP features don't require custom native code; can eject later if needed.
- **[AsyncStorage for auth tokens]** → Not encrypted at rest. Mitigation: Acceptable for personal-use MVP; can upgrade to SecureStore in Phase 2.
- **[Manual DB schema deployment]** → No version control for schema changes. Mitigation: Schema SQL is documented in the product spec; can adopt migrations later.
- **[No automated tests]** → Bugs may slip through. Mitigation: Manual testing on device; test infrastructure planned for later.
