-- =============================================================================
-- Supabase: Create all tables
-- =============================================================================
-- Property id is text (e.g. UUID or custom id). Run in Supabase: SQL Editor → New query → Paste → Run.
-- If you already ran an older version with uuid ids, run the DROP block below first.
-- =============================================================================

-- If you already created tables with uuid and got "invalid input syntax for type uuid":
-- uncomment and run the next 6 lines once, then run the rest.
-- DROP TABLE IF EXISTS public.property_amenities CASCADE;
-- DROP TABLE IF EXISTS public.property_images CASCADE;
-- DROP TABLE IF EXISTS public.contact_leads CASCADE;
-- DROP TABLE IF EXISTS public.properties CASCADE;
-- DROP TABLE IF EXISTS public.webinar_registrations CASCADE;
-- DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;

-- 1. Amenities (id = text from Firestore)
create table if not exists public.amenities (
  id text primary key,
  name text not null default '',
  icon text default ''
);
alter table public.amenities enable row level security;
create policy "Allow anon all for migration" on public.amenities for all to anon using (true) with check (true);
create policy "Allow authenticated read amenities" on public.amenities for select to authenticated using (true);

-- 2. Properties (id = text, Firestore doc id is 20-char not uuid)
create table if not exists public.properties (
  id text primary key,
  title text not null default '',
  location text default '',
  address text,
  developer text,
  property_type text,
  beds int,
  baths int,
  sqft text,
  construction_status text,
  created_at timestamptz default now(),
  city text,
  possession_date text,
  bhk_type text,
  possession_by text,
  latitude double precision,
  longitude double precision,
  google_map_link text,
  price_value double precision,
  price_min double precision,
  price_max double precision,
  slug text,
  description text,
  rera_applicable boolean default false,
  rera_number text
);
alter table public.properties enable row level security;
create policy "Allow anon all for migration" on public.properties for all to anon using (true) with check (true);
create policy "Allow authenticated read properties" on public.properties for select to authenticated using (true);

-- 3. Property images (image_url = Cloudinary URL)
create table if not exists public.property_images (
  id bigserial primary key,
  property_id text not null references public.properties(id) on delete cascade,
  image_url text not null default '',
  sort_order int not null default 0
);
alter table public.property_images enable row level security;
create policy "Allow anon all for migration" on public.property_images for all to anon using (true) with check (true);

-- 4. Property amenities (junction)
create table if not exists public.property_amenities (
  property_id text not null references public.properties(id) on delete cascade,
  amenity_id text not null references public.amenities(id) on delete cascade,
  primary key (property_id, amenity_id)
);
alter table public.property_amenities enable row level security;
create policy "Allow anon all for migration" on public.property_amenities for all to anon using (true) with check (true);
create policy "Allow authenticated read property_amenities" on public.property_amenities for select to authenticated using (true);

-- 5. Contact leads (id = text from Firestore)
create table if not exists public.contact_leads (
  id text primary key,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  property_id text references public.properties(id) on delete set null,
  property_title text not null default '',
  lead_type text default 'site_visit',
  created_at timestamptz default now()
);
alter table public.contact_leads enable row level security;
create policy "Allow anon all for migration" on public.contact_leads for all to anon using (true) with check (true);

-- 6. Webinar registrations (id = text from Firestore)
create table if not exists public.webinar_registrations (
  id text primary key,
  name text not null default '',
  email text not null default '',
  contact_number text not null default '',
  payment_proof_url text,
  created_at timestamptz default now()
);
alter table public.webinar_registrations enable row level security;
create policy "Allow anon all for migration" on public.webinar_registrations for all to anon using (true) with check (true);

-- 7. Newsletter subscribers (id = text from Firestore)
create table if not exists public.newsletter_subscribers (
  id text primary key,
  email text not null unique,
  created_at timestamptz default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy "Allow anon all for migration" on public.newsletter_subscribers for all to anon using (true) with check (true);

-- 8. User profiles (id = uuid, references auth.users; migration may skip if no matching auth users)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.user_profiles enable row level security;
create policy "Allow anon all for migration" on public.user_profiles for all to anon using (true) with check (true);
-- Authenticated users can read/insert/update their own profile (required for sign-in profile form)
create policy "Users can select own profile" on public.user_profiles for select to authenticated using (auth.uid() = id);
create policy "Users can insert own profile" on public.user_profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile" on public.user_profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
