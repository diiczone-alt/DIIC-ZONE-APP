import { supabase } from '../lib/supabase';

export const contentService = {
    // Get pipeline items (Kanban)
    async getPipelineItems() {
        // const supabase = createClientComponentClient(); -> Use imported singleton
        try {
            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .order('scheduled_date', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching pipeline:', error);
            return [];
        }
    },

    // Update item status or date
    async updateItem(id, updates) {
        // const supabase = createClientComponentClient();
        const { data, error } = await supabase
            .from('content_items')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating item:', error);
            return null;
        }
        return data;
    },

    // Create a new content item (e.g., from File Upload)
    async createItem(itemData) {
        // const supabase = createClientComponentClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('content_items')
            .insert({ ...itemData, client_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
