import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Check user and fix profile
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.SEED_SECRET || 'luxeauto-seed-2024';

    if (authHeader !== `Bearer ${expectedSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const email = 'vishalcollege1829@gmail.com';

    // Step 1: List all users to find if user exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
        return NextResponse.json({ step: 'list_users', error: listError.message });
    }

    const existingUser = users.users.find(u => u.email === email);

    if (existingUser) {
        // User exists - check/fix profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', existingUser.id)
            .single();

        if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist - create it
            const { error: insertError } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: existingUser.id,
                    email: email,
                    name: 'Vishal',
                    role: 'CEO',
                });

            if (insertError) {
                return NextResponse.json({
                    step: 'insert_profile',
                    userId: existingUser.id,
                    error: insertError.message,
                    code: insertError.code,
                    hint: insertError.hint
                });
            }

            return NextResponse.json({
                success: true,
                action: 'profile_created',
                userId: existingUser.id
            });
        }

        return NextResponse.json({
            success: true,
            action: 'user_exists',
            userId: existingUser.id,
            profile: profile
        });
    }

    // User doesn't exist - create new
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: 'Vishal@12345',
        email_confirm: true,
    });

    if (createError) {
        return NextResponse.json({
            step: 'create_user',
            error: createError.message,
            code: createError.code
        });
    }

    // Create profile for new user
    if (newUser.user) {
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: newUser.user.id,
                email: email,
                name: 'Vishal',
                role: 'CEO',
            });

        if (profileError) {
            return NextResponse.json({
                step: 'create_profile_new_user',
                userId: newUser.user.id,
                error: profileError.message
            });
        }
    }

    return NextResponse.json({
        success: true,
        action: 'user_created',
        userId: newUser.user?.id
    });
}
