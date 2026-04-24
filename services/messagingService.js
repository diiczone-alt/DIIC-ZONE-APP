import { supabase } from '@/lib/supabase';

export const messagingService = {
    /**
     * Get or create a chat thread between a client and their CM
     */
    getOrCreateClientChat: async (clientId) => {
        // First, check if it exists
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('client_id', clientId)
            .eq('type', 'client_cm')
            .single();

        if (data) return data;

        // If not, create it
        const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert([{
                client_id: clientId,
                type: 'client_cm',
                status: 'active'
            }])
            .select()
            .single();

        if (createError) throw createError;
        return newChat;
    },

    /**
     * Get or create a direct chat between two staff members (CM <-> Creative)
     */
    getOrCreateDirectChat: async (userA, userB) => {
        // We use a metadata field to store participants sorted
        const participants = [userA, userB].sort();
        const chatName = `direct_${participants.join('_')}`;

        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('name', chatName)
            .eq('type', 'direct')
            .single();

        if (data) return data;

        const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert([{
                name: chatName,
                type: 'direct',
                status: 'active',
                metadata: { participants }
            }])
            .select()
            .single();

        if (createError) throw createError;
        return newChat;
    },

    /**
     * Get messages for a specific chat
     */
    getMessages: async (chatId, limit = 50) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    /**
     * Send a message
     */
    sendMessage: async (chatId, senderId, content, metadata = {}) => {
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                chat_id: chatId,
                sender_id: senderId,
                content,
                metadata
            }])
            .select()
            .single();

        if (error) throw error;

        // Update last message in chat
        await supabase
            .from('chats')
            .update({ last_message: content, created_at: new Date() })
            .eq('id', chatId);

        return data;
    },

    /**
     * Subscribe to new messages in a chat
     */
    subscribeToMessages: (chatId, onNewMessage) => {
        return supabase
            .channel(`chat-${chatId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `chat_id=eq.${chatId}`
            }, (payload) => {
                onNewMessage(payload.new);
            })
            .subscribe();
    }
};
