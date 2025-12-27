-- Supabase SQL Migration: Create tables for Car Marketplace
-- Run this in the Supabase SQL Editor
-- Version 2: Updated roles to CEO and EMPLOYEE

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles Enum (simplified for staff management)
CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'EMPLOYEE', 'CEO');

-- Submission Status Enum
CREATE TYPE submission_status AS ENUM ('PENDING_REVIEW', 'UNDER_EVALUATION', 'INFO_REQUESTED', 'APPROVED', 'REJECTED', 'ON_HOLD');

-- Listing Status Enum
CREATE TYPE listing_status AS ENUM ('DRAFT', 'ACTIVE', 'RESERVED', 'SOLD', 'EXPIRED', 'ARCHIVED');

-- Lead Status Enum
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATING', 'CONVERTED', 'LOST');

-- Lead Interest Enum
CREATE TYPE lead_interest AS ENUM ('TEST_DRIVE', 'PRICE_INFO', 'FINANCE_INFO', 'GENERAL');

-- Fuel Type Enum
CREATE TYPE fuel_type AS ENUM ('PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID');

-- Transmission Type Enum
CREATE TYPE transmission_type AS ENUM ('MANUAL', 'AUTOMATIC');

-- ====================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ====================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'BUYER',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- CEO can see everyone
CREATE POLICY "CEO can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'CEO'
        )
    );

-- Employees can see other employees BUT NOT CEOs
CREATE POLICY "Employees can view non-CEO profiles" ON profiles
    FOR SELECT USING (
        role != 'CEO'
        OR id = auth.uid()  -- Can always see own profile
    );

-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- CEO can update any profile
CREATE POLICY "CEO can update any profile" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'CEO'
        )
    );

-- ====================================
-- SELLER SUBMISSIONS TABLE
-- ====================================
CREATE TABLE seller_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status submission_status DEFAULT 'PENDING_REVIEW',
    
    -- Seller info
    seller_name TEXT NOT NULL,
    seller_phone TEXT NOT NULL,
    seller_email TEXT NOT NULL,
    seller_city TEXT NOT NULL,
    preferred_contact_time TEXT,
    whatsapp_consent BOOLEAN DEFAULT FALSE,
    
    -- Car basics
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    variant TEXT,
    fuel_type fuel_type NOT NULL,
    transmission transmission_type NOT NULL,
    mileage INTEGER NOT NULL,
    registration_city TEXT NOT NULL,
    
    -- Ownership & condition
    owners INTEGER NOT NULL DEFAULT 1,
    accident_history BOOLEAN DEFAULT FALSE,
    service_history TEXT,
    insurance_status TEXT,
    selling_reason TEXT,
    
    -- Media (JSON arrays of URLs)
    photos JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    
    -- Staff notes (JSON array)
    staff_notes JSONB DEFAULT '[]'::jsonb,
    assigned_to UUID REFERENCES profiles(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE seller_submissions ENABLE ROW LEVEL SECURITY;

-- Submissions policies
CREATE POLICY "Sellers can view own submissions" ON seller_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create submissions" ON seller_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view all submissions" ON seller_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

CREATE POLICY "Staff can update submissions" ON seller_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

-- ====================================
-- LISTINGS TABLE
-- ====================================
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES seller_submissions(id) ON DELETE SET NULL,
    status listing_status DEFAULT 'DRAFT',
    
    -- Car details
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    variant TEXT,
    fuel_type fuel_type NOT NULL,
    transmission transmission_type NOT NULL,
    mileage INTEGER NOT NULL,
    registration_city TEXT NOT NULL,
    owners INTEGER NOT NULL DEFAULT 1,
    
    -- Staff additions
    price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    why_we_like_it TEXT,
    inspection_summary TEXT,
    
    -- Media
    featured_image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    lead_count INTEGER DEFAULT 0,
    
    -- Publishing
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES profiles(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Listings policies
CREATE POLICY "Active listings are viewable by everyone" ON listings
    FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Staff can view all listings" ON listings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

CREATE POLICY "Staff can create listings" ON listings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

CREATE POLICY "Staff can update listings" ON listings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

CREATE POLICY "CEO can delete listings" ON listings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'CEO'
        )
    );

-- ====================================
-- LEADS TABLE
-- ====================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    
    -- Buyer info
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    message TEXT,
    
    interest lead_interest DEFAULT 'GENERAL',
    status lead_status DEFAULT 'NEW',
    assigned_to UUID REFERENCES profiles(id),
    
    -- Notes (JSON array)
    notes JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Leads policies
CREATE POLICY "Anyone can create leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view all leads" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

CREATE POLICY "Staff can update leads" ON leads
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );

-- ====================================
-- TRIGGERS: Auto-update updated_at
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON seller_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- TRIGGERS: Auto-create profile on signup
-- ====================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'BUYER')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ====================================
-- INDEXES for performance
-- ====================================
CREATE INDEX idx_submissions_status ON seller_submissions(status);
CREATE INDEX idx_submissions_user ON seller_submissions(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_make_model ON listings(make, model);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_listing ON leads(listing_id);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ====================================
-- FUNCTION: Generate unique reference ID for submissions
-- ====================================
CREATE OR REPLACE FUNCTION generate_reference_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reference_id = 'SUB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(NEW.id::text, 1, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reference_id
    BEFORE INSERT ON seller_submissions
    FOR EACH ROW
    EXECUTE FUNCTION generate_reference_id();

-- ====================================
-- FUNCTION: Increment listing view count
-- ====================================
CREATE OR REPLACE FUNCTION increment_view_count(listing_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE listings SET view_count = view_count + 1 WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- FUNCTION: Increment listing lead count
-- ====================================
CREATE OR REPLACE FUNCTION increment_lead_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE listings SET lead_count = lead_count + 1 WHERE id = NEW.listing_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_created
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION increment_lead_count();
