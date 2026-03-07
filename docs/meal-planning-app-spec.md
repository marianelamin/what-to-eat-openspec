# Meal Planning App - Product Specification

## Problem Statement
Decision fatigue around meal planning is a common struggle. Users need help deciding what to cook based on:
- Personal preferences and meal history
- Available ingredients
- Nutritional variety
- Time available for cooking

## Solution Overview
A personal meal planning app that learns user patterns and recommends meals from their own recipe collection, while managing virtual inventory and ensuring nutritional balance.

---

## Core Features

### 1. Meal Management

**Add/Edit Meals**
- Photo (taken by user, displayed at top of meal cards)
- Meal name (required)
- Ingredients with quantities
- Recipe instructions (optional - for meals user wants to remember)
- Time category: Quick (10-30 min) / Standard (30-60 min) / Long (1-4 hours)
- Healthy Eating Plate components: Protein / Vegetables / Fruit / Whole Grains

**Browse Catalog**
- Scrollable grid/list of all meals with photos (photo-dominant design)
- Filter by:
  - Meal type (Breakfast / Lunch / Dinner)
  - Time effort (Quick / Standard / Long)
  - Ingredient availability (Can make now / Missing some / Missing many)
  - Archived status (Show/hide archived meals)

**Archive Meals**
- Keep meals but hide from recommendations and main browse view
- Preserves meal history
- Optional note when archiving (e.g., "Dairy-free diet until March")
- Can unarchive anytime
- Use cases: medical restrictions, temporary diet changes, seasonal meals, tired of it

**Meal States**
- Active (normal rotation)
- Archived (kept but hidden)
- Deleted (gone forever)

### 2. Meal Detail Screen

Layout (top to bottom):
```
[Full-width photo]

Meal Name
⏱️ Time category | 🥗 Healthy plate components
📅 Last made: X days ago
⭐ Made X times
[Suggested by: Name] (if applicable)

Ingredients Needed
✓ Item - quantity (have it)
~ Item - quantity (probably have)
✗ Item - quantity (need to buy)

Recipe (if added)
[Step by step instructions]

History
Last 3 times made with dates

[Choose This Meal] button
```

**Choose This Meal Flow**
1. User taps button
2. Confirmation dialog: "Log this meal and update inventory?"
3. Upon confirmation:
   - Logs to meal history
   - Deducts ingredients from inventory

### 3. Smart Recommendations

**Recommendation Logic**
- Suggests 2-3 meals per request
- Refreshes once per day (or manual refresh)
- Factors considered:
  - Virtual inventory (what user has/probably has)
  - Variety (avoids recent meals, last made date)
  - Healthy plate balance (ensures variety across protein, vegetables, fruit, grains)
  - Time available (if specified)
- Does NOT auto-filter by meal type/time of day - user decides

**Recommendation Card Format**
```
[User's photo of dish - full width]

Meal Name ⭐
⏱️ Time (X min) | 🥗 Complete plate
📦 Have: ingredient1, ingredient2, ingredient3
⚠️ Need: ingredient4 (probably have ✓)
📅 Last made: X days ago

[Choose This Meal]
```

**Design Principle**
- Suggest variety to start
- Avoid same suggestion every day of the week
- Focus on cycling through meals user already makes (not generating new recipes initially)

### 4. Inventory Management

**Input Methods**
- Receipt scanning (OCR for bulk-add, user adjusts quantities after)
- Manual entry ("I have chicken, broccoli")
- Combination approach

**Inventory Intelligence**
- Learns shopping patterns over time:
  - Items user buys regularly (chicken every week, eggs twice a month)
  - Seasonal patterns (berries in summer, root vegetables in winter)
  - Shopping cycles (shops on Sundays, low by Saturday)
- Predictive inventory: "It's been 5 days since you shopped, you probably have..."
- **Confidence levels** (errs on side of caution):
  - "Definitely have ✓"
  - "Probably have ~"
  - "Might need to buy ?"

