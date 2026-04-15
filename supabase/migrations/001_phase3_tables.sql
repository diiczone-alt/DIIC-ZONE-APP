-- Phase 3 Schema Expansion

-- 1. Social Media Connections
-- Stores linked accounts and their latest cached stats
create table public.social_connections (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('instagram', 'facebook', 'tiktok', 'youtube')),
  handle text, -- username or channel name
  connected_at timestamp with time zone default now(),
  stats jsonb default '{}'::jsonb, -- Store followers, views, engagement freely
  unique(profile_id, platform)
);

create policy "Users can view own social connections" on public.social_connections
  for select using (auth.uid() = profile_id);

create policy "Users can update own social connections" on public.social_connections
  for all using (auth.uid() = profile_id);


-- 2. Content Pipeline (Extensions to projects or separate table?)
-- Let's create a dedicated table for granular content pieces aka "The Pipeline"
create table public.content_items (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade, -- Optional, can be standalone
  client_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text check (type in ('reel', 'post', 'story', 'video', 'design', 'photo')) not null,
  status text check (status in ('draft', 'editing', 'approval', 'scheduled', 'published')) default 'draft',
  
  -- Workflow Steps Tracking (Boolean flags or timestamps for the stepper)
  step_editing_done boolean default false,
  step_approval_done boolean default false,
  step_copy_done boolean default false,
  
  scheduled_date date,
  tags text[], -- e.g. ['campaign', 'promo']
  
  thumbnail_url text,
  file_url text, -- Link to final asset
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create policy "Users can view own content items" on public.content_items
  for select using (auth.uid() = client_id);

create policy "Users can update own content items" on public.content_items
  for all using (auth.uid() = client_id);


-- 3. File Categorization Extensions
-- We can add metadata to the storage objects table, but usually it's cleaner to have a reference table
-- Or we just use the existing 'deliverables' table but enhance it.
-- Let's Enhance 'deliverables' from Phase 1 if it exists, or create a 'project_files' table.
-- Checking previous schema... 'deliverables' existed. Let's add columns to it.

alter table public.deliverables 
add column if not exists category text check (category in ('logo', 'raw', 'publicidad', 'docs', 'final')),
add column if not exists month_folder text; -- Store "Enero", "Febrero" for easy grouping

-- 4. Notifications (for the 'Date Updated' logic)
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text,
  type text check (type in ('info', 'success', 'warning', 'error')) default 'info',
  read boolean default false,
  created_at timestamp with time zone default now()
);

create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
