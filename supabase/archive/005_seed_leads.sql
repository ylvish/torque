-- Seed leads data from user screenshot
-- Run this in Supabase SQL Editor
-- IMPORTANT: Run 005_fix_enums.sql BEFORE running this script!

DO $$
DECLARE
    john_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    jane_id UUID := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
    
    listing_bmw UUID;
    listing_merc UUID;
    listing_audi UUID;
    listing_creta UUID;
BEGIN
    -- 1. Create Staff Users (John Doe & Jane Smith)
    -- We try to insert into auth.users. If this fails due to permissions, the profile insert will fail.
    -- In that case, we'll gracefully skip assignment or handle it.
    
    -- John Doe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'john@luxeauto.com') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (john_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'john@luxeauto.com', '$2a$10$dummyhashdummyhashdummyh', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"John Doe"}', now(), now(), '', '', '', '');
        
        -- Profile is usually created by trigger, but we ensure it exists and has correct role
        INSERT INTO public.profiles (id, email, name, role)
        VALUES (john_id, 'john@luxeauto.com', 'John Doe', 'EMPLOYEE')
        ON CONFLICT (id) DO UPDATE SET role = 'EMPLOYEE', name = 'John Doe';
    END IF;

    -- Jane Smith
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jane@luxeauto.com') THEN
         INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (jane_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jane@luxeauto.com', '$2a$10$dummyhashdummyhashdummyh', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Jane Smith"}', now(), now(), '', '', '', '');

        INSERT INTO public.profiles (id, email, name, role)
        VALUES (jane_id, 'jane@luxeauto.com', 'Jane Smith', 'EMPLOYEE')
        ON CONFLICT (id) DO UPDATE SET role = 'EMPLOYEE', name = 'Jane Smith';
    END IF;

    -- 2. Ensure Listings Exist & Get IDs
    
    -- Get BMW ID
    SELECT id INTO listing_bmw FROM listings WHERE make = 'BMW' AND model = '3 Series' LIMIT 1;
    
    -- Get Mercedes ID
    SELECT id INTO listing_merc FROM listings WHERE make = 'Mercedes-Benz' AND model = 'E-Class' LIMIT 1;
    
    -- Get Audi ID
    SELECT id INTO listing_audi FROM listings WHERE make = 'Audi' AND model = 'A4' LIMIT 1;
    
    -- Create/Get Hyundai Creta
    SELECT id INTO listing_creta FROM listings WHERE make = 'Hyundai' AND model = 'Creta' LIMIT 1;
    
    IF listing_creta IS NULL THEN
        INSERT INTO listings (
            status, make, model, year, variant, fuel_type, transmission, mileage, registration_city, owners, price, description, featured_image_url
        ) VALUES (
            'ACTIVE', 'Hyundai', 'Creta', 2023, 'SX(O) Turbo', 'PETROL', 'AUTOMATIC', 8500, 'Pune', 1, 1850000, 'Top end Creta with ADAS features. Less driven.', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80'
        ) RETURNING id INTO listing_creta;
    END IF;

    -- 3. Insert Leads (Clear existing matching leads to avoid duplicates if re-run)
    DELETE FROM leads WHERE buyer_email IN ('vikram@email.com', 'neha@email.com', 'rajesh@email.com', 'anjali@email.com');

    -- Lead 1: Vikram Mehta (BMW)
    INSERT INTO leads (listing_id, buyer_name, buyer_email, buyer_phone, interest, status, message, assigned_to, created_at)
    VALUES (
        listing_bmw,
        'Vikram Mehta',
        'vikram@email.com',
        '+91 98765 00001',
        'TEST_DRIVE',
        'NEW',
        'Would like to schedule a test drive this weekend.',
        NULL, -- Unassigned
        now() - interval '2 hours'
    );

    -- Lead 2: Neha Gupta (Mercedes)
    INSERT INTO leads (listing_id, buyer_name, buyer_email, buyer_phone, interest, status, message, assigned_to, created_at)
    VALUES (
        listing_merc,
        'Neha Gupta',
        'neha@email.com',
        '+91 98765 00002',
        'FINANCE_INFO',
        'CONTACTED',
        'Looking for finance options with low EMI.',
        john_id,
        now() - interval '1 day'
    );

    -- Lead 3: Rajesh Kumar (Audi)
    INSERT INTO leads (listing_id, buyer_name, buyer_email, buyer_phone, interest, status, message, assigned_to, created_at)
    VALUES (
        listing_audi,
        'Rajesh Kumar',
        'rajesh@email.com',
        '+91 98765 00003',
        'PRICE_INFO', -- Best Price
        'LOST',
        'Can you give a better price?',
        john_id,
        now() - interval '2 days'
    );

    -- Lead 4: Anjali Verma (Creta)
    INSERT INTO leads (listing_id, buyer_name, buyer_email, buyer_phone, interest, status, message, assigned_to, created_at)
    VALUES (
        listing_creta,
        'Anjali Verma',
        'anjali@email.com',
        '+91 98765 00004',
        'TEST_DRIVE', 
        'NEGOTIATING',
        'Interested in the car, want to discuss pricing.',
        jane_id,
        now() - interval '3 days'
    );

END $$;
