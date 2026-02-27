-- Run this in Supabase SQL Editor to create contact_leads table and RLS policies.
-- No authentication; public insert and select as per requirements.

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  property_id uuid references public.properties(id) on delete cascade,
  property_title text not null,
  created_at timestamp with time zone default now()
);

alter table public.contact_leads enable row level security;

create policy "Allow public insert"
  on public.contact_leads
  for insert
  to public
  with check (true);

create policy "Allow public select"
  on public.contact_leads
  for select
  to public
  using (true);

create policy "Allow public delete"
  on public.contact_leads
  for delete
  to public
  using (true);
