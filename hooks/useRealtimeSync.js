import { useEffect, useRef, useState } from 'react';
import { supabase, isCloudConnected } from '@/lib/supabase';

/**
 * Custom hook to synchronize data from Supabase Realtime automatically.
 * @param {string[]} tables - Array of table names to subscribe to.
 * @param {Function} onSync - Callback function to run when data changes.
 */
export default function useRealtimeSync(tables, onSync) {
    const savedCallback = useRef(onSync);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        savedCallback.current = onSync;
    }, [onSync]);

    useEffect(() => {
        if (!tables || tables.length === 0 || !savedCallback.current) return;

        console.log(`[Realtime Sync] Initializing channels for:`, tables.join(', '));
        const channels = [];

        tables.forEach((tableName) => {
            const channel = supabase
                .channel(`sync-hq-${tableName}`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: tableName },
                    (payload) => {
                        console.log(`🔄 [Realtime] Change detected in ${tableName}:`, payload.eventType);
                        
                        // Execute the callback passed (e.g., loadData function)
                        // Add a slight delay to avoid rapid-fire UI glitching if batched operations occur
                        setTimeout(() => {
                            if (savedCallback.current) savedCallback.current();
                        }, 500); 
                    }
                );
            
            // Subscribe to the channel
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`⚡ [Realtime] Connected to ${tableName}`);
                    setIsLive(true);
                } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                    setIsLive(false);
                }
            });

            channels.push(channel);
        });

        // Cleanup on unmount
        return () => {
            console.log(`[Realtime Sync] Cleaning up channels for:`, tables.join(', '));
            channels.forEach((channel) => {
                supabase.removeChannel(channel);
            });
        };
    }, [tables.join(',')]);

    return isLive;
}
