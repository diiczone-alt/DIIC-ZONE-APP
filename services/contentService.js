import { supabase } from '@/lib/supabase';

export const contentService = {
    /**
     * Fetch all content for a specific client
     */
    getContents: async (clientId) => {
        try {
            const { data, error } = await supabase
                .from('content')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching contents:', error);
            return [];
        }
    },

    /**
     * Create a new content piece
     */
    createContent: async (contentData) => {
        try {
            const { data, error } = await supabase
                .from('content')
                .insert([contentData])
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error creating content:', error);
            return { data: null, error };
        }
    },

    /**
     * Update the stage of a content piece
     */
    updateContentStage: async (id, newStage) => {
        try {
            const { data, error } = await supabase
                .from('content')
                .update({ stage: newStage })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error updating content stage:', error);
            return { data: null, error };
        }
    },

    /**
     * Delete a content piece
     */
    deleteContent: async (id) => {
        try {
            const { error } = await supabase
                .from('content')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Error deleting content:', error);
            return { error };
        }
    }
};
