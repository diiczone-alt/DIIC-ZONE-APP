
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Testing connection to:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Missing keys in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('📡 Fetching clients...');
    const { data, error } = await supabase.from('clients').select('id, name');
    
    if (error) {
        console.error('❌ Supabase Error:', error.message);
    } else {
        console.log('✅ Success! Found clients:', data?.length || 0);
        console.log('--- List ---');
        data.forEach(c => console.log(`- ${c.name} (${c.id})`));
    }
}

test();
