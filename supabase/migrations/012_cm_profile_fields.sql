-- Migration: Add portfolio and specialty fields for CM and creative staff
-- Date: 2026-09-13

ALTER TABLE public.team ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.team ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.team ADD COLUMN IF NOT EXISTS specialty TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialty TEXT;
