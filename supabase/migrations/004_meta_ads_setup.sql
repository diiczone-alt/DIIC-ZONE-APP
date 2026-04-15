-- Migration: 004_meta_ads_setup.sql
-- Description: Schema for Meta Ads Automated Growth System

-- 1. META CONNECTIONS
-- Stores tokens and linking info for each user's Meta Business account
CREATE TABLE IF NOT EXISTS meta_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id VARCHAR(255),
    ad_account_id VARCHAR(255),
    page_id VARCHAR(255),
    ig_account_id VARCHAR(255),
    whatsapp_business_id VARCHAR(255),
    access_token_encrypted TEXT NOT NULL, -- Should be encrypted at app level before storage
    token_expiry TIMESTAMPTZ,
    scopes_granted TEXT[],
    status VARCHAR(50) DEFAULT 'DISCONNECTED', -- ACTIVE, EXPIRED, REVOKED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. CAMPAIGNS
-- High level campaign container
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meta_campaign_id VARCHAR(255), -- External ID from Meta
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('FULL', 'BOOST')),
    objective VARCHAR(50) NOT NULL, -- SALES, LEADS, OUTING, etc.
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, PROCESSING, ACTIVE, PAUSED, COMPLETED, ERROR
    budget_daily DECIMAL(10,2),
    budget_total DECIMAL(10,2),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    destination_type VARCHAR(50), -- WHATSAPP, IG_DM, WEBSITE
    destination_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AD SETS
-- Defines targeting and placement
CREATE TABLE IF NOT EXISTS adsets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    meta_adset_id VARCHAR(255),
    name VARCHAR(255),
    targeting_json JSONB DEFAULT '{}', -- Geo, Age, Interests
    placements_json JSONB DEFAULT '{}', -- Feeds, Stories, Reels
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATIVES
-- The visual assets and copy
CREATE TABLE IF NOT EXISTS creatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    meta_creative_id VARCHAR(255),
    source_type VARCHAR(50), -- UPLOAD, EXISTING_POST, AI_GENERATED
    asset_url TEXT, -- URL to image/video
    thumbnail_url TEXT,
    post_id VARCHAR(255), -- If boosting existing post
    headline TEXT,
    body_text TEXT,
    call_to_action VARCHAR(50),
    approval_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADS
-- The actual ad instance connecting AdSet + Creative
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    adset_id UUID REFERENCES adsets(id) ON DELETE CASCADE,
    creative_id UUID REFERENCES creatives(id) ON DELETE CASCADE,
    meta_ad_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INSIGHTS DAILY
-- Performance metrics
CREATE TABLE IF NOT EXISTS insights_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    meta_campaign_id VARCHAR(255),
    spend DECIMAL(10,2) DEFAULT 0,
    impressions INT DEFAULT 0,
    reach INT DEFAULT 0,
    clicks INT DEFAULT 0,
    cpc DECIMAL(10,2),
    cpm DECIMAL(10,2),
    ctr DECIMAL(10,2),
    conversions INT DEFAULT 0, -- Leads, Sales, Messages
    cost_per_conversion DECIMAL(10,2),
    roas DECIMAL(10,2),
    raw_json JSONB, -- Full response for flexibility
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, campaign_id)
);

-- 7. AUTOMATION EVENTS
-- Logs for the invisible engine
CREATE TABLE IF NOT EXISTS automation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- e.g., 'OPTIMIZATION_APPLIED', 'PERFORMANCE_DROP_DETECTED'
    description TEXT,
    payload JSONB,
    severity VARCHAR(20) DEFAULT 'INFO', -- INFO, WARNING, ERROR
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_user ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_insights_campaign_date ON insights_daily(campaign_id, date);
