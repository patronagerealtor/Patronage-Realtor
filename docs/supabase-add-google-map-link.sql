-- Add google_map_link column to properties table (optional, for Maps embed).
-- Run in Supabase SQL Editor. Keeps latitude/longitude unchanged.

alter table public.properties
  add column if not exists google_map_link text default null;

comment on column public.properties.google_map_link is 'Google Maps embed URL (iframe src). Optional.';
