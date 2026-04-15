-- Migration for Phase 2: Community Manager & Goals

-- 1. Create Posts Table (Calendar Content)
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) not null,
  title text not null, -- "Idea: Reel sobre IA"
  content text, -- Brief or caption
  platform text check (platform in ('instagram', 'linkedin', 'tiktok', 'youtube', 'blog', 'other')),
  scheduled_date timestamp with time zone,
  status text check (status in ('idea', 'design', 'review', 'approved', 'published')) default 'idea',
  media_url text, -- Link to final asset
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable RLS for Posts
alter table public.posts enable row level security;

create policy "Clients can view their own posts" on public.posts
  for select using (auth.uid() = client_id);

create policy "Clients can update their own posts" on public.posts
  for all using (auth.uid() = client_id);

-- 2. Create Goals Table (Monthly Objectives)
create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) not null,
  month text not null, -- "YYYY-MM" format e.g. "2026-01"
  metric_name text not null, -- "Followers", "Leads", "Sales"
  target_value integer not null,
  current_value integer default 0,
  status text check (status in ('in_progress', 'achieved', 'missed')) default 'in_progress',
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable RLS for Goals
alter table public.goals enable row level security;

create policy "Clients can view their own goals" on public.goals
  for select using (auth.uid() = client_id);

create policy "Clients can update their own goals" on public.goals
  for all using (auth.uid() = client_id);
