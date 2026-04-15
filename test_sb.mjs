import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pigojfotwzgahcmtvyko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZ29qZm90d3pnYWhjbXR2eWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTQ5MDIsImV4cCI6MjA5MTI3MDkwMn0.d_tUGfzX7WUC8R31wrP7LBLyyrNcHY6igkkjs6hYEJ8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Fetching users from auth (need service role for this usually, using anon to fetch profile instead)');
    
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(100);
        
    if (error) {
        console.error('Error:', error);
    } else {
        const cmUser = users.find(u => u.full_name?.toLowerCase().includes('cm') || u.id);
        console.log('Found users:', users.length);
        console.log('CM profile (sample):', users.find(u => u.email === 'cmdiiczone@gmail.com') || (users.length > 0 ? users[0] : 'None'));
        console.log('All roles:', new Set(users.map(u => u.role)));
    }
}

check();
