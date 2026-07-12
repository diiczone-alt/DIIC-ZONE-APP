-- Migration: 008_client_financial_sheet.sql
-- Description: Add financial_sheet column to clients, insert initial goal, and migrate existing clients' financial data.

ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS financial_sheet JSONB DEFAULT '{
  "production_monthly": {
    "shoots": 0,
    "reels": 0,
    "tiktok": 0,
    "vid_corp": 0,
    "photos": 0,
    "designs": 0,
    "stories": 0,
    "cm": false,
    "ads": false
  },
  "costs_internal": {
    "design": 0,
    "editing": 0,
    "production": 0,
    "cm": 0,
    "transport": 0,
    "others": 0
  }
}'::jsonb;

-- Insert initial financial goal if it doesn't exist (using correct check constraints)
INSERT INTO public.financial_goals (id, name, target_amount, deadline, priority, status, created_at)
SELECT 
  'a2a5ef52-32a2-4a34-b258-854737d97602'::uuid,
  'Meta de Facturación Mensual',
  5750.00,
  '2026-12-31'::date,
  'High',
  'pending',
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.financial_goals WHERE name = 'Meta de Facturación Mensual'
);

-- Seed / Migrate existing clients to have reasonable default values based on their plans
UPDATE public.clients
SET financial_sheet = jsonb_build_object(
  'production_monthly', jsonb_build_object(
    'shoots', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      WHEN plan ILIKE '%presencia%' OR plan ILIKE '%basic%' THEN 4 
      WHEN plan ILIKE '%crecimiento%' OR plan ILIKE '%estrategia%' THEN 6 
      WHEN plan ILIKE '%autoridad%' OR plan ILIKE '%premium%' THEN 8 
      WHEN plan ILIKE '%control%' THEN 12 
      ELSE 4 
    END,
    'reels', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      WHEN plan ILIKE '%presencia%' OR plan ILIKE '%basic%' THEN 12 
      WHEN plan ILIKE '%crecimiento%' OR plan ILIKE '%estrategia%' THEN 16 
      WHEN plan ILIKE '%autoridad%' OR plan ILIKE '%premium%' THEN 24 
      WHEN plan ILIKE '%control%' THEN 32 
      ELSE 12 
    END,
    'tiktok', 0,
    'vid_corp', 0,
    'photos', 0,
    'designs', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      WHEN plan ILIKE '%presencia%' OR plan ILIKE '%basic%' THEN 8 
      WHEN plan ILIKE '%crecimiento%' OR plan ILIKE '%estrategia%' THEN 12 
      WHEN plan ILIKE '%autoridad%' OR plan ILIKE '%premium%' THEN 18 
      WHEN plan ILIKE '%control%' THEN 24 
      ELSE 8 
    END,
    'stories', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      ELSE 30 
    END,
    'cm', CASE WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN false ELSE true END,
    'ads', false
  ),
  'costs_internal', jsonb_build_object(
    -- Auto-calculate estimated internal costs using standard rates:
    -- design: designs * $2.50
    -- editing: reels * $5.00
    -- production: shoots * $50.00
    -- cm: CM is $150.00 (junior CM)
    -- transport: $20.00
    -- others: $10.00
    'design', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      WHEN plan ILIKE '%presencia%' OR plan ILIKE '%basic%' THEN 8 * 2.50
      WHEN plan ILIKE '%crecimiento%' OR plan ILIKE '%estrategia%' THEN 12 * 2.50
      WHEN plan ILIKE '%autoridad%' OR plan ILIKE '%premium%' THEN 18 * 2.50
      WHEN plan ILIKE '%control%' THEN 24 * 2.50
      ELSE 8 * 2.50 
    END,
    'editing', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      WHEN plan ILIKE '%presencia%' OR plan ILIKE '%basic%' THEN 12 * 5.00
      WHEN plan ILIKE '%crecimiento%' OR plan ILIKE '%estrategia%' THEN 16 * 5.00
      WHEN plan ILIKE '%autoridad%' OR plan ILIKE '%premium%' THEN 24 * 5.00
      WHEN plan ILIKE '%control%' THEN 32 * 5.00
      ELSE 12 * 5.00 
    END,
    'production', CASE 
      WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 
      WHEN plan ILIKE '%presencia%' OR plan ILIKE '%basic%' THEN 4 * 50.00
      WHEN plan ILIKE '%crecimiento%' OR plan ILIKE '%estrategia%' THEN 6 * 50.00
      WHEN plan ILIKE '%autoridad%' OR plan ILIKE '%premium%' THEN 8 * 50.00
      WHEN plan ILIKE '%control%' THEN 12 * 50.00
      ELSE 4 * 50.00 
    END,
    'cm', CASE WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 ELSE 150.00 END,
    'transport', CASE WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 ELSE 20.00 END,
    'others', CASE WHEN plan ILIKE '%solo app%' OR plan ILIKE '%solo uso%' THEN 0 ELSE 10.00 END
  )
)
WHERE financial_sheet IS NULL OR (financial_sheet->'production_monthly'->>'reels')::int = 0;
