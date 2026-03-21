# What To Eat

A personal meal planning app that reduces decision fatigue by recommending meals from your own recipe collection, managing virtual inventory, and ensuring nutritional balance.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — install globally if needed:
  ```bash
  npm install -g expo-cli
  ```
- [Expo Go](https://expo.dev/go) app on your iPhone (for running on device)
- A Supabase project (see Environment Setup below)

## Environment Setup

Create a `.env` file in the `what-to-eat/` directory:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Get these values from your [Supabase project settings](https://supabase.com/dashboard) under **Settings > API**.

## Install Dependencies

```bash
cd what-to-eat
npm install
```

## Start the App

```bash
cd what-to-eat
npm start
```

This opens the Expo developer menu in your terminal. From there:

- **iPhone (recommended):** Scan the QR code with the Camera app — opens in Expo Go
- **iOS Simulator:** Press `i` (requires Xcode)
- **Android Emulator:** Press `a` (requires Android Studio)
- **Web:** Press `w`

Or use the shortcut scripts directly:

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Browser
```

## Project Structure

```
what-to-eat/
  App.tsx                  # Entry point
  src/
    screens/               # App screens
    components/            # Reusable UI components
    navigation/            # React Navigation setup
    services/              # Supabase client and API calls
    types/                 # TypeScript type definitions
    utils/                 # Helper functions
```

## Docs

- `docs/meal-planning-app-spec.md` — Full product specification and sprint plan
- `docs/meal-app-home-mockup.html` — Interactive UI mockup (open in browser)
