/**
 * Client Progress & Activation Center Helpers
 * Synchronizes completion state across Dashboard, Profile ("Mi Progreso"), and Strategic Hubs.
 */

export const getChecklistItems = (clientData) => {
    const ob = clientData?.onboarding_data || {};
    const cp = ob.company_profile || {};
    const brand = ob.brand || {};
    const social = ob.social || {};

    const isCompanyInfoCompleted = !!cp.completed || !!(clientData?.name && (clientData?.address || clientData?.city));
    const isDriveCompleted = !!clientData?.google_drive_folder_id || !!ob.drive_connected;
    const isCalendarCompleted = !!ob.calendar_connected;
    const isLogoCompleted = !!brand.logo || !!clientData?.logo_url;
    const isBrandIdentityCompleted = !!brand.completed ||
        !!ob.strategic?.completed ||
        !!(clientData?.primary_color && clientData?.secondary_color) ||
        !!(brand.primaryColor && (brand.typography || brand.typography_custom));
    const isSocialCompleted = !!social.completed ||
        !!social.facebook_connected ||
        !!social.instagram ||
        !!social.facebook ||
        !!social.tiktok ||
        !!social.whatsapp;
    const isGrowthLevelCompleted = !!ob.growth_level_completed || !!clientData?.plan || !!clientData?.growth_level;

    return [
        {
            id: 'info',
            label: 'Información de empresa',
            description: 'Nombre, ciudad, dirección y datos corporativos',
            completed: isCompanyInfoCompleted,
            actionLabel: 'Completar Datos',
            category: 'setup'
        },
        {
            id: 'drive',
            label: 'Conectar Google Drive',
            description: 'Almacenamiento y estructura de activos en la nube',
            completed: isDriveCompleted,
            actionLabel: 'Vincular Drive',
            category: 'cloud'
        },
        {
            id: 'calendar',
            label: 'Activar Google Calendar',
            description: 'Sincronización de entregas, rodajes y reuniones',
            completed: isCalendarCompleted,
            actionLabel: 'Activar Calendario',
            category: 'production'
        },
        {
            id: 'logo',
            label: 'Subir logo',
            description: 'Logotipo oficial en alta resolución o formato vectorial',
            completed: isLogoCompleted,
            actionLabel: 'Cargar Logo',
            category: 'branding'
        },
        {
            id: 'visual',
            label: 'Identidad de la marca',
            description: 'Paleta cromática de 3 colores y tipografías',
            completed: isBrandIdentityCompleted,
            actionLabel: 'Configurar Marca',
            category: 'branding'
        },
        {
            id: 'social',
            label: 'Conectar redes sociales',
            description: 'Meta (IG & Facebook), TikTok, WhatsApp o YouTube',
            completed: isSocialCompleted,
            actionLabel: 'Vincular Redes',
            category: 'social'
        },
        {
            id: 'growth',
            label: 'Elegir nivel de crecimiento',
            description: 'Plan de aceleración y alcance estratégico',
            completed: isGrowthLevelCompleted,
            actionLabel: 'Seleccionar Plan',
            category: 'strategy'
        }
    ];
};

export const calculateActivationProgress = (checklistItems) => {
    if (!checklistItems || checklistItems.length === 0) return 20;
    const completedCount = checklistItems.filter(item => item.completed).length;
    // 20% base for registered account + up to 80% for the 7 items
    return Math.min(100, 20 + Math.round((completedCount / checklistItems.length) * 80));
};

/**
 * Derives dynamic level meta completion based on real database records
 * merged with any manual checkbox overrides in onboarding_data.completedMetas
 */
export const deriveMetasStatus = (clientData, metas = []) => {
    const ob = clientData?.onboarding_data || {};
    const cp = ob.company_profile || {};
    const brand = ob.brand || {};
    const social = ob.social || {};
    const savedMetas = ob.completedMetas || {};

    const computed = {};

    metas.forEach(meta => {
        const id = meta.id;
        let isAutoCompleted = false;

        switch (id) {
            case 'logo':
                isAutoCompleted = !!brand.logo || !!clientData?.logo_url;
                break;
            case 'colors':
                isAutoCompleted = !!(brand.primaryColor || clientData?.primary_color);
                break;
            case 'bio':
                isAutoCompleted = !!(cp.description || clientData?.specialty || clientData?.industry);
                break;
            case 'photo':
                isAutoCompleted = !!(clientData?.google_drive_folder_id || brand.logo || clientData?.logo_url);
                break;
            case 'socials':
                isAutoCompleted = !!(social.facebook_connected || social.completed || social.instagram || social.facebook);
                break;
            case 'posts6':
                isAutoCompleted = !!(clientData?.projects?.length >= 6 || clientData?.social_metrics?.length > 0 || savedMetas['posts6']);
                break;
            case 'calendar':
                isAutoCompleted = !!ob.calendar_connected;
                break;
            case 'posts12':
                isAutoCompleted = !!(clientData?.projects?.length >= 12 || savedMetas['posts12']);
                break;
            case 'reels2':
                isAutoCompleted = !!(savedMetas['reels2']);
                break;
            case 'profile':
                isAutoCompleted = !!(cp.completed || (clientData?.address && clientData?.city));
                break;
            case 'message':
                isAutoCompleted = !!(social.whatsapp || clientData?.whatsapp_number || savedMetas['message']);
                break;
            case 'crmactive':
                isAutoCompleted = !!(clientData?.has_crm || savedMetas['crmactive']);
                break;
            case 'ads':
                isAutoCompleted = !!(ob.meta_campaigns?.length > 0 || savedMetas['ads']);
                break;
            case 'proweb':
                isAutoCompleted = !!(cp.website || clientData?.website || savedMetas['proweb']);
                break;
            case 'schedu':
                isAutoCompleted = !!(ob.calendar_connected || savedMetas['schedu']);
                break;
            case 'autobasic':
                isAutoCompleted = !!(clientData?.has_agents || savedMetas['autobasic']);
                break;
            default:
                isAutoCompleted = false;
        }

        computed[id] = savedMetas[id] !== undefined ? !!savedMetas[id] : isAutoCompleted;
    });

    return computed;
};
