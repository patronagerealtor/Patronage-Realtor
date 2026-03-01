-- =============================================================================
-- FIX: Properties visible when logged out, empty when logged in
-- =============================================================================
-- When you're signed in, Supabase uses role "authenticated". Your RLS only
-- allowed "anon" to read, so authenticated users see no properties.
-- Run this in Supabase Dashboard → SQL Editor → Run
-- =============================================================================

-- Properties (main list)
drop policy if exists "Allow authenticated read properties" on public.properties;
create policy "Allow authenticated read properties"
  on public.properties for select to authenticated using (true);

-- Property images (for property cards)
drop policy if exists "Allow authenticated read property_images" on public.property_images;
create policy "Allow authenticated read property_images"
  on public.property_images for select to authenticated using (true);

-- Property amenities (junction + amenities relation)
drop policy if exists "Allow authenticated read property_amenities" on public.property_amenities;
create policy "Allow authenticated read property_amenities"
  on public.property_amenities for select to authenticated using (true);

-- Amenities (referenced by property_amenities)
drop policy if exists "Allow authenticated read amenities" on public.amenities;
create policy "Allow authenticated read amenities"
  on public.amenities for select to authenticated using (true);
