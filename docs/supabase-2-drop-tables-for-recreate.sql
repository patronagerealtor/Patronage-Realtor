-- =============================================================================
-- One-time: drop tables that used uuid so you can recreate them with text id
-- =============================================================================
-- Run this ONCE in Supabase 2 SQL Editor if you already ran the old create script
-- and got "invalid input syntax for type uuid". Then run supabase-2-create-all-tables.sql again.
-- =============================================================================

DROP TABLE IF EXISTS public.property_amenities CASCADE;
DROP TABLE IF EXISTS public.property_images CASCADE;
DROP TABLE IF EXISTS public.contact_leads CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.webinar_registrations CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
