import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pigojfotwzgahcmtvyko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZ29qZm90d3pnYWhjbXR2eWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTQ5MDIsImV4cCI6MjA5MTI3MDkwMn0.d_tUGfzX7WUC8R31wrP7LBLyyrNcHY6igkkjs6hYEJ8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Logging in as diiczone@gmail.com...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'diiczone@gmail.com',
        password: 'Admin123!'
    });

    if (authError) {
        console.error('Login Error:', authError.message);
        return;
    }

    console.log('Login successful! User ID:', authData.user.id);

    console.log('Querying profiles...');
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*');

    if (pError) {
        console.error('Profiles Query Error:', pError.message);
    } else {
        console.log('Found profiles:', profiles.length);
    }

    console.log('Querying clients...');
    const { data: clients, error: cError } = await supabase
        .from('clients')
        .select('*');

    if (cError) {
        console.error('Clients Query Error:', cError.message);
    } else {
        console.log('Found clients:', clients.length);
        console.log('Client names:', clients.map(c => c.name));
    }
}

check();
