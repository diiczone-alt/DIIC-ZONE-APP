-- Migration 014: Add last_seen_at to public.team and public.profiles for Realtime Presence Tracking

ALTER TABLE IF EXISTS public.team 
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_team_last_seen ON public.team (last_seen_at);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles (last_seen_at);
