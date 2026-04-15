-- Migration: 006_production_flow_setup.sql
-- Description: Schema for Central Production Flow (Projects, Tasks, Meetings)

-- 1. PROJECTS (The Core Unit)
-- Connects Campaigns, Departments, and Production Status
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL, -- Link to Meta Ads Campaign
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'VIDEO', 'DESIGN', 'WEB', 'AUDIO', 'FILMMAKER', 'PHOTO'
    department VARCHAR(50) NOT NULL, -- 'video', 'design', 'web', 'audio', 'filmmaker', 'photo'
    status VARCHAR(50) DEFAULT 'PENDING', 
    -- Statuses: 'PENDING' (Pendiente), 'PRODUCTION' (En Producción), 'EDITING' (En Edición), 
    -- 'REVIEW' (En Revisión/Cliente), 'CHANGES' (Ajustes), 'APPROVED' (Aprobado), 'PUBLISHED' (Publicado)
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    priority VARCHAR(20) DEFAULT 'NORMAL', -- 'LOW', 'NORMAL', 'HIGH', 'URGENT'
    is_extra_request BOOLEAN DEFAULT FALSE, -- To track if it's outside the plan
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}' -- Flexible field for specific departmental data
);

-- 2. PROJECT TASKS
-- Granular tasks assigned to specific departments/people
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    department VARCHAR(50), -- Can be different from project department (cross-functional)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'TODO', -- 'TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'
    assigned_to VARCHAR(255), -- Name or ID of the responsible agent/human
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECT RESOURCES
-- Files, Assets, Final Deliverables
CREATE TABLE IF NOT EXISTS project_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50), -- 'RAW_FOOTAGE', 'FINAL_VIDEO', 'IMAGE', 'DOC', 'BRIEF'
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    uploaded_by VARCHAR(255), -- 'CLIENT', 'AGENCY', 'SYSTEM'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEETINGS & TRANSCRIPTS
-- Stores meeting records linked to projects
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    recording_url TEXT,
    transcript TEXT, -- Full text
    summary TEXT, -- AI generated summary
    action_items JSONB, -- Extracted tasks
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_campaign ON projects(campaign_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_meetings_project ON meetings(project_id);
