-- =============================================================================
-- Supabase: Empty all tables
-- =============================================================================
-- Run in Supabase: SQL Editor → New query → Paste → Run
-- This will delete ALL data but preserve table structure
-- =============================================================================

-- Empty analytics tables first (due to foreign key dependencies)
TRUNCATE TABLE public.user_events CASCADE;
TRUNCATE TABLE public.session_summaries CASCADE;

-- Empty main application tables
TRUNCATE TABLE public.property_amenities CASCADE;
TRUNCATE TABLE public.property_images CASCADE;
TRUNCATE TABLE public.contact_leads CASCADE;
TRUNCATE TABLE public.webinar_registrations CASCADE;
TRUNCATE TABLE public.newsletter_subscribers CASCADE;
TRUNCATE TABLE public.user_profiles CASCADE;
TRUNCATE TABLE public.reels CASCADE;
TRUNCATE TABLE public.properties CASCADE;
TRUNCATE TABLE public.amenities CASCADE;

-- Reset identity sequences (if any)
-- ALTER SEQUENCE IF EXISTS user_events_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS session_summaries_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS property_images_id_seq RESTART WITH 1;

-- Confirmation message
SELECT 'All tables have been emptied successfully!' as status;
