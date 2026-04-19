import { supabase } from '@/lib/supabase';

/**
 * Service to handle real Social Media OAuth connections via Supabase
 */
export const socialService = {
    /**
     * Start OAuth flow for a specific provider
     * @param {string} provider - 'facebook', 'google', 'twitter', 'linkedin', etc.
     */
    connect: async (provider, redirectPath = null) => {
        const targetPath = redirectPath || window.location.pathname;
        let options = {
            redirectTo: window.location.origin + targetPath
        };

        // Platform specific scopes
        if (provider === 'google') {
            options.scopes = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.email';
        } else if (provider === 'facebook') {
            // Se agrega ads_read para poder ver métricas de cuentas publicitarias
            options.scopes = 'public_profile,email,pages_show_list,instagram_basic,instagram_manage_insights,ads_read';
        } else if (provider === 'tiktok') {
            const clientKey = 'sbawcgte68gzlgcfeo';
            const targetPath = redirectPath || window.location.pathname;
            const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback/tiktok?next=' + targetPath);
            // Nota: Para TikTok Ads se requiere una App de tipo "Marketing" en su portal.
            // Por ahora mantenemos los básicos y agregamos ads.read si la app lo permite.
            const scope = 'user.info.basic,video.list'; 
            const state = Math.random().toString(36).substring(7);
            
            // PKCE: Generate verifier and challenge
            const verifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0')).join('');
                
            const encoder = new TextEncoder();
            const data = encoder.encode(verifier);
            const hash = await window.crypto.subtle.digest('SHA-256', data);
            const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
            
            // Store verifier and state for security
            localStorage.setItem('tiktok_auth_state', state);
            localStorage.setItem('tiktok_code_verifier', verifier);
            
            const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;
            
            window.location.href = authUrl;
            return { manual: true };
        }

        // Map internal provider names to custom provider identifiers if needed
        const actualProvider = provider === 'tiktok' ? 'custom:tiktok' : provider;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: actualProvider,
            options
        });

        if (error) throw error;
        return data;
    },

    /**
     * Get currently linked identities for the user
     */
    getLinkedAccounts: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        
        // 1. Obtener identidades nativas de Supabase (Google, Facebook, etc.)
        const nativeIdentities = user.identities?.map(id => id.provider) || [];
        
        // 2. Obtener conexiones manuales de nuestra tabla (TikTok, etc.)
        const { data: manualConnections } = await supabase
            .from('social_connections')
            .select('platform');
        
        const manualIdentities = manualConnections?.map(c => c.platform) || [];
        
        // Unificar (evitando duplicados si existen)
        return [...new Set([...nativeIdentities, ...manualIdentities])];
    }
};
