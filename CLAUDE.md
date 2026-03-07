# What To Eat - Meal Planning App

## Project Overview
A personal meal planning app that reduces decision fatigue by recommending meals from the user's own recipe collection, managing virtual inventory, and ensuring nutritional balance.

## Tech Stack
- **Platform:** React Native with Expo (iOS first, then Android)
- **Backend:** Supabase (PostgreSQL, auth, storage, functions)
- **Language:** TypeScript
- **UI:** React Native Paper (or NativeBase)
- **Navigation:** React Navigation (bottom tabs)
- **OCR:** Google ML Kit (future — manual entry for MVP)

## Key Documents
- `docs/meal-planning-app-spec.md` — Full product specification
- `docs/meal-app-home-mockup.html` — Interactive HTML mockup (all screens, light/dark mode)

## Architecture & Conventions
- Source code lives in `/src` with subdirectories: `screens/`, `components/`, `services/`, `navigation/`, `types/`, `utils/`
- Entry point: `App.tsx`
- Supabase client configured in `src/services/supabase.ts`
- Environment variables in `.env` (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) — never commit this file
- TypeScript strict mode preferred
- Minimal, clean UI aesthetic — calm feel, photo-dominant design
- Golden amber accent color (`#f59e0b` / `#d97706`)

## MVP Scope (Phase 1)
Core loop: **recommend → choose → log → deduct**
- Meal CRUD with photos
- Manual inventory management
- Basic recommendation algorithm (ingredient match + variety)
- Meal history logging with ingredient deduction
- Healthy Eating Plate tagging (protein, vegetables, fruit, grains)

### Deferred to Phase 2+
- Receipt OCR scanning
- Predictive inventory / confidence levels
- Family sharing & meal suggestions
- Nutrition tracking visualization
- Advanced recommendation scoring / ML
- Onboarding flow
- Shopping list generation

## Development Approach
- 7-day sprint targeting a working personal-use app on iPhone
- Day-by-day plan detailed in `docs/meal-planning-app-spec.md` (see "7-Day Development Sprint")
- Prefer simple heuristics over complex solutions
- Conservative inventory predictions (err on caution)

## Code Style
- Functional components with hooks (no class components)
- Named exports preferred
- Keep components focused — extract when reused, not preemptively
- Minimal comments — only where logic isn't self-evident
- No over-engineering: build for current needs, not hypothetical futures

---

## Open Spec Changelog

Track all specification changes, design decisions, and scope adjustments here. Each entry should capture what changed, why, and any trade-offs considered.

### Format
```
#### YYYY-MM-DD — Short Title
**Type:** spec-change | design-decision | scope-change | bugfix | tech-decision
**Summary:** What changed and why.
**Files affected:** List of modified files.
**Trade-offs / Notes:** Any context for future reference.
```

### Entries

#### 2026-03-06 — Auth UI Polish Deferred to Day 6/7
**Type:** scope-change
**Summary:** Auth screens (sign-in/sign-up) are functional but do not match the visual mockup. Polishing them to match the mockup design is deferred to the Day 6/7 polish sprint.
**Files affected:** `src/screens/SignInScreen.tsx`, `src/screens/SignUpScreen.tsx`
**Trade-offs / Notes:** Mockup reference is `docs/meal-app-home-mockup.html`. Priority during Day 1 was correct function over visual fidelity.

#### 2026-02-26 — Initial Project Setup
**Type:** spec-change
**Summary:** Created project repository with product spec and HTML mockup. Established CLAUDE.md with project conventions and open spec changelog.
**Files affected:** `CLAUDE.md`, `docs/meal-planning-app-spec.md`, `docs/meal-app-home-mockup.html`
**Trade-offs / Notes:** Spec was authored collaboratively before repo creation. Mockup covers all 5 main screens plus Add Meal and Meal Detail flows. Starting from a clean slate — no code yet.
