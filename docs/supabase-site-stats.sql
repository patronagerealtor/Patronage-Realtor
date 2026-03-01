-- Site stats for About Us page (Happy Clients, Properties Sold, Years Experience)
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.site_stats (
  id text primary key default 'default',
  happy_clients int not null default 1000,
  properties_sold int not null default 500,
  years_experience int not null default 4,
  updated_at timestamptz default now()
);

alter table public.site_stats enable row level security;

drop policy if exists "Allow anon read site_stats" on public.site_stats;
drop policy if exists "Allow anon update site_stats" on public.site_stats;
drop policy if exists "Allow anon insert site_stats" on public.site_stats;
create policy "Allow anon read site_stats" on public.site_stats for select to anon using (true);
create policy "Allow anon update site_stats" on public.site_stats for update to anon using (true) with check (true);
create policy "Allow anon insert site_stats" on public.site_stats for insert to anon with check (true);

-- Single row. For live updates: Supabase Dashboard → Database → Replication → enable for site_stats.
insert into public.site_stats (id, happy_clients, properties_sold, years_experience)
values ('default', 1000, 500, 4)
on conflict (id) do nothing;
