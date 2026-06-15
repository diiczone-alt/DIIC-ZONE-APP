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
        // Query the 'brand_connections' table
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { facebook: false, instagram: false, whatsapp: false, ad_account: false };
            }

            const { data, error } = await supabase
                .from('brand_connections')
                .select('*')
                .eq('user_id', user.id)
                .eq('provider', 'facebook')
                .maybeSingle();

            if (error || !data) {
                return {
                    facebook: false,
                    instagram: false,
                    whatsapp: false,
                    ad_account: false
                };
            }

            return {
                facebook: data.status === 'ACTIVE',
                instagram: data.status === 'ACTIVE',
                whatsapp: data.status === 'ACTIVE', // WhatsApp is enabled under same OAuth
                ad_account: !!data.client_id,
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "No user" };

        const { data: profile } = await supabase
            .from('profiles')
            .select('client_id')
            .eq('id', user.id)
            .maybeSingle();

        const updateData = {
            user_id: user.id,
            client_id: profile?.client_id || null,
            provider: 'facebook',
            provider_id: mockData?.id || 'mock_provider_id',
            access_token: 'mock_token_' + Date.now(),
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'ACTIVE',
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('brand_connections')
            .upsert(updateData, { onConflict: 'user_id,provider' });

        return { error };
    }
};
