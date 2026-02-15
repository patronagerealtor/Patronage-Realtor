-- Create property_listings table for DataEntry (add, edit, delete)
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  location text default '',
  price text default '',
  beds int default 0,
  baths int default 0,
  sqft text default '',
  status text default 'For Sale',
  description text,
  images jsonb default '[]',
  amenities jsonb default '[]',
  highlights jsonb default '[]',
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table public.property_listings enable row level security;

-- Allow public read (anon key can select)
create policy "Allow public read" on public.property_listings
  for select using (true);

-- Allow public insert (anon key can insert)
create policy "Allow public insert" on public.property_listings
  for insert with check (true);

-- Allow public update (anon key can update)
create policy "Allow public update" on public.property_listings
  for update using (true);

-- Allow public delete (anon key can delete)
create policy "Allow public delete" on public.property_listings
  for delete using (true);
