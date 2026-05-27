import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pigojfotwzgahcmtvyko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZ29qZm90d3pnYWhjbXR2eWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTQ5MDIsImV4cCI6MjA5MTI3MDkwMn0.d_tUGfzX7WUC8R31wrP7LBLyyrNcHY6igkkjs6hYEJ8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- Fetching from team table ---');
    const { data: team, error: teamError } = await supabase
        .from('team')
        .select('*');
        
    if (teamError) {
        console.error('Error fetching team:', teamError);
    } else {
        console.log('Team size:', team ? team.length : 0);
        console.log('Team members:', team);
    }

    console.log('--- Fetching from profiles table ---');
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
    } else {
        console.log('Profiles size:', profiles ? profiles.length : 0);
        console.log('Profiles:', profiles);
    }
}

check();
