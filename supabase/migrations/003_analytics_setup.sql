-- Create Brand Analytics Table
CREATE TABLE IF NOT EXISTS brand_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    current_level INTEGER DEFAULT 1,
    growth_percentage INTEGER DEFAULT 0,
    health_score INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Social Analytics Table
CREATE TABLE IF NOT EXISTS social_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    platform TEXT NOT NULL, -- 'instagram', 'facebook', 'youtube', 'tiktok'
    followers_count INTEGER DEFAULT 0,
    followers_growth INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Production KPIs Table
CREATE TABLE IF NOT EXISTS production_kpis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    videos_edited INTEGER DEFAULT 0,
    arts_approved INTEGER DEFAULT 0,
    copywriting_tasks INTEGER DEFAULT 0,
    web_updates INTEGER DEFAULT 0,
    efficiency_score INTEGER DEFAULT 0, -- 0-100
    month DATE DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE brand_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_kpis ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for single user/demo)
CREATE POLICY "Enable read for authenticated users only" ON brand_analytics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read for authenticated users only" ON social_analytics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read for authenticated users only" ON production_kpis FOR SELECT TO authenticated USING (true);

-- Insert Initial Mock Data (so the dashboard isn't empty)
INSERT INTO brand_analytics (current_level, growth_percentage, health_score) 
VALUES (3, 18, 72);

INSERT INTO social_analytics (platform, followers_count, followers_growth, engagement_rate) VALUES
('instagram', 12400, 340, 4.5),
('facebook', 8200, 120, 2.1),
('youtube', 1100, 45, 6.8),
('tiktok', 45200, 1200, 8.4);

INSERT INTO production_kpis (videos_edited, arts_approved, copywriting_tasks, web_updates, efficiency_score)
VALUES (12, 18, 24, 3, 95);
