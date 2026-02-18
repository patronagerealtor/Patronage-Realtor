-- Fix "new row violates row-level security policy" when uploading payment proof
-- Run in Supabase: SQL Editor → New query → paste all → Run

-- 1) Create bucket via Dashboard first: Storage → New bucket → name "webinar-payment-proofs", Public ON.
-- 2) Then run this to allow the app (anon) to upload and overwrite:

-- Allow anon to INSERT new files
drop policy if exists "Allow anon upload payment proof" on storage.objects;
create policy "Allow anon upload payment proof"
  on storage.objects for insert to anon
  with check (bucket_id = 'webinar-payment-proofs');

-- Allow anon to UPDATE (required when using upsert: true)
drop policy if exists "Allow anon update payment proof" on storage.objects;
create policy "Allow anon update payment proof"
  on storage.objects for update to anon
  using (bucket_id = 'webinar-payment-proofs')
  with check (bucket_id = 'webinar-payment-proofs');

-- Allow anon to SELECT (needed for upsert / overwrite flow)
drop policy if exists "Allow anon select payment proof" on storage.objects;
create policy "Allow anon select payment proof"
  on storage.objects for select to anon
  using (bucket_id = 'webinar-payment-proofs');
