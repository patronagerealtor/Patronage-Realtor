# Webinar payment proof storage

The Register flow uploads payment screenshots to Supabase Storage and saves the URL in `webinar_registrations.payment_proof_url`.

## 1. Add column (if table already exists)

In **SQL Editor** run:

```sql
alter table public.webinar_registrations add column if not exists payment_proof_url text;
```

## 2. Create storage bucket

1. In Supabase go to **Storage** in the sidebar.
2. Click **New bucket**.
3. Name: `webinar-payment-proofs`.
4. **Public bucket**: turn **ON** (so the app can get public URLs for uploaded images).
5. Click **Create bucket**.

## 3. Allow anonymous uploads

1. Open the bucket `webinar-payment-proofs`.
2. Go to **Policies** (or **New policy**).
3. Add a policy:
   - **Policy name:** Allow anon upload
   - **Allowed operation:** INSERT
   - **Target roles:** anon (or “All roles”)
   - **Policy definition:** `true` (or leave default)

Or in **SQL Editor** run:

```sql
insert into storage.buckets (id, name, public) values ('webinar-payment-proofs', 'webinar-payment-proofs', true) on conflict (id) do update set public = true;

create policy "Allow anon upload" on storage.objects for insert to anon with check (bucket_id = 'webinar-payment-proofs');
```

After this, the upload from the Webinar page will work and the image URL will be stored in `webinar_registrations.payment_proof_url`.
