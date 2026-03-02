-- Fix: "new row violates row-level security policy for table webinar_registrations"
-- When the user is logged in, the client uses the authenticated role. Only anon had a
-- policy, so authenticated inserts were blocked. This adds policies for authenticated.
--
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query

-- Allow authenticated users to insert (Register Now form works when logged in)
drop policy if exists "Allow authenticated insert webinar" on public.webinar_registrations;
create policy "Allow authenticated insert webinar"
  on public.webinar_registrations for insert to authenticated with check (true);

-- Allow authenticated users to update (e.g. payment_proof_url after upload)
drop policy if exists "Allow authenticated update webinar" on public.webinar_registrations;
create policy "Allow authenticated update webinar"
  on public.webinar_registrations for update to authenticated using (true) with check (true);

-- Optional: allow authenticated to select (e.g. to confirm registration)
drop policy if exists "Allow authenticated select webinar" on public.webinar_registrations;
create policy "Allow authenticated select webinar"
  on public.webinar_registrations for select to authenticated using (true);
