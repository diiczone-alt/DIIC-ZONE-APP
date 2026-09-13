-- Migration 013: Add CM Niche Affinity, Secondary Profession, Quiz Score & Approval Status
ALTER TABLE public.team 
ADD COLUMN IF NOT EXISTS niche_affinities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS secondary_profession TEXT,
ADD COLUMN IF NOT EXISTS onboarding_quiz_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'active';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS niche_affinities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS secondary_profession TEXT,
ADD COLUMN IF NOT EXISTS onboarding_quiz_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'active';
