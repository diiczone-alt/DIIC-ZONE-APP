import { supabase } from '@/lib/supabase';

export const onboardingService = {
    /**
     * Finaliza el onboarding guardando la información en las tablas permanentes de Supabase.
     * @param {Object} formData - Todo el estado recolectado del wizard.
     * @param {Object} user - El usuario autenticado actual.
     */
    finalizeOnboarding: async (formData, user) => {
        if (!user) throw new Error('Usuario no autenticado para finalizar onboarding');

        // 1. Preparar datos de Identidad
        const fullName = formData.name || user.user_metadata?.full_name || '';
        const brandName = formData.brand || user.user_metadata?.brand || 'Sin Marca';
        const city = formData.city || user.user_metadata?.city || 'Santo Domingo';
        const profileType = formData.type || 'client'; // creative or client

        try {
            let clientId = null;

            // 2. Si es un CLIENTE, crear/actualizar su entrada en public.clients
            if (profileType === 'client') {
                // Generamos un ID amigable si no existe (ej: MARCA-123)
                const generatedClientId = `${brandName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
                
                const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .insert({
                        id: generatedClientId, // Asumimos que id es text
                        name: brandName,
                        city: city,
                        type: formData.profileType || 'Business',
                        status: 'ONBOARDING_COMPLETED',
                        priority: 'MEDIUM',
                        plan: 'STARTUP' // Default
                    })
                    .select()
                    .single();

                if (clientError) {
                    console.error('Error creating client entry:', clientError);
                    // Si el error es por ID duplicado, intentamos un update o simplemente seguimos
                } else {
                    clientId = clientData.id;
                }
            } else if (profileType === 'creative') {
                // Registrar en la tabla de EQUIPO (TEAM)
                const teamMemberId = `TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
                const { error: teamError } = await supabase
                    .from('team')
                    .insert({
                        id: teamMemberId,
                        name: fullName,
                        role: formData.role || 'Creative',
                        status: 'activo',
                        city: city,
                        availability: 'full-time',
                        activetasks: 0
                    });

                if (teamError) {
                    console.error('Error creating team entry:', teamError);
                }
            }

            // 3. Actualizar el Perfil del Usuario
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    role: profileType.toUpperCase(),
                    client_id: clientId,
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 4. Guardar Metadatos extendidos (CRM, Metas, Drive, Social) en user_metadata de Auth
            await supabase.auth.updateUser({
                data: {
                    onboarding_completed: true,
                    brand: brandName,
                    city: city,
                    profile_type: profileType,
                    crm_usage: formData.businessInfo?.usesCRM || false,
                    crm_name: formData.businessInfo?.crmName || '',
                    appointment_tool: formData.businessInfo?.appointmentTool || '',
                    whatsapp: formData.businessInfo?.whatsapp || '',
                    goal: formData.goal || '',
                    niche: formData.niche || '',
                    drive_data: formData.drive || formData.driveData || null,
                    social_links: formData.social || {}
                }
            });

            return { success: true, clientId };

        } catch (error) {
            console.error('[OnboardingService] Error in finalization:', error);
            throw error;
        }
    }
};
