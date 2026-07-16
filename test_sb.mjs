import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pigojfotwzgahcmtvyko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZ29qZm90d3pnYWhjbXR2eWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTQ5MDIsImV4cCI6MjA5MTI3MDkwMn0.d_tUGfzX7WUC8R31wrP7LBLyyrNcHY6igkkjs6hYEJ8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Fetching clients...');
    
    const { data: clients, error } = await supabase
        .from('clients')
        .select('*');
        
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found clients:', clients.length);
        clients.forEach(c => {
            console.log(`ID: ${c.id} | Name: ${c.name} | Status: ${c.status} | CreatedAt: ${c.created_at}`);
        });
    }
}

check();
