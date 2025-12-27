-- STEP 2: Update roles and policies
-- Run this AFTER running 002a_add_enum_values.sql

-- Update existing staff roles to new values
UPDATE profiles SET role = 'EMPLOYEE' WHERE role IN ('STAFF_EXEC', 'STAFF_MANAGER', 'CONTENT_EDITOR');
UPDATE profiles SET role = 'CEO' WHERE role = 'ADMIN';

-- Update RLS policies for profiles
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "CEO can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'CEO'
        )
    );

CREATE POLICY "Employees can view non-CEO profiles" ON profiles
    FOR SELECT USING (
        role != 'CEO'
        OR id = auth.uid()
    );

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "CEO can update any profile" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'CEO'
        )
    );

-- Update RLS policies for submissions
DROP POLICY IF EXISTS "Staff can view all submissions" ON seller_submissions;
DROP POLICY IF EXISTS "Staff can update submissions" ON seller_submissions;

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

-- Update RLS policies for listings
DROP POLICY IF EXISTS "Staff can view all listings" ON listings;
DROP POLICY IF EXISTS "Staff can create listings" ON listings;
DROP POLICY IF EXISTS "Staff can update listings" ON listings;
DROP POLICY IF EXISTS "Admin can delete listings" ON listings;

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

-- Update RLS policies for leads
DROP POLICY IF EXISTS "Staff can view all leads" ON leads;
DROP POLICY IF EXISTS "Staff can update leads" ON leads;

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

-- Add index on role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add assigned_to column to submissions if not exists
ALTER TABLE seller_submissions ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id);

-- Update handle_new_user function
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
