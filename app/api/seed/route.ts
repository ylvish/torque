import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface StaffMember {
    name: string;
    email: string;
    password: string;
    role: 'CEO' | 'EMPLOYEE';
    phone?: string;
}

// This endpoint creates staff accounts from the config file
// Only accessible with the correct secret key

export async function POST(request: NextRequest) {
    // Verify secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.SEED_SECRET || 'luxeauto-seed-2024';

    if (authHeader !== `Bearer ${expectedSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json(
            { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in environment variables' },
            { status: 500 }
        );
    }

    // Read staff accounts from config file
    const configPath = join(process.cwd(), 'config', 'staff-accounts.json');

    if (!existsSync(configPath)) {
        return NextResponse.json(
            {
                error: 'Staff config file not found',
                hint: 'Copy config/staff-accounts.example.json to config/staff-accounts.json and add your staff members'
            },
            { status: 404 }
        );
    }

    let staffAccounts: StaffMember[];
    try {
        const fileContent = readFileSync(configPath, 'utf-8');
        staffAccounts = JSON.parse(fileContent);
    } catch (err) {
        return NextResponse.json(
            { error: 'Invalid JSON in staff-accounts.json', details: String(err) },
            { status: 400 }
        );
    }

    // Create admin Supabase client
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results: Array<{ email: string; status: string; error?: string }> = [];

    for (const staff of staffAccounts) {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: staff.email,
                password: staff.password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    name: staff.name,
                    role: staff.role,
                },
            });

            if (authError) {
                // Check if user already exists
                if (authError.message.includes('already been registered')) {
                    results.push({ email: staff.email, status: 'exists' });
                    continue;
                }
                results.push({ email: staff.email, status: 'error', error: authError.message });
                continue;
            }

            // Update profile with role and phone
            if (authData.user) {
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        name: staff.name,
                        phone: staff.phone || null,
                        role: staff.role,
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    results.push({
                        email: staff.email,
                        status: 'created',
                        error: `Profile update failed: ${profileError.message}`
                    });
                } else {
                    results.push({ email: staff.email, status: 'created' });
                }
            }
        } catch (err) {
            results.push({ email: staff.email, status: 'error', error: String(err) });
        }
    }

    return NextResponse.json({
        message: 'Staff seeding complete',
        results,
    });
}

// GET endpoint for checking seed status
export async function GET() {
    const configPath = join(process.cwd(), 'config', 'staff-accounts.json');
    const configExists = existsSync(configPath);

    return NextResponse.json({
        configExists,
        hint: configExists
            ? 'POST to this endpoint with Authorization: Bearer <SEED_SECRET> to create staff accounts'
            : 'Copy config/staff-accounts.example.json to config/staff-accounts.json first',
    });
}
