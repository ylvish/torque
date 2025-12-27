-- FIX: Remove recursive policies and replace with simpler ones
-- Run this in Supabase SQL Editor

-- Step 1: Drop all problematic policies on profiles
DROP POLICY IF EXISTS "CEO can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Employees can view non-CEO profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "CEO can update any profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;

-- Step 2: Create simple non-recursive policies
-- Everyone can read profiles (the role check will be done in the application)
CREATE POLICY "Anyone can view profiles" ON profiles
    FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Step 3: Fix submissions policies (remove recursive ones)
DROP POLICY IF EXISTS "Staff can view all submissions" ON seller_submissions;
DROP POLICY IF EXISTS "Staff can update submissions" ON seller_submissions;

CREATE POLICY "Authenticated users can view submissions" ON seller_submissions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update submissions" ON seller_submissions
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Step 4: Fix listings policies
DROP POLICY IF EXISTS "Staff can view all listings" ON listings;
DROP POLICY IF EXISTS "Staff can create listings" ON listings;
DROP POLICY IF EXISTS "Staff can update listings" ON listings;
DROP POLICY IF EXISTS "CEO can delete listings" ON listings;

CREATE POLICY "Authenticated can view all listings" ON listings
    FOR SELECT USING (auth.uid() IS NOT NULL OR status = 'ACTIVE');

CREATE POLICY "Authenticated can create listings" ON listings
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update listings" ON listings
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete listings" ON listings
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Step 5: Fix leads policies  
DROP POLICY IF EXISTS "Staff can view all leads" ON leads;
DROP POLICY IF EXISTS "Staff can update leads" ON leads;

CREATE POLICY "Authenticated can view leads" ON leads
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update leads" ON leads
    FOR UPDATE USING (auth.uid() IS NOT NULL);
