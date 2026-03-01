-- Create the reels table (run in Supabase Dashboard → SQL Editor → New query)
-- Fixes: "Could not find the table 'public.reels' in the schema cache"

create table if not exists public.reels (
  id text primary key,
  project_name text not null default '',
  config text default '',
  location text default '',
  instagram_url text default '',
  video_path text not null default '',
  cloudinary_version text,
  price text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table public.reels enable row level security;

drop policy if exists "Allow anon read reels" on public.reels;
drop policy if exists "Allow anon all for migration reels" on public.reels;
create policy "Allow anon read reels" on public.reels for select to anon using (true);
create policy "Allow anon all for migration reels" on public.reels for all to anon using (true) with check (true);

-- Optional: seed reels (run after creating the table)
-- Use full URLs for immediate playback, or use your Cloudinary public_id (e.g. reels/canary) once uploaded
insert into public.reels (id, project_name, config, location, instagram_url, video_path, price, sort_order)
values
  ('1', 'Ram Smruti', '4 BHK', 'Aundh, Pune', 'https://www.instagram.com/reel/DUiOYhEjJYv/', 'https://res.cloudinary.com/demo/video/upload/rafting', null, 0),
  ('2', 'Premium Residences', '3 BHK', 'Baner, Pune', 'https://www.instagram.com/reel/DC9bKzZPkdq/', 'https://res.cloudinary.com/demo/video/upload/snow_horses', '₹1.2 Cr', 1),
  ('3', 'Luxury Tour', '5 BHK', 'Koregaon Park', 'https://www.instagram.com/reel/DC9bKzZPkdq/', 'https://res.cloudinary.com/demo/video/upload/sea_turtle', '₹3.5 Cr', 2)
on conflict (id) do update set
  project_name = excluded.project_name,
  config = excluded.config,
  location = excluded.location,
  instagram_url = excluded.instagram_url,
  video_path = excluded.video_path,
  price = excluded.price,
  sort_order = excluded.sort_order;
