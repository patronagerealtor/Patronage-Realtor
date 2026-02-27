-- Newsletter subscribers (Footer). Run this in Supabase SQL Editor.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Allow public insert (anonymous users can subscribe)
create policy "Allow public insert on newsletter_subscribers"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Allow public select (e.g. for "Already subscribed" check; optional – can be omitted if you only need insert)
create policy "Allow public select on newsletter_subscribers"
  on public.newsletter_subscribers
  for select
  to anon, authenticated
  using (true);
