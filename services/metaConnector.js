import { supabase } from '../lib/supabase';

export const metaConnector = {
    // 1. INITIATE OAUTH FLOW
    // This would typically redirect to your backend endpoint that handles the Meta Login Dialog
    connectAccount: async (platform) => {
        // Mocking the flow for now
        console.log(`Initiating connection for ${platform}...`);

        // In production: window.location.href = `/api/auth/meta/login?platform=${platform}`;

        // Simulating a successful connection after a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, platform });
            }, 2000);
        });
    },

    // 2. GET STATUS OF CONNECTIONS
    getConnectionStatus: async () => {
        // Query the 'meta_connections' table
        try {
            const { data, error } = await supabase
                .from('meta_connections')
                .select('*')
                .single();

            if (error) {
                // Return default disconnected state if no record found
                return {
                    facebook: false,
                    instagram: false,
                    whatsapp: false,
                    ad_account: false
                };
            }

            return {
                facebook: !!data.page_id,
                instagram: !!data.ig_account_id,
                whatsapp: !!data.whatsapp_business_id,
                ad_account: !!data.ad_account_id,
                details: data
            };
        } catch (e) {
            console.error("Error fetching connection status:", e);
            return {
                facebook: false,
                instagram: false,
                whatsapp: false,
                ad_account: false
            };
        }
    },

    // 3. MOCK SAVE CONNECTION (For testing UI)
    mockConnect: async (platform, mockData) => {
        // In real app, this happens via the callback URL from Meta
        // Here we just insert/update the DB to simulate it
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "No user" };

        const updateData = {};
        if (platform === 'facebook') updateData.page_id = mockData.id;
        if (platform === 'instagram') updateData.ig_account_id = mockData.id;
        if (platform === 'whatsapp') updateData.whatsapp_business_id = mockData.id;
        if (platform === 'ads') updateData.ad_account_id = mockData.id;

        updateData.status = 'ACTIVE';
        updateData.user_id = user.id;
        updateData.access_token_encrypted = 'mock_token_' + Date.now();

        const { error } = await supabase
            .from('meta_connections')
            .upsert(updateData, { onConflict: 'user_id' });

        return { error };
    }
};