**Consumption Tracking**
- Auto-deduct ingredients when user logs a meal
- Learns depletion rates (milk disappears in 3-4 days, frozen chicken lasts weeks)

**Organization**
- Grouped by category: Proteins, Vegetables, Pantry, etc.

### 5. Meal History & Nutrition Tracking

**Meal History**
- Tracks what user ate and when
- Shows frequency per meal ("made 12 times", "last made 8 days ago")
- Last 3 times meal was made

**Healthy Eating Plate Balance**
- Monitors components over time: Protein / Vegetables / Fruit / Whole Grains
- Visual indicators: "This week: protein ✓✓✓✓ but only greens ✓✓"
- Prioritizes suggestions to balance nutrition
- Flags incomplete meals (optional future enhancement)

### 6. Family Sharing

**Sharing Your Catalog (One-way)**
- Generate shareable link/code
- Family members can:
  - Browse meal collection (read-only)
  - View: photos, ingredients, recipes, time categories, healthy plate info
  - Copy meals to their own catalog
- No personal data shared:
  - No meal history
  - No eating patterns
  - No inventory
  - No preferences

**Receiving Suggestions (Two-way)**
- Family members can suggest meals
- Meals arrive fully formed (photo, ingredients, recipe, all details)
- User receives notification: "Mom suggested: Beef Tacos"
- User can:
  - Preview the meal
  - Accept (adds to catalog with "Suggested by [Name]" attribution)
  - Decline (ignores suggestion)

**Provenance**
- Accepted suggestions show "Suggested by [Name]" on meal detail screen
- Helps remember where recipes came from

---

## Onboarding Experience

### Onboarding Flow (Hybrid Approach)
**Philosophy:** Quick start with minimum viable setup, add more as you go

**1. Welcome Screen**
- "Never wonder what to cook again"
- [Get Started]

**2. Add Your First Meals**
"Let's add some meals to your catalog. We recommend at least 5 to get good recommendations."

Three options:
- **Add one meal** - Individual entry (photo, name, details)
- **Bulk import photos** - Select multiple photos, name each (names required, other details can be added later)
- **Skip for now** - Add meals as you cook them

**Bulk Import Flow:**
1. Select multiple photos from gallery
2. Each photo shows with name field
3. User fills in names (required)
4. "Save all" - meals added
5. Message: "You can add ingredients, time, and recipes later"

**3. Quick Inventory (Optional)**
- "What do you have in your fridge?"
- Quick-tap common items
- "Scan receipt" button
- "Skip - I'll add this later"

**4. You're Ready!**
- If 5+ meals: "Your catalog is ready! Let's see what you can make."
- If <5 meals: "You have X meals. Add a few more to get better recommendations."
- [View My Catalog] [Get Recommendation]

### First Recommendation Experience

**Good Setup (5+ meals, some inventory):**
- Shows 2-3 recommendations normally

**Minimal Setup (1-4 meals, little/no inventory):**
- Shows whatever is possible (even 1-2 options)
- Warning banner: "⚠️ Limited recommendations - Add more meals and update your inventory for better suggestions"
- [Add Meals] [Update Inventory] buttons

**No Matches (has meals but missing ingredients):**
- "We couldn't find meals you can make right now"
- "This usually means your inventory needs updating"
- [Update Inventory] [Browse All Meals]

---

## Main Navigation & Screens

### Navigation Structure
**Philosophy:** Recommendation-first (solves immediate problem), clean/minimal design that projects calmness

**Bottom Navigation (5 tabs):**
1. 🏠 Home - Recommendations
2. 📚 Catalog - Browse meals
3. 🥗 Inventory - Manage fridge
4. 📊 History - Meal log
5. 👤 Profile - Settings, sharing

