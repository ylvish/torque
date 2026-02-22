import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // use service role to bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('email, role, name');

    console.log('Error:', error);
    console.log('Profiles:', JSON.stringify(data, null, 2));
}

checkProfiles();
