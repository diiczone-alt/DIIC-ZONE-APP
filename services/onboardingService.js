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
        const fullName = formData.name || formData.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '';
        const brandName = formData.brand || user.user_metadata?.brand || (fullName ? `${fullName} Workspace` : 'Sin Marca');
        const city = formData.city || user.user_metadata?.city || 'Santo Domingo';
        const country = formData.country || user.user_metadata?.country || 'Ecuador';
        const address = formData.address || user.user_metadata?.address || '';
        
        // Smart Creative Detection: Check form data, metadata and name patterns
        const hasCreativeIndicators = 
            formData.role || 
            user.user_metadata?.role === 'CREATOR' || 
            user.user_metadata?.role === 'COMMUNITY' ||
            fullName.toUpperCase().includes(' CM') || 
            fullName.toUpperCase().includes('(CM)') ||
            fullName.toUpperCase().includes('ESTRATEGA');

        let profileType = formData.type || user.user_metadata?.type || user.user_metadata?.profile_type;
        if (!profileType || (profileType === 'client' && hasCreativeIndicators && formData.role)) {
            profileType = hasCreativeIndicators ? 'creative' : 'client';
        }

        const birthDate = formData.birth_date || user.user_metadata?.birth_date || null;

        console.log('[OnboardingService] Iniciando finalización para:', user.email, 'Tipo:', profileType);

        try {
            // A. Obtener el perfil actual para ver si ya tenemos un ID asociado
            const { data: currentProfile } = await supabase
                .from('profiles')
                .select('client_id, team_id')
                .eq('id', user.id)
                .maybeSingle();

            let clientId = currentProfile?.client_id;
            let teamId = currentProfile?.team_id;
            let creativeCode = null;

            // --- GENERAR SLUGS PARA NAMESPACING ---
            const sluggify = (text) => text.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^\w ]+/g, '') // Remove non-word chars
                .replace(/ +/g, '-'); // Replace spaces with hyphens

            const industrySlug = sluggify(formData.profileType || 'general');
            const brandSlug = sluggify(brandName);

            // Mapping for human-readable industry names
            const industryMap = {
                'doctor': 'Médico',
                'health': 'Clínica / Hospital',
                'agro': 'Agropecuario',
                'horeca': 'Restaurante',
                'legal': 'Jurídico',
                'realestate': 'Inmobiliario',
                'education': 'Educación',
                'tech': 'Empresa',
                'other': 'Otro'
            };

            const industryName = industryMap[formData.profileType] || formData.profileType || 'General';

            // 2. Sincronización de Base de Datos (Clients or Team)
            try {
                if (profileType === 'client') {
                    const targetClientId = clientId || `CLI-${Math.floor(1000 + Math.random() * 9000)}`;
                    const { data: clientData, error: clientError } = await supabase
                        .from('clients')
                        .upsert({
                            id: targetClientId,
                            name: brandName,
                            contact: fullName,
                            email: user.email || formData.email || '',
                            industry: industryName,
                            category: formData.profileType || 'general',
                            city: city,
                            country: country,
                            address: address,
                            whatsapp: formData.whatsapp || user.user_metadata?.whatsapp || '',
                            plan: 'Pro',
                            status: 'activo',
                            health: 'excelente',
                            monthly_growth: '+0.0%',
                            social: formData.social || {},
                            crm_usage: formData.businessInfo?.usesCRM || false,
                            brand_identity: formData.brandIdentity || {}
                        }, { onConflict: 'id' })
                        .select()
                        .maybeSingle();

                    if (!clientError && clientData) clientId = clientData.id;
                    else console.warn('[OnboardingService] Error en upsert de cliente:', clientError);

                } else if (profileType === 'creative') {
                    // --- LÓGICA DE RECONCILIACIÓN PARA CREATIVOS EXISTENTES ---
                    if (!teamId) {
                        // 1. Intentar buscar por email en la tabla 'team'
                        if (user.email) {
                            const { data: existingByEmail } = await supabase
                                .from('team')
                                .select('id, code')
                                .ilike('email', user.email)
                                .maybeSingle();

                            if (existingByEmail) {
                                teamId = existingByEmail.id;
                                creativeCode = existingByEmail.code;
                            }
                        }
                        
                        if (!teamId && fullName) {
                            // 2. Intentar buscar por nombre normalizado
                            const { data: existingByName } = await supabase
                                .from('team')
                                .select('id, code')
                                .ilike('name', fullName)
                                .maybeSingle();

                            if (existingByName) {
                                teamId = existingByName.id;
                                creativeCode = existingByName.code;
                            }
                        }
                    }

                    const targetTeamId = teamId || `tea-${Math.floor(1000 + Math.random() * 9000)}`;
                    
                    const mapRoleToDb = (role) => {
                        if (!role) {
                            if (fullName.toUpperCase().includes('CM') || fullName.toUpperCase().includes('ESTRATEGA')) {
                                return 'Community Manager';
                            }
                            return 'Community Manager';
                        }
                        const r = role.toLowerCase().trim();
                        if (r === 'editor') return 'Editor de Video';
                        if (r === 'filmmaker') return 'Filmmaker';
                        if (r === 'designer' || r === 'diseñador') return 'Diseñador';
                        if (r === 'audio') return 'Ingeniería de Audio';
                        if (r === 'community' || r === 'cm' || r.includes('community')) return 'Community Manager';
                        if (r === 'photo' || r === 'fotografía') return 'Fotografía';
                        if (r === 'model' || r === 'modelos') return 'Modelos';
                        if (r === 'web') return 'Desarrollo Web';
                        if (r === 'print') return 'Imprenta / Merch';
                        if (r === 'event') return 'Eventos / Prod';
                        if (r === 'estratega') return 'Estratega';
                        return role;
                    };

                    const dbRole = mapRoleToDb(formData.role);

                    if (!creativeCode) {
                        const sluggifyName = (fullName || 'CORP').replace(/[^a-zA-Z]/g, '').toUpperCase();
                        const namePart = sluggifyName.substring(0, 4) || 'CORP';
                        const randomPart = Math.floor(1000 + Math.random() * 9000);
                        creativeCode = `DIIC-${namePart}-${randomPart}`;
                    }
                    
                    const teamPayload = {
                        id: targetTeamId,
                        name: fullName || 'Talento Creativo',
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
                        birth_date: birthDate,
                        code: creativeCode,
                        portfolio_url: formData.website || formData.portfolio_url || '',
                        website: formData.website || ''
                    };

                    const { data: teamData, error: teamError } = await supabase
                        .from('team')
                        .upsert(teamPayload, { onConflict: 'id' })
                        .select()
                        .maybeSingle();

                    if (!teamError && teamData) {
                        teamId = teamData.id;
                    } else {
                        console.warn('[OnboardingService] Fallback en upsert de equipo, intentando update directo:', teamError?.message);
                        if (user.email) {
                            const { data: updatedTeam } = await supabase
                                .from('team')
                                .update(teamPayload)
                                .ilike('email', user.email)
                                .select()
                                .maybeSingle();
                            if (updatedTeam) teamId = updatedTeam.id;
                        }
                    }
                }
            } catch (dbErr) {
                console.error('[OnboardingService] Error crítico en DB Sync:', dbErr);
            }

            // 3. Actualizar el Perfil del Usuario
            try {
                const mapProfileRole = (pType, rawRole) => {
                    if (pType !== 'creative') return 'CLIENT';
                    if (!rawRole) return 'COMMUNITY';
                    const r = rawRole.toLowerCase();
                    if (r.includes('community') || r.includes('cm') || r.includes('estratega')) return 'COMMUNITY';
                    if (r.includes('film')) return 'FILMMAKER';
                    if (r.includes('edit')) return 'EDITOR';
                    if (r.includes('diseñ') || r.includes('design')) return 'DESIGNER';
                    if (r.includes('audio')) return 'AUDIO';
                    return rawRole.toUpperCase();
                };

                const finalProfileRole = mapProfileRole(profileType, formData.role);

                const profileUpdate = {
                    full_name: fullName,
                    email: user.email, // Guardar email en profiles para reconciliaciones futuras
                    role: finalProfileRole,
                    client_id: clientId || null,
                    team_id: teamId || null,
                    industry: industryName,
                    specialty: formData.role ? formData.role.toUpperCase() : (formData.niche || 'General'),
                    industry_slug: industrySlug,
                    client_slug: brandSlug,
                    cv_url: formData.cv_url || '',
                    cv_summary: formData.cv_summary || '',
                    skills: formData.skills || [],
                    whatsapp: formData.whatsapp || '',
                    birth_date: birthDate,
                    website: formData.website || user.user_metadata?.website || '',
                    portfolio_url: formData.website || formData.portfolio_url || user.user_metadata?.website || '',
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

            // 5. Crear notificaciones para los Administradores
            try {
                const { data: admins } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('role', 'ADMIN');

                if (admins && admins.length > 0) {
                    const notificationsToInsert = admins.map(admin => {
                        let title, message, link, type;
                        if (profileType === 'client') {
                            title = 'Nuevo Cliente Registrado';
                            message = `El cliente "${brandName}" (${fullName}) ha completado el onboarding. Asigna un Community Manager y Estratega.`;
                            link = '/dashboard/hq/clients';
                            type = 'NEW_CLIENT';
                        } else {
                            title = 'Nuevo Creativo Registrado';
                            message = `El creativo "${fullName}" (${formData.role || 'Creativo'}) se ha registrado. Código asignado: ${creativeCode}.`;
                            link = '/dashboard/hq/team';
                            type = 'NEW_CREATIVE';
                        }

                        return {
                            user_id: admin.id,
                            title,
                            message,
                            type,
                            status: 'unread',
                            link,
                            metadata: {
                                profile_id: user.id,
                                name: fullName,
                                brand: brandName,
                                email: user.email,
                                code: profileType === 'creative' ? creativeCode : null,
                                role: profileType === 'creative' ? formData.role : 'CLIENT'
                            }
                        };
                    });

                    const { error: insertErr } = await supabase
                        .from('notifications')
                        .insert(notificationsToInsert);
                    
                    if (insertErr) {
                        console.warn('[OnboardingService] Error al insertar notificaciones de admin:', insertErr);
                    } else {
                        console.log('[OnboardingService] Notificaciones de admin creadas correctamente.');
                    }
                }
            } catch (notifErr) {
                console.error('[OnboardingService] Error crítico creando notificaciones de admin:', notifErr);
            }

            return { success: true, clientId, industry_slug: industrySlug, client_slug: brandSlug, isUpdate: !!currentProfile?.client_id };

        } catch (error) {
            console.error('[OnboardingService] Error fatal en finalización:', error);
            // Re-lanzamos para que la UI sepa que algo falló seriamente
            throw error;
        }
    }
};
