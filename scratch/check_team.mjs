import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTeam() {
    const { data, error } = await supabase.from('team').select('*');
    if (error) {
        console.error("Error fetching team:", error);
    } else {
        console.log("Team members found:", data.length);
        data.forEach(m => console.log(`- ${m.name} (${m.role}) - Sede: ${m.city}`));
    }
}

checkTeam();