### Home Screen (Recommendations)
```
┌─────────────────────────────┐
│  What should you cook?      │
│  Dinner • Sunday            │
│                             │
│  [🔄 Update Inventory]      │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   [Meal Photo]        │  │
│  │                       │  │
│  ├───────────────────────┤  │
│  │ Chicken Stir-Fry ⭐   │  │
│  │ ⏱️ Quick | 🥗 Complete │  │
│  │ 📦 Have most          │  │
│  │ 📅 Last: 8 days ago   │  │
│  │                       │  │
│  │ [Choose This Meal]    │  │
│  └───────────────────────┘  │
│                             │
│  [2 more meal cards]        │
│                             │
│  [Refresh] [Browse All]     │
│                             │
│  Quick Stats:               │
│  📚 15 meals | 🥗 12 items  │
│                             │
└─────────────────────────────┘
│🏠│📚│🥗│📊│👤│
└─────────────────────────────┘
```

**Behaviors:**
- Recommendations refresh once per day (midnight or first open)
- Always shows 2-3 meals
- All meal types shown (user decides, not time-filtered)
- Manual refresh available
- Smart alerts if inventory stale or catalog too small

### Catalog Screen (Browse)
```
┌─────────────────────────────┐
│  My Meals (15)         [+]  │
│                             │
│  Filters: [All Meals ▼]     │
│  [Breakfast][Quick][Can Make]│
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │[📷] │ │[📷] │ │[📷] │   │
│  │Stir │ │Tacos│ │Salad│   │
│  │Fry  │ │     │ │     │   │
│  │⏱️🥗 │ │⏱️🥗 │ │⏱️🥗 │   │
│  └─────┘ └─────┘ └─────┘   │
│                             │
│  [Photo-dominant grid...]   │
│                             │
└─────────────────────────────┘
```

### Inventory Screen
```
┌─────────────────────────────┐
│  My Fridge            [+]   │
│                             │
│  [Scan Receipt] [Add Item]  │
│                             │
│  Last updated: 2 days ago   │
│  ⚠️ May be out of date      │
│                             │
│  Proteins (4)               │
│  ✓ Chicken breast - 1 lb    │
│  ✓ Eggs - 8                 │
│  ~ Ground beef - 1 lb       │
│  ✓ Salmon - 2 fillets       │
│                             │
│  Vegetables (6)             │
│  [Grouped by category...]   │
│                             │
│  Pantry (8)                 │
│  [...]                      │
└─────────────────────────────┘
```

### History Screen
```
┌─────────────────────────────┐
│  Meal History               │
│                             │
│  This Week                  │
│  🥗 Healthy Plate Balance:  │
│  Protein    ●●●●○○○         │
│  Vegetables ●●●○○○○         │
│  Fruit      ●●○○○○○         │
│  Grains     ●●●●●○○         │
│                             │
│  [Chronological meal log]   │
└─────────────────────────────┘
```

### Profile Screen
```
┌─────────────────────────────┐
│  Profile                    │
│                             │
│  My Catalog                 │
│  📚 15 meals                │
│  📊 47 meals logged         │
│  [Share My Catalog]         │
│                             │
│  Family Sharing             │
│  👥 2 connections           │
│  [Manage Connections]       │
│  💡 1 new suggestion        │
│                             │
│  [Settings & preferences]   │
└─────────────────────────────┘
```

---

## Design Principles

### Visual Design
- **Clean/minimal aesthetic** - projects calmness
- **Photo-dominant** - meals are visual and appetizing
- No stress, no decision fatigue - "we've got this handled" feeling
- Personal photos make it authentic

### Phase 1 (MVP)
- Start simple: complete meals only (no mix-and-match sides yet)
- Focus on meals user already makes (not recipe generation)
- Conservative inventory predictions (err on caution)
- Core loop: recommend → choose → log → deduct

### Future Enhancements (Post-MVP)
- Mix-and-match sides (chicken with potatoes one day, broccoli another)
- Suggest complementary dishes for incomplete meals
- More sophisticated nutrition tracking
- Shopping list generation
- Integration with grocery delivery services
- Recipe discovery/generation based on user preferences

---

## Technical Implementation

### Tech Stack (Confirmed)
**Platform:** React Native with Expo (cross-platform)
**Backend:** Supabase (PostgreSQL, auth, storage, functions)
**Language:** TypeScript
**Primary Target:** iOS first, then Android

