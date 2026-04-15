-- Migration: 005_commercial_roi_setup.sql
-- Description: Schema for Connectivity Commercial Module (Sales & ROI)

-- 1. COMMERCIAL SALES
-- Records actual revenue events to calculate true ROI
CREATE TABLE IF NOT EXISTS commercial_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    details TEXT NOT NULL, -- "Venta Paquete Mensual", "Consulta", etc.
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    sale_date TIMESTAMPTZ DEFAULT NOW(),
    source VARCHAR(50) NOT NULL, -- 'META_ADS', 'ORGANIC', 'WHATSAPP', 'REFERRAL', 'WEBSITE'
    status VARCHAR(50) DEFAULT 'COMPLETED', -- 'PENDING', 'COMPLETED', 'REFUNDED'
    lead_id UUID, -- Optional link to CRM lead if available
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL, -- Attribution to specific campaign
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROI METRICS (AGGREGATED)
-- Daily snapshots of financial health
CREATE TABLE IF NOT EXISTS roi_metrics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_ad_spend DECIMAL(10,2) DEFAULT 0, -- Pulled from Meta Ads
    total_sales_count INT DEFAULT 0,
    roi_percentage DECIMAL(10,2), -- (Revenue - Spend) / Spend * 100
    roas DECIMAL(10,2), -- Revenue / Spend
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_commercial_sales_user ON commercial_sales(user_id);
CREATE INDEX idx_commercial_sales_source ON commercial_sales(source);
CREATE INDEX idx_roi_metrics_date ON roi_metrics_daily(date);
