-- =============================================================================
-- Fix: "insert or update on table user_profiles violates foreign key constraint
--       user_profiles_id_fkey"
-- =============================================================================
-- The FK links user_profiles.id to auth.users(id). If the app upserts a profile
-- before the new user is fully visible, the insert can fail. This trigger
-- creates a user_profiles row as soon as a user is created in auth.users, so
-- the app's upsert becomes an UPDATE and no longer hits the FK on insert.
--
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query). Run the
-- entire file once; the app will call ensure_user_profile() on FK error to
-- create the row and retry.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Idempotent: drop if exists then create (Supabase allows triggers on auth.users)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- One-time backfill: create user_profiles for any auth.users that don't have one yet
-- (e.g. users who signed up before this trigger existed). Run once.
insert into public.user_profiles (id)
select id from auth.users
where id not in (select id from public.user_profiles)
on conflict (id) do nothing;

-- =============================================================================
-- RPC: Ensures the current user has a user_profiles row (fixes FK without trigger).
-- Call from the app on FK error so the row is created then upsert can retry.
-- =============================================================================
create or replace function public.ensure_user_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id)
  values (auth.uid())
  on conflict (id) do nothing;
end;
$$;

-- Allow authenticated users to call it (they can only create their own row via auth.uid())
grant execute on function public.ensure_user_profile() to authenticated;

-- =============================================================================
-- RPC: Upsert current user's profile using auth.uid() (avoids FK and 409 issues).
-- Call this from the app instead of direct table upsert.
-- =============================================================================
create or replace function public.upsert_my_profile(
  p_phone text default null,
  p_full_name text default null,
  p_email text default null,
  p_avatar_url text default null,
  p_purpose_of_visit text default null
)
returns setof public.user_profiles
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  insert into public.user_profiles (id, phone, full_name, email, avatar_url, purpose_of_visit, updated_at)
  values (auth.uid(), nullif(trim(p_phone), ''), nullif(trim(p_full_name), ''), nullif(trim(p_email), ''), nullif(trim(p_avatar_url), ''), nullif(trim(p_purpose_of_visit), ''), now())
  on conflict (id) do update set
    phone = coalesce(nullif(trim(excluded.phone), ''), user_profiles.phone),
    full_name = coalesce(nullif(trim(excluded.full_name), ''), user_profiles.full_name),
    email = coalesce(nullif(trim(excluded.email), ''), user_profiles.email),
    avatar_url = coalesce(nullif(trim(excluded.avatar_url), ''), user_profiles.avatar_url),
    purpose_of_visit = coalesce(nullif(trim(excluded.purpose_of_visit), ''), user_profiles.purpose_of_visit),
    updated_at = excluded.updated_at
  returning *;
end;
$$;

grant execute on function public.upsert_my_profile(text, text, text, text, text) to authenticated;
