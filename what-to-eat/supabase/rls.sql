-- What To Eat — Row Level Security Policies
-- Run this in the Supabase SQL Editor AFTER schema.sql.

-- Enable RLS on all tables
alter table meals enable row level security;
alter table meal_ingredients enable row level security;
alter table inventory_items enable row level security;
alter table meal_history enable row level security;

-- meals: users can only access their own meals
create policy "Users can view own meals"
  on meals for select using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on meals for insert with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on meals for update using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on meals for delete using (auth.uid() = user_id);

-- meal_ingredients: access based on parent meal ownership
create policy "Users can view ingredients of own meals"
  on meal_ingredients for select
  using (exists (
    select 1 from meals where meals.id = meal_ingredients.meal_id and meals.user_id = auth.uid()
  ));

create policy "Users can insert ingredients for own meals"
  on meal_ingredients for insert
  with check (exists (
    select 1 from meals where meals.id = meal_ingredients.meal_id and meals.user_id = auth.uid()
  ));

create policy "Users can update ingredients of own meals"
  on meal_ingredients for update
  using (exists (
    select 1 from meals where meals.id = meal_ingredients.meal_id and meals.user_id = auth.uid()
  ));

create policy "Users can delete ingredients of own meals"
  on meal_ingredients for delete
  using (exists (
    select 1 from meals where meals.id = meal_ingredients.meal_id and meals.user_id = auth.uid()
  ));

-- inventory_items: users can only access their own inventory
create policy "Users can view own inventory"
  on inventory_items for select using (auth.uid() = user_id);

create policy "Users can insert own inventory"
  on inventory_items for insert with check (auth.uid() = user_id);

create policy "Users can update own inventory"
  on inventory_items for update using (auth.uid() = user_id);

create policy "Users can delete own inventory"
  on inventory_items for delete using (auth.uid() = user_id);

-- meal_history: users can only access their own history
create policy "Users can view own history"
  on meal_history for select using (auth.uid() = user_id);

create policy "Users can insert own history"
  on meal_history for insert with check (auth.uid() = user_id);

create policy "Users can update own history"
  on meal_history for update using (auth.uid() = user_id);

create policy "Users can delete own history"
  on meal_history for delete using (auth.uid() = user_id);
