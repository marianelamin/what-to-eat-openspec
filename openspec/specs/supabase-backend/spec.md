## ADDED Requirements

### Requirement: Supabase client configuration
The app SHALL configure a Supabase client in `src/services/supabase.ts` using the environment variables `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (the new `sb_publishable_...` format), with `AsyncStorage` as the auth storage adapter.

#### Scenario: Client connects to Supabase
- **WHEN** the app initializes the Supabase client
- **THEN** the client can make authenticated requests to the Supabase project

### Requirement: Database schema — meals table
The database SHALL have a `meals` table with columns: `id` (uuid PK), `user_id` (references auth.users), `name` (text, not null), `photo_url` (text), `time_category` (text), `recipe` (text), `has_protein` (boolean), `has_vegetables` (boolean), `has_fruit` (boolean), `has_grains` (boolean), `is_archived` (boolean), `suggested_by` (text), `created_at` (timestamp), `last_made_at` (timestamp), `times_made` (integer).

#### Scenario: Meals table exists with correct schema
- **WHEN** the schema SQL is applied to Supabase
- **THEN** the `meals` table exists with all specified columns and types

### Requirement: Database schema — meal_ingredients table
The database SHALL have a `meal_ingredients` table with columns: `id` (uuid PK), `meal_id` (references meals), `ingredient_name` (text, not null), `quantity` (text), `created_at` (timestamp).

#### Scenario: Meal ingredients table exists
- **WHEN** the schema SQL is applied
- **THEN** the `meal_ingredients` table exists with a foreign key to `meals`

### Requirement: Database schema — inventory_items table
The database SHALL have an `inventory_items` table with columns: `id` (uuid PK), `user_id` (references auth.users), `name` (text, not null), `quantity` (text), `category` (text), `confidence_level` (text, default 'certain'), `added_at` (timestamp), `updated_at` (timestamp).

#### Scenario: Inventory items table exists
- **WHEN** the schema SQL is applied
- **THEN** the `inventory_items` table exists with all specified columns

### Requirement: Database schema — meal_history table
The database SHALL have a `meal_history` table with columns: `id` (uuid PK), `user_id` (references auth.users), `meal_id` (references meals), `logged_at` (timestamp).

#### Scenario: Meal history table exists
- **WHEN** the schema SQL is applied
- **THEN** the `meal_history` table exists with foreign keys to `auth.users` and `meals`

### Requirement: Database indexes
The database SHALL have indexes on: `meals(user_id)`, `meals(is_archived)`, `inventory_items(user_id)`, `meal_history(user_id)`, `meal_history(logged_at)`.

#### Scenario: Indexes improve query performance
- **WHEN** the schema SQL is applied
- **THEN** all specified indexes exist on the respective tables

### Requirement: Row Level Security policies
All tables SHALL have RLS enabled. Each table SHALL have policies that restrict data access to the authenticated user's own rows (`auth.uid() = user_id`). The `meal_ingredients` table SHALL allow access based on ownership of the parent meal.

#### Scenario: User can only access own data
- **WHEN** an authenticated user queries the `meals` table
- **THEN** only rows where `user_id` matches the authenticated user's ID are returned

#### Scenario: Unauthenticated access is denied
- **WHEN** an unauthenticated request queries any table
- **THEN** the request returns zero rows
