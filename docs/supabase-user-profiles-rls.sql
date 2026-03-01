-- =============================================================================
-- Fix: "new row violates row-level security policy for table user_profiles"
-- =============================================================================
-- When users are signed in, Supabase uses the "authenticated" role, not "anon".
-- You need policies for "authenticated" so users can insert/update their own row.
--
-- Run in Supabase Dashboard → SQL Editor → New query → Paste → Run
-- =============================================================================

-- Drop and recreate so this script is idempotent (run multiple times safely)
drop policy if exists "Users can select own profile" on public.user_profiles;
drop policy if exists "Users can insert own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;

create policy "Users can select own profile"
  on public.user_profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