### Why This Stack
- Cross-platform from single codebase
- Supabase free tier sufficient for personal use
- No budget required - just time and skills
- Proven, well-documented technologies
- Fast iteration for 7-day sprint

### Database Schema

```sql
-- users (handled by Supabase Auth)

-- meals
create table meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  photo_url text,
  time_category text, -- 'quick', 'standard', 'long'
  recipe text,
  has_protein boolean default false,
  has_vegetables boolean default false,
  has_fruit boolean default false,
  has_grains boolean default false,
  is_archived boolean default false,
  suggested_by text, -- name of family member if applicable
  created_at timestamp default now(),
  last_made_at timestamp,
  times_made integer default 0
);

-- meal_ingredients
create table meal_ingredients (
  id uuid primary key default uuid_generate_v4(),
  meal_id uuid references meals not null,
  ingredient_name text not null,
  quantity text,
  created_at timestamp default now()
);

-- inventory_items
create table inventory_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  quantity text,
  category text, -- 'protein', 'vegetable', 'pantry', etc
  confidence_level text default 'certain', -- 'certain', 'probable', 'uncertain'
  added_at timestamp default now(),
  updated_at timestamp default now()
);

-- meal_history
create table meal_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  meal_id uuid references meals not null,
  logged_at timestamp default now()
);

-- Add indexes
create index meals_user_id_idx on meals(user_id);
create index meals_archived_idx on meals(is_archived);
create index inventory_user_id_idx on inventory_items(user_id);
create index history_user_id_idx on meal_history(user_id);
create index history_logged_at_idx on meal_history(logged_at);
```

### Key Features Implementation

**Receipt OCR**
- Start with Google ML Kit (free, mobile)
- Upgrade to Cloud Vision API if needed later
- MVP: Manual entry with bulk-add shortcuts

**Photo Management**
- Supabase Storage for originals
- Generate thumbnails for catalog view
- Compress for performance

**Recommendation Algorithm (Simple Start)**
```typescript
async function getRecommendations(userId: string) {
  // 1. Get user's inventory
  const inventory = await getInventory(userId);
  const inventoryNames = inventory.map(i => i.name.toLowerCase());
  
  // 2. Get all active meals with ingredients
  const meals = await getMealsWithIngredients(userId);
  
  // 3. Score each meal
  const scoredMeals = meals.map(meal => {
    const ingredients = meal.ingredients.map(i => i.ingredient_name.toLowerCase());
    const matchCount = ingredients.filter(ing => 
      inventoryNames.some(inv => inv.includes(ing) || ing.includes(inv))
    ).length;
    
    const matchPercent = matchCount / ingredients.length;
    const daysSinceLastMade = meal.last_made_at 
      ? (Date.now() - new Date(meal.last_made_at).getTime()) / (1000 * 60 * 60 * 24)
      : 999;
    
    return {
      ...meal,
      score: (matchPercent * 100) + (daysSinceLastMade * 2)
    };
  });
  
  // 4. Return top 2-3
  return scoredMeals
    .filter(m => m.score > 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
```

**Learning/Pattern Recognition**
- Track shopping frequency, item patterns, meal preferences
- Start with simple heuristics
- Can add ML later (TensorFlow, scikit-learn)

---

## 7-Day Development Sprint

**Goal:** Working app on iPhone for personal use

### Day 1: Setup & Foundation
- Set up Expo + Supabase project
- Database schema
- Basic auth (email/password)
- Bottom tab navigation shell
- Basic styling (clean/minimal theme)

**Deliverable:** App runs on phone, can log in

### Day 2: Meal Management
- Add meal screen (photo, name required)
- Meal catalog view (photo-dominant grid)
- Store meals in Supabase with photos
- Meal detail screen (read-only)
- Basic filtering

**Deliverable:** Can add and browse meals

### Day 3: Inventory
- Manual inventory entry
- Simple list (name, quantity, category)
- Quick-add common items
- Edit/delete items

