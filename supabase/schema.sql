-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('client', 'creative', 'admin')) default 'client',
  company_name text,
  current_level integer default 1 check (current_level between 1 and 5),
  business_type text,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. Projects Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) not null,
  title text not null,
  status text check (status in ('planning', 'production', 'review', 'approved', 'completed')) default 'planning',
  deadline timestamp with time zone,
  department text check (department in ('video', 'design', 'web', 'marketing', 'other')),
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable RLS for Projects
alter table public.projects enable row level security;

create policy "Clients can view their own projects" on public.projects
  for select using (auth.uid() = client_id);

-- 3. Deliverables Table
create table public.deliverables (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  file_url text not null,
  version integer default 1,
  status text check (status in ('pending_review', 'changes_requested', 'approved')) default 'pending_review',
  feedback jsonb default '[]'::jsonb, -- Array of comments
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Enable RLS for Deliverables
alter table public.deliverables enable row level security;

create policy "Clients can view deliverables of their projects" on public.deliverables
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = deliverables.project_id
      and projects.client_id = auth.uid()
    )
  );

-- 4. Metrics Snapshots
create table public.metrics_snapshots (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) not null,
  platform text not null, -- 'instagram', 'website', etc.
  followers integer,
  engagement_rate decimal,
  snapshot_date date default current_date
);

-- Enable RLS for Metrics
alter table public.metrics_snapshots enable row level security;

create policy "Clients can view their own metrics" on public.metrics_snapshots
  for select using (auth.uid() = client_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (For Demo)
-- Note: In production, use real UUIDs from auth.users
-- This is just to illustrate structure.

-- 5. Update Projects Table for new UI requirements
alter table public.projects 
add column if not exists type text check (type in ('video', 'design', 'audio', 'web')),
add column if not exists author text default 'Equipo DIIC';

-- Function to seed demo data (Manual call required or use dashboard)
-- insert into public.projects (client_id, title, status, type, author)
-- values 
-- ('CLIENT_UUID_HERE', 'Reel: Lanzamiento V2', 'review', 'video', 'Sarah'),
-- ('CLIENT_UUID_HERE', 'Carrusel Educativo: Tips IA', 'approved', 'design', 'Alex');
