-- Seed 3 Employee Accounts
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    alice_id UUID := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
    bob_id UUID := 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';
    charlie_id UUID := 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55';
BEGIN
    -- Alice Brown
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alice@luxeauto.com') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (alice_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@luxeauto.com', '$2a$10$dummyhashdummyhashdummyh', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Alice Brown"}', now(), now(), '', '', '', '');

        INSERT INTO public.profiles (id, email, name, role)
        VALUES (alice_id, 'alice@luxeauto.com', 'Alice Brown', 'EMPLOYEE')
        ON CONFLICT (id) DO UPDATE SET role = 'EMPLOYEE', name = 'Alice Brown';
    END IF;

    -- Bob Wilson
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bob@luxeauto.com') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (bob_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@luxeauto.com', '$2a$10$dummyhashdummyhashdummyh', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Bob Wilson"}', now(), now(), '', '', '', '');

        INSERT INTO public.profiles (id, email, name, role)
        VALUES (bob_id, 'bob@luxeauto.com', 'Bob Wilson', 'EMPLOYEE')
        ON CONFLICT (id) DO UPDATE SET role = 'EMPLOYEE', name = 'Bob Wilson';
    END IF;

    -- Charlie Davis
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'charlie@luxeauto.com') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (charlie_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'charlie@luxeauto.com', '$2a$10$dummyhashdummyhashdummyh', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Charlie Davis"}', now(), now(), '', '', '', '');

        INSERT INTO public.profiles (id, email, name, role)
        VALUES (charlie_id, 'charlie@luxeauto.com', 'Charlie Davis', 'EMPLOYEE')
        ON CONFLICT (id) DO UPDATE SET role = 'EMPLOYEE', name = 'Charlie Davis';
    END IF;

END $$;
