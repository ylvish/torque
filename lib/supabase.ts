import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get server-side client with service role (for admin operations)
export const getServiceClient = () => {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    return createClient(supabaseUrl, serviceKey);
};
