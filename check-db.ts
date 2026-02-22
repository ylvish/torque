import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('seller_submissions')
        .select('id, photos, created_at')
        .order('created_at', { ascending: false })
        .limit(1);

    console.log('Error:', error);
    console.log('Latest Submission:', JSON.stringify(data, null, 2));
}

check();
