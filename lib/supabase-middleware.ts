import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    // Skip if Supabase environment vars are missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured. Auth middleware disabled.');
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        supabaseResponse = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Refresh session if expired
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Protected routes - redirect to login if no user
        const protectedPaths = ['/dashboard'];
        const isProtectedPath = protectedPaths.some((path) =>
            request.nextUrl.pathname.startsWith(path)
        );

        if (isProtectedPath && !user) {
            const url = request.nextUrl.clone();
            url.pathname = '/auth/login';
            url.searchParams.set('redirectTo', request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }

        // Redirect logged in users from login page to dashboard
        if (request.nextUrl.pathname === '/auth/login' && user) {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }

        return supabaseResponse;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next({ request });
    }
}
