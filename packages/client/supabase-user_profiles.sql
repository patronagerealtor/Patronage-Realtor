-- =============================================================================
-- REQUIRED: Create user_profiles table (name, email, phone for signed-in users)
-- =============================================================================
-- Without this table you will get: "Could not find the table 'public.user_profiles' in the schema cache"
--
-- How to run:
-- 1. Open https://supabase.com/dashboard → your project → SQL Editor
-- 2. Paste this entire file and click "Run"
-- =============================================================================

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.user_profiles enable row level security;

-- Users can read their own profile
create policy "Users can select own profile"
  on public.user_profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can insert their own profile (e.g. on first sign-in)
create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Optional: service role or admin can read all for Data Entry / admin views
-- create policy "Service role can select all"
--   on public.user_profiles for select to service_role using (true);
