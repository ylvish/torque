import { createBrowserClient } from '@supabase/ssr';

// Placeholder values for development when env vars are not set
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export function createClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Using placeholder.');
    }
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
