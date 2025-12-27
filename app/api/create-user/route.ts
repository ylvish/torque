import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Direct user creation endpoint - for debugging
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

    try {
        // Try to create user with explicit options
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: 'vishalcollege1829@gmail.com',
            password: 'Vishal@12345',
            email_confirm: true,
            user_metadata: {
                name: 'Vishal',
                role: 'CEO',
            },
        });

        if (error) {
            return NextResponse.json({
                step: 'create_user',
                error: error.message,
                code: error.code,
                details: error
            }, { status: 400 });
        }

        // If user created, manually insert profile
        if (data.user) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: 'vishalcollege1829@gmail.com',
                    name: 'Vishal',
                    role: 'CEO',
                }, { onConflict: 'id' });

            if (profileError) {
                return NextResponse.json({
                    step: 'create_profile',
                    userId: data.user.id,
                    error: profileError.message,
                    code: profileError.code
                }, { status: 400 });
            }
        }

        return NextResponse.json({
            success: true,
            userId: data.user?.id,
            email: data.user?.email
        });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
