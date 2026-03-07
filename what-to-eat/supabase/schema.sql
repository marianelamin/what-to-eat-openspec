-- What To Eat — Database Schema
-- Run this in the Supabase SQL Editor to create all tables and indexes.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

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
  suggested_by text,
  created_at timestamp with time zone default now(),
  last_made_at timestamp with time zone,
  times_made integer default 0
);

-- meal_ingredients
create table meal_ingredients (
  id uuid primary key default uuid_generate_v4(),
  meal_id uuid references meals on delete cascade not null,
  ingredient_name text not null,
  quantity text,
  created_at timestamp with time zone default now()
);

-- inventory_items
create table inventory_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  quantity text,
  category text, -- 'protein', 'vegetable', 'pantry', etc.
  confidence_level text default 'certain', -- 'certain', 'probable', 'uncertain'
  added_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- meal_history
create table meal_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  meal_id uuid references meals on delete cascade not null,
  logged_at timestamp with time zone default now()
);

-- Indexes
create index meals_user_id_idx on meals(user_id);
create index meals_archived_idx on meals(is_archived);
create index inventory_user_id_idx on inventory_items(user_id);
create index history_user_id_idx on meal_history(user_id);
create index history_logged_at_idx on meal_history(logged_at);
