-- Add purpose_of_visit to user_profiles (post-login form). Run in Supabase SQL Editor.
alter table public.user_profiles
  add column if not exists purpose_of_visit text;

comment on column public.user_profiles.purpose_of_visit is 'Single or comma-separated: Real Estate Consultation, Interior Consultation, Both / Multiple';
