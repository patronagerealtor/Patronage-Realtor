-- Create webinar_registrations table for Webinar page (Register Now form)
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query

create table if not exists public.webinar_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  contact_number text not null,
  payment_proof_url text,
  created_at timestamptz default now()
);

-- If table already exists without payment_proof_url, run:
-- alter table public.webinar_registrations add column if not exists payment_proof_url text;

-- Option A: Disable RLS so the form (anon key) can insert. You can still view data in Dashboard.
alter table public.webinar_registrations disable row level security;

-- Option B (only if you want RLS on): Enable RLS and add policies.
-- alter table public.webinar_registrations enable row level security;
-- drop policy if exists "Allow anonymous insert" on public.webinar_registrations;
-- create policy "Allow anonymous insert" on public.webinar_registrations
--   for insert to anon with check (true);
-- drop policy if exists "Allow read for authenticated" on public.webinar_registrations;
-- create policy "Allow read for authenticated" on public.webinar_registrations
--   for select using (auth.role() = 'authenticated' or auth.role() = 'service_role');