**Deliverable:** Can track fridge contents

**Skip for MVP:** Receipt scanning, predictive inventory, confidence levels

### Day 4: Recommendations
- Add ingredients to meals
- Basic matching algorithm (ingredient availability + variety)
- Home screen with recommendation cards
- "Choose This Meal" button

**Deliverable:** App suggests meals you can make

### Day 5: Meal Logging & History
- Log meal functionality
- Deduct ingredients from inventory
- Store in meal history
- History screen with simple list
- Basic stats

**Deliverable:** Complete end-to-end flow works

### Day 6: Meal Details & Polish
- Complete meal detail screen (ingredients, recipe, edit, time, healthy plate)
- Bulk photo import
- Archive meal functionality
- Ingredient have/don't have indicators

**Deliverable:** All meal management features work

### Day 7: Final Polish & Testing
- UI refinement (spacing, colors, fonts for calm aesthetic)
- Error handling
- Loading states
- Add real meals and inventory
- Use it for actual dinner decision
- Fix critical bugs

**Deliverable:** Actually using it daily

### Features Deferred to Week 2+
- Receipt OCR scanning
- Learning/pattern recognition
- Predictive inventory with confidence levels
- Family sharing and meal suggestions
- Nutrition tracking visualization
- Advanced recommendation scoring
- Onboarding flow (developer knows how to use it)
- Refresh recommendations UI (just reopen app)

---

## Success Metrics

### User Engagement
- Daily active usage
- Meals logged per week
- Time to decision (how quickly user picks a meal)

### Core Value Delivery
- Reduction in decision fatigue (user feedback)
- Nutritional balance improvement
- Reduced food waste (better inventory management)
- Meal variety (avoiding repetition)

### Feature Adoption
- Recommendation acceptance rate
- Browse vs. recommendation usage
- Family sharing adoption
- Inventory feature usage

---

## Open Questions for Future Discussion

1. **Monetization** - Free, freemium, paid? (not yet discussed)
2. **Meal type categorization** - Should breakfast/lunch/dinner be required or optional?
3. **Photo requirements** - What if user doesn't have photo for a meal?
4. **Recipe formats** - Free text, structured steps, both?
5. **Scaling** - How many meals in a typical user's rotation?
6. **Advanced nutrition** - Macro tracking, calorie counting?
7. **Social features** - Beyond family sharing?
8. **Grocery integration** - Link to delivery services?

---

## Project Context

**Developer:** Senior full-stack developer, 7+ years experience
**Primary Languages:** TypeScript, Java, .NET
**Familiar with:** React
**Timeline:** 7-day sprint for personal MVP
**Budget:** Zero - personal project
**Initial Platform:** iOS (own device)

---

*Document created: February 22, 2026*
*Last updated: February 22, 2026*
*Status: In Development - Day 1*

---

## Quick Start for Development

### Tools & Setup
```bash
# Install Expo CLI
npm install -g expo-cli

# Create project
npx create-expo-app meal-planner
cd meal-planner

# Install dependencies
npm install @supabase/supabase-js
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install expo-image-picker
npm install react-native-paper  # or NativeBase for UI components
```

### Project Structure
```
/meal-planner
  /src
    /screens
      HomeScreen.tsx
      CatalogScreen.tsx
      InventoryScreen.tsx
      HistoryScreen.tsx
      ProfileScreen.tsx
      AddMealScreen.tsx
      MealDetailScreen.tsx
    /components
      MealCard.tsx
      InventoryItem.tsx
      IngredientList.tsx
    /services
      supabase.ts
      recommendations.ts
    /navigation
      AppNavigator.tsx
    /types
      index.ts
    /utils
      helpers.ts
  App.tsx
  app.json
```

### Environment Variables
Create `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Next Steps
1. Set up Supabase project at supabase.com
2. Run database schema SQL in Supabase SQL editor
3. Configure row-level security policies
4. Start Expo dev server: `npx expo start`
5. Scan QR code with Expo Go app on iPhone