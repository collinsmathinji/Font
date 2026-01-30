-- =============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR (creates fonts + popular_pairings tables)
-- Dashboard → Your project → SQL Editor → New query → Paste this → Run
-- =============================================================================

create table if not exists public.fonts (
  family text primary key,
  category text not null check (category in ('sans-serif', 'serif', 'display', 'handwriting', 'monospace')),
  weights integer[] not null default '{400}',
  foundry text not null default 'Google Fonts',
  foundry_slug text not null default 'google-fonts',
  designers text[] default '{}',
  legibility text not null default 'high' check (legibility in ('high', 'medium', 'low')),
  popularity integer not null default 0,
  trending integer not null default 0,
  date_added text,
  last_modified text,
  classifications text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_fonts_foundry_slug on public.fonts (foundry_slug);
create index if not exists idx_fonts_category on public.fonts (category);
create index if not exists idx_fonts_popularity on public.fonts (popularity desc);
create index if not exists idx_fonts_family_lower on public.fonts (lower(family));

create table if not exists public.popular_pairings (
  id uuid primary key default gen_random_uuid(),
  header_family text not null references public.fonts(family) on delete cascade,
  body_family text not null references public.fonts(family) on delete cascade,
  sort_order integer not null default 0,
  unique(header_family, body_family)
);
create index if not exists idx_popular_pairings_order on public.popular_pairings (sort_order);

alter table public.fonts enable row level security;
alter table public.popular_pairings enable row level security;

create policy "Allow public read on fonts"
  on public.fonts for select
  using (true);

create policy "Allow public read on popular_pairings"
  on public.popular_pairings for select
  using (true);
