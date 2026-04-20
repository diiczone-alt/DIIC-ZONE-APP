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

        console.log('[OnboardingService] Iniciando finalización para:', user.email);

        try {
            // A. Obtener el perfil actual para ver si ya tenemos un ID asociado
            const { data: currentProfile } = await supabase
                .from('profiles')
                .select('client_id, team_id')
                .eq('id', user.id)
                .single();

            let clientId = currentProfile?.client_id;
            let teamId = currentProfile?.team_id;

            // 2. Sincronización de Base de Datos (Clients or Team)
            try {
                if (profileType === 'client') {
                    // --- LÓGICA ANTI-DUPLICADOS (Búsqueda Proactiva) ---
                    if (!clientId) {
                        const { data: existingClient } = await supabase
                            .from('clients')
                            .select('id')
                            .eq('email', user.email)
                            .maybeSingle();
                        
                        if (existingClient) {
                            console.log('[OnboardingService] Cliente existente detectado mediante email:', existingClient.id);
                            clientId = existingClient.id;
                        }
                    }

                    const targetId = clientId || `${brandName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
                    
                    const { data: clientData, error: clientError } = await supabase
                        .from('clients')
                        .upsert({
                            id: targetId,
                            name: brandName,
                            email: user.email,
                            city: city,
                            type: formData.profileType || 'Business',
                            status: 'ONBOARDING_COMPLETED',
                            priority: 'MEDIUM',
                            plan: 'STARTUP',
                            onboarding_data: formData 
                        }, { onConflict: 'id' })
                        .select()
                        .single();

                    if (!clientError) clientId = clientData.id;
                    else console.warn('[OnboardingService] Error en upsert de cliente:', clientError);

                } else if (profileType === 'creative') {
                    const targetTeamId = teamId || `TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
                    
                    const { data: teamData, error: teamError } = await supabase
                        .from('team')
                        .upsert({
                            id: targetTeamId,
                            name: fullName,
                            email: user.email || formData.email || '',
                            role: formData.role || 'Creative',
                            status: 'activo',
                            city: city,
                            availability: 'full-time',
                            activetasks: 0,
                            cv_url: formData.cv_url || '',
                            cv_summary: formData.cv_summary || '',
                            skills: formData.skills || [],
                            whatsapp: formData.whatsapp || ''
                        }, { onConflict: 'id' })
                        .select()
                        .single();

                    if (!teamError) teamId = teamData.id;
                    else console.warn('[OnboardingService] Error en upsert de equipo:', teamError);
                }
            } catch (dbErr) {
                console.error('[OnboardingService] Error crítico en DB Sync:', dbErr);
            }

            // 3. Actualizar el Perfil del Usuario
            try {
                const profileUpdate = {
                    full_name: fullName,
                    role: profileType === 'creative' ? (formData.role || 'CREATIVE').toUpperCase() : profileType.toUpperCase(),
                    client_id: clientId,
                    team_id: teamId,
                    cv_url: formData.cv_url || '',
                    cv_summary: formData.cv_summary || '',
                    skills: formData.skills || [],
                    whatsapp: formData.whatsapp || ''
                };

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update(profileUpdate)
                    .eq('id', user.id);

                if (profileError) console.warn('[OnboardingService] Error actualizando perfil:', profileError);
            } catch (profErr) {
                console.error('[OnboardingService] Error crítico en Profile Update:', profErr);
            }

            // 4. Guardar Metadatos extendidos en Auth
            try {
                await supabase.auth.updateUser({
                    data: {
                        onboarding_completed: true,
                        brand: brandName,
                        city: city,
                        profile_type: profileType,
                        crm_usage: formData.businessInfo?.usesCRM || false,
                        goal: formData.goal || '',
                        niche: formData.niche || '',
                        drive_data: formData.drive || formData.driveData || null,
                        social_links: formData.social || {}
                    }
                });
            } catch (authErr) {
                console.error('[OnboardingService] Error actualizando Auth Metadata:', authErr);
            }

            return { success: true, clientId, isUpdate: !!currentProfile?.client_id };

        } catch (error) {
            console.error('[OnboardingService] Error fatal en finalización:', error);
            // Re-lanzamos para que la UI sepa que algo falló seriamente
            throw error;
        }
    }
};
