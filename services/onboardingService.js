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
        const country = formData.country || user.user_metadata?.country || 'Ecuador';
        const address = formData.address || user.user_metadata?.address || '';
        const profileType = formData.type || 'client'; // creative or client
        const birthDate = formData.birth_date || user.user_metadata?.birth_date || null;

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

            // --- GENERAR SLUGS PARA NAMESPACING ---
            const sluggify = (text) => text.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^\w ]+/g, '') // Remove non-word chars
                .replace(/ +/g, '-'); // Replace spaces with hyphens

            const industrySlug = sluggify(formData.profileType || 'general');
            const brandSlug = sluggify(brandName);

            // Mapping for human-readable industry names
            const industryMap = {
                'doctor': 'Marketing para Médicos',
                'agro': 'Marketing Agropecuario',
                'legal': 'Marketing Jurídico',
                'personal': 'Marca Personal',
                'ecommerce': 'E-commerce',
                'realestate': 'Bienes Raíces',
                'tech': 'Tecnología / TI',
                'education': 'Educación',
                'horeca': 'Hostelería / HoReCa',
                'marketing': 'Marketing Digital'
            };

            const industryName = industryMap[formData.profileType] || formData.profileType || 'General';

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
                            slug: brandSlug,
                            email: user.email,
                            city: city,
                            country: country,
                            address: address,
                            type: industryName,
                            industry: industryName,
                            specialty: formData.niche || 'General',
                            status: 'ONBOARDING_COMPLETED',
                            priority: 'MEDIUM',
                            plan: 'Basic',
                            birth_date: birthDate,
                            website: formData.website || user.user_metadata?.website || '',
                            goals: formData.goals || [],
                            onboarding_data: formData 
                        }, { onConflict: 'id' })
                        .select()
                        .single();

                    if (!clientError) clientId = clientData.id;
                    else console.warn('[OnboardingService] Error en upsert de cliente:', clientError);

                } else if (profileType === 'creative') {
                    // --- LÓGICA DE RECONCILIACIÓN PARA CREATIVOS EXISTENTES ---
                    if (!teamId) {
                        // 1. Intentar buscar por email en la tabla 'team'
                        const { data: existingByEmail } = await supabase
                            .from('team')
                            .select('id')
                            .eq('email', user.email)
                            .maybeSingle();

                        if (existingByEmail) {
                            teamId = existingByEmail.id;
                        } else {
                            // 2. Intentar buscar por nombre normalizado (para vincular cuentas previamente creadas por admin sin email)
                            const { data: allTeam } = await supabase
                                .from('team')
                                .select('id, name');
                            
                            const normalizeName = (n) => (n || '').toLowerCase()
                                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^\w]/g, '')
                                .trim();

                            const pNameNorm = normalizeName(fullName);
                            const matched = allTeam?.find(t => normalizeName(t.name) === pNameNorm);
                            if (matched) {
                                teamId = matched.id;
                            }
                        }
                    }

                    const targetTeamId = teamId || `TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
                    
                    const mapRoleToDb = (role) => {
                        if (!role) return 'Creative';
                        const r = role.toLowerCase().trim();
                        if (r === 'editor') return 'Editor de Video';
                        if (r === 'filmmaker') return 'Filmmaker';
                        if (r === 'designer' || r === 'diseñador') return 'Diseñador';
                        if (r === 'audio') return 'Ingeniería de Audio';
                        if (r === 'community') return 'Community Manager';
                        if (r === 'photo') return 'Fotografía';
                        if (r === 'model') return 'Modelos';
                        if (r === 'web') return 'Desarrollo Web';
                        if (r === 'print') return 'Imprenta / Merch';
                        if (r === 'event') return 'Eventos / Prod';
                        if (r === 'estratega') return 'Estratega';
                        return role;
                    };

                    const dbRole = mapRoleToDb(formData.role);
                    
                    const { data: teamData, error: teamError } = await supabase
                        .from('team')
                        .upsert({
                            id: targetTeamId,
                            name: fullName,
                            email: user.email || formData.email || '',
                            role: dbRole,
                            status: 'activo',
                            city: city,
                            availability: 'full-time',
                            activetasks: 0,
                            cv_url: formData.cv_url || '',
                            cv_summary: formData.cv_summary || '',
                            skills: formData.skills || [],
                            whatsapp: formData.whatsapp || '',
                            birth_date: birthDate
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
                    email: user.email, // Guardar email en profiles para reconciliaciones futuras
                    role: profileType === 'creative' ? (formData.role || 'CREATIVE').toUpperCase() : profileType.toUpperCase(),
                    client_id: clientId,
                    team_id: teamId,
                    industry: industryName,
                    specialty: formData.niche || 'General',
                    industry_slug: industrySlug,
                    client_slug: brandSlug,
                    cv_url: formData.cv_url || '',
                    cv_summary: formData.cv_summary || '',
                    skills: formData.skills || [],
                    whatsapp: formData.whatsapp || '',
                    birth_date: birthDate,
                    website: formData.website || user.user_metadata?.website || '',
                    country: country,
                    address: address,
                    location: city,
                    goals: formData.goals || []
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
                        country: country,
                        address: address,
                        birth_date: birthDate,
                        profile_type: profileType,
                        industry: industryName,
                        industry_slug: industrySlug,
                        client_slug: brandSlug,
                        crm_usage: formData.businessInfo?.usesCRM || false,
                        goals: formData.goals || [],
                        goal: formData.goals?.[0] || formData.goal || '',
                        niche: formData.niche || '',
                        drive_data: formData.drive || formData.driveData || null,
                        social_links: formData.social || {},
                        primary_color: formData.colors?.primary || '#6366f1',
                        secondary_color: formData.colors?.secondary || '#ec4899',
                        website: formData.website || user.user_metadata?.website || ''
                    }
                });
            } catch (authErr) {
                console.error('[OnboardingService] Error actualizando Auth Metadata:', authErr);
            }

            return { success: true, clientId, industry_slug: industrySlug, client_slug: brandSlug, isUpdate: !!currentProfile?.client_id };

        } catch (error) {
            console.error('[OnboardingService] Error fatal en finalización:', error);
            // Re-lanzamos para que la UI sepa que algo falló seriamente
            throw error;
        }
    }
};
