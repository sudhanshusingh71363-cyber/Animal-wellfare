-- ============================================================================
-- PawCare: Animal Rescue, Wellness & AI First-Aid Guidance Database Schema
-- Version: 1.0.0
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN PROFILES & VETERINARY REVIEWERS
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'veterinary_reviewer', 'rescue_coordinator')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RESCUE ORGANIZATIONS & SHELTERS
CREATE TABLE IF NOT EXISTS rescue_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    pin_code TEXT,
    phone TEXT NOT NULL,
    emergency_phone TEXT,
    email TEXT,
    operating_hours TEXT,
    active_areas TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. VETERINARY CLINICS & EMERGENCY HOSPITALS
CREATE TABLE IF NOT EXISTS veterinary_clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    pin_code TEXT,
    phone TEXT,
    emergency_phone TEXT,
    has_emergency_service BOOLEAN DEFAULT FALSE,
    is_open_24_hours BOOLEAN DEFAULT FALSE,
    opening_hours TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RESCUE REPORTS
CREATE TABLE IF NOT EXISTS rescue_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT NOT NULL UNIQUE,
    animal_type TEXT NOT NULL CHECK (animal_type IN ('dog', 'cat', 'cow', 'bird', 'other')),
    animal_description TEXT,
    problem_category TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'severe', 'moderate', 'mild')),
    description TEXT NOT NULL,
    image_url TEXT,
    
    -- Location details
    city TEXT NOT NULL,
    pin_code TEXT,
    address_summary TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Reporter info (Protected by RLS)
    reporter_name TEXT,
    reporter_phone TEXT,
    reporter_consent_to_contact BOOLEAN DEFAULT FALSE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'dispatched', 'resolved', 'unable_to_locate', 'cancelled')),
    status_notes TEXT,
    assigned_organization_id UUID REFERENCES rescue_organizations(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SYMPTOM SESSIONS
CREATE TABLE IF NOT EXISTS symptom_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL UNIQUE,
    animal_type TEXT NOT NULL,
    concern_category TEXT NOT NULL,
    urgency_level TEXT CHECK (urgency_level IN ('emergency', 'veterinary_assessment', 'basic_care')),
    emergency_triggered BOOLEAN DEFAULT FALSE,
    uploaded_image_url TEXT,
    summary_text TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SYMPTOM ANSWERS
CREATE TABLE IF NOT EXISTS symptom_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL REFERENCES symptom_sessions(session_id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    selected_choice_ids TEXT[] DEFAULT '{}',
    selected_choice_labels TEXT[] DEFAULT '{}',
    free_text_answer TEXT,
    is_unknown BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TRIAGE SAFETY RULES (Admin & Vet Reviewed)
CREATE TABLE IF NOT EXISTS triage_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    animal_type TEXT NOT NULL DEFAULT 'all',
    concern_category TEXT,
    condition_description TEXT NOT NULL,
    triggered_urgency TEXT NOT NULL CHECK (triggered_urgency IN ('emergency', 'veterinary_assessment', 'basic_care')),
    is_emergency_override BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    last_reviewed_by_vet TEXT,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. WELLNESS RESOURCES
CREATE TABLE IF NOT EXISTS wellness_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    animal_type TEXT NOT NULL DEFAULT 'all',
    authoritative_source TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    read_time_minutes INTEGER DEFAULT 4,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. WELLNESS QUOTES
CREATE TABLE IF NOT EXISTS wellness_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    context TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. STORIES OF HOPE & RECOVERY
CREATE TABLE IF NOT EXISTS success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    animal_name TEXT NOT NULL,
    animal_type TEXT NOT NULL,
    story TEXT NOT NULL,
    rescue_date DATE NOT NULL,
    recovery_date DATE,
    image_url TEXT,
    is_development_sample BOOLEAN DEFAULT FALSE,
    rescue_location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE & SEARCH
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_rescue_reports_ref ON rescue_reports(reference_number);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_status ON rescue_reports(status);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_city ON rescue_reports(city);
CREATE INDEX IF NOT EXISTS idx_clinics_city ON veterinary_clinics(city);
CREATE INDEX IF NOT EXISTS idx_clinics_emergency ON veterinary_clinics(has_emergency_service);
CREATE INDEX IF NOT EXISTS idx_symptom_answers_session ON symptom_answers(session_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE rescue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinary_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescue_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published wellness resources, quotes, stories, verified clinics
CREATE POLICY "Public can view published resources" ON wellness_resources
    FOR SELECT USING (published = true);

CREATE POLICY "Public can view wellness quotes" ON wellness_quotes
    FOR SELECT USING (true);

CREATE POLICY "Public can view stories of hope" ON success_stories
    FOR SELECT USING (true);

CREATE POLICY "Public can view verified clinics" ON veterinary_clinics
    FOR SELECT USING (verified = true);

CREATE POLICY "Public can view verified organizations" ON rescue_organizations
    FOR SELECT USING (verified = true);

-- Public can insert new rescue reports
CREATE POLICY "Public can submit rescue reports" ON rescue_reports
    FOR INSERT WITH CHECK (true);

-- Public can view report status by exact reference number without seeing reporter phone
CREATE POLICY "Public can track report status" ON rescue_reports
    FOR SELECT USING (true);

-- Anonymous users can create symptom sessions and answers
CREATE POLICY "Public can create symptom sessions" ON symptom_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert symptom answers" ON symptom_answers
    FOR INSERT WITH CHECK (true);

-- Admins full access policy (requires auth.jwt() admin role)
CREATE POLICY "Admins full access on reports" ON rescue_reports
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins full access on clinics" ON veterinary_clinics
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins full access on triage rules" ON triage_rules
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins full access on audit logs" ON audit_logs
    FOR ALL TO authenticated USING (true);
