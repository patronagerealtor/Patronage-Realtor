# Importing property details from Supabase

Property listings on the **Home** (Featured Properties) and **Properties** pages are loaded from your Supabase database when configured.

## DataEntry: Add, Edit, Delete properties

The **Admin Data Entry** page (`/data-entry`) supports full CRUD when linked to Supabase. It uses a dedicated table `property_listings`:

1. Run the SQL migration: open `docs/supabase-property-listings.sql` and execute it in Supabase Dashboard → SQL Editor.
2. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`.
3. Visit `/data-entry` to add, edit, or delete properties. Data is stored in Supabase.

If Supabase is not configured, DataEntry falls back to localStorage. The app **maps your schema** to the UI as follows:

| Your column            | Shown in app as     |
|------------------------|---------------------|
| `id`                   | id                  |
| `title`                | title               |
| `developer`            | location            |
| `bhk_type`             | beds & baths (e.g. "2 BHK" → 2) |
| `carpet_area`          | sqft (formatted)    |
| `construction_status`  | status              |
| `property_images` (cover/first) | card image   |
| *(no column)*         | price → "Price on request" |

**Optional:** Add a `price` column (e.g. `text` or `numeric`) to `properties` and we can show real prices instead of "Price on request".

## 1. Your existing schema

Your `properties` table with `bhk_enum`, `property_type_enum`, `construction_status_enum`, plus `property_images` and `amenities`, is supported. Ensure **RLS** allows the anon key to read:

```sql
alter table public.properties enable row level security;
create policy "Allow public read" on public.properties for select using (true);

alter table public.property_images enable row level security;
create policy "Allow public read" on public.property_images for select using (true);
```

Insert data as you did (e.g. `insert into properties (title, developer, bhk_type, carpet_area, property_type, construction_status, possession_by) values (...)`).

## 2. Get your Supabase URL and anon key

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Project Settings** (gear) → **API**.
3. Copy:
   - **Project URL** → use as `VITE_SUPABASE_URL`
   - **anon public** key → use as `VITE_SUPABASE_ANON_KEY`

## 3. Configure environment variables

In the **project root** (the `Patronage-Realtor` folder that contains `vite.config.ts` and `package.json`), create a `.env` file with **exactly** these names (Vite only exposes variables that start with `VITE_`):

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Use your real Project URL and anon key. **Restart the dev server** after adding or changing `.env` so the app picks them up.

## 4. Install dependencies and run

From the **Patronage-Realtor** app directory (the one with `package.json` that has `@supabase/supabase-js`):

```bash
npm install
npm run dev
```

- If **Supabase is configured** and the `properties` table has rows, the Home and Properties pages will show data from Supabase.
- If **Supabase is not configured** (missing or empty `.env`) or the table is empty, the app falls back to the built-in sample listings.

## 5. Different table or column names

- **Table name**: Edit `PROPERTIES_TABLE` in `client/src/lib/supabase.ts` (default is `"properties"`).
- **Column names**: If your columns differ (e.g. `bedrooms` instead of `beds`), either add a view in Supabase that maps to the expected names, or change the `select()` in `fetchPropertiesFromSupabase()` and the `PropertyRow` type in the same file to match your schema.

## 6. Optional: show real images

If you store image URLs in `image_url`, the UI can show them instead of placeholders by updating the card components to use `property.image_url` when present (e.g. `<img src={property.image_url} />` or your `PlaceholderImage` with a `src` prop). Supabase Storage URLs work as long as the bucket is public or you use signed URLs.
