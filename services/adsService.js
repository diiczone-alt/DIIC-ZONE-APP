import { supabase } from '@/lib/supabase';

/**
 * Service to manage advertising accounts and their metrics
 */
export const adsService = {
    /**
     * Obtiene las cuentas publicitarias disponibles para una plataforma conectada
     * @param {string} platform - 'facebook' o 'tiktok'
     */
    fetchAvailableAccounts: async (platform) => {
        try {
            // 1. Obtener el token de la conexión guardada
            const { data: connection, error: connError } = await supabase
                .from('social_connections')
                .select('access_token, platform')
                .eq('platform', platform)
                .single();

            if (connError || !connection) {
                console.warn(`No active connection found for ${platform}`);
                return [];
            }

            // 2. Consultar la API de la plataforma
            if (platform === 'facebook' || platform === 'instagram') {
                const response = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,id,currency,account_status&access_token=${connection.access_token}`);
                const result = await response.json();
                
                if (result.error) {
                    // Si el token expiró, informar
                    if (result.error.code === 190) throw new Error("TOKEN_EXPIRED");
                    throw new Error(result.error.message);
                }
                
                // Formatear para que la UI sea consistente
                return result.data.map(acc => ({
                    id: acc.id, // act_XXXXXXXX
                    account_id: acc.account_id,
                    name: acc.name,
                    currency: acc.currency,
                    status: acc.account_status,
                    platform: 'facebook'
                }));
            }

            if (platform === 'tiktok') {
                // Para TikTok necesitamos el business_id o filtrar por el token
                // Por ahora retornamos vacío hasta tener una cuenta pro de TikTok con Ads
                return [];
            }

            return [];
        } catch (err) {
            console.error(`Error fetching ${platform} accounts:`, err);
            throw err;
        }
    },

    /**
     * Guarda las cuentas seleccionadas por el usuario en nuestra base de datos
     */
    saveSelectedAccounts: async (platform, accounts) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Sesión no válida");

        // Preparar inserción
        const toInsert = accounts.map(acc => ({
            user_id: user.id,
            platform: platform,
            external_id: acc.id,
            name: acc.name,
            currency: acc.currency,
            is_active: true,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('social_ad_accounts')
            .upsert(toInsert, { onConflict: 'user_id,external_id' });

        if (error) throw error;
        return true;
    },

    /**
     * Obtiene las cuentas guardadas del usuario
     */
    getSelectedAccounts: async () => {
        const { data, error } = await supabase
            .from('social_ad_accounts')
            .select('*')
            .eq('is_active', true);
        
        if (error) throw error;
        return data;
    }
};
