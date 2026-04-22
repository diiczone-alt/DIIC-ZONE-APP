export const MOCK_DATA = {
    clients: [
        { id: 'gst', name: 'G.S.T', city: 'Santo Domingo', type: 'Agencia', status: 'active', cm: 'Leslie', priority: 'ALTA', plan: 'Estrategia Elite (12 meses)', projects: 5, nextPost: 'Hoy 15:00' },
        { id: 'innova', name: 'Innova Corp', city: 'Santo Domingo', type: 'Corporativo', status: 'active', cm: 'Leslie', priority: 'MEDIA', plan: 'Estrategia Pro (6 meses)', projects: 3, nextPost: 'Mañana' },
        { id: 'nova_santa_anita', name: 'Nova Clínica Santa Anita', city: 'Santo Domingo', type: 'Médico', status: 'active', cm: 'Leslie', priority: 'ALTA', plan: 'Estrategia Elite (12 meses)', projects: 8, nextPost: 'Hoy 18:00' },
        { id: 'cristian_patino', name: 'Dr. Cristian Patiño', city: 'Santo Domingo', type: 'Marca Personal', status: 'active', cm: 'Leslie', priority: 'BAJA', plan: 'Presencia Digital (3 meses)', projects: 2, nextPost: 'Viernes' },
        { id: 'jessica_reyes', name: 'Dra. Jessica Reyes', city: 'Santo Domingo', type: 'Marca Personal', status: 'active', cm: 'Leslie', priority: 'MEDIA', plan: 'Presencia Digital (6 meses)', projects: 2, nextPost: 'Lunes' },
        { id: 'agro_ecuador', name: 'Servicios Agropecuarios Ecuador', city: 'Santo Domingo', type: 'Industrial', status: 'active', cm: 'Leslie', priority: 'MEDIA', plan: 'Estrategia Pro (6 meses)', projects: 4, nextPost: 'Hoy 17:30' },
        { id: 'dental_rm', name: 'Clínica Dental RM', city: 'Santo Domingo', type: 'Médico', status: 'active', cm: 'Leslie', priority: 'ALTA', plan: 'Estrategia Elite (12 meses)', projects: 4, nextPost: 'Hoy 20:00' },
        { id: 'inmobiliaria_city', name: 'Inmobiliaria City', city: 'Santo Domingo', type: 'Corporativo', status: 'active', cm: 'Leslie', priority: 'MEDIA', plan: 'Presencia Digital (6 meses)', projects: 2, nextPost: 'Mañana' },
        { id: 'restaurante_k', name: 'Restaurante K', city: 'Santo Domingo', type: 'Alimentos', status: 'paused', cm: 'Leslie', priority: 'BAJA', plan: 'Presencia Digital (3 meses)', projects: 0, nextPost: '-' },
        { id: 'hospital_nova', name: 'Hospital Nova Clínica', city: 'Santo Domingo', type: 'Médico', status: 'active', cm: 'Leslie', priority: 'ALTA', plan: 'Estrategia Elite (12 meses)', projects: 6, nextPost: 'Hoy 19:00' },
        { id: 'global_media', name: 'Global Media Group', city: 'Quito', type: 'Corporativo', status: 'active', cm: 'Andrea', priority: 'MEDIA', plan: 'Estrategia Pro (6 meses)', projects: 3, nextPost: 'Mañana' },
    ],
    team: [
        { id: 'leslie', name: 'Leslie', role: 'Community Manager', status: 'activo', city: 'Santo Domingo', coords: [-0.2520, -79.1730], availability: 'alta', activeTasks: 2 },
        { id: 'andrea', name: 'Andrea', role: 'Community Manager', status: 'activo', city: 'Quito', coords: [-0.1820, -78.4680], availability: 'media', activeTasks: 5 },
        { id: 'jocelyn', name: 'Jocelyn', role: 'Community Manager', status: 'activo', city: 'Manta', coords: [-0.9680, -80.7090], availability: 'alta', activeTasks: 1 },
        { id: 'fausto', name: 'Fausto', role: 'Editor de Video', status: 'ocupado', city: 'Santo Domingo', coords: [-0.2545, -79.1760], availability: 'baja', activeTasks: 8 },
        { id: 'anthony', name: 'Anthony', role: 'Editor de Video', status: 'activo', city: 'Guayaquil', coords: [-2.1710, -79.9224], availability: 'media', activeTasks: 3 },
        { id: 'jimmy', name: 'Jimmy', role: 'Editor de Video', status: 'activo', city: 'Santo Domingo', coords: [-0.2500, -79.1690], availability: 'alta', activeTasks: 2 },
        { id: 'marcos', name: 'Marcos', role: 'Diseñador', status: 'activo', city: 'Quito', coords: [-0.1900, -78.4800], availability: 'media', activeTasks: 4 },
        { id: 'carlos', name: 'Carlos', role: 'Filmmaker', status: 'activo', city: 'Guayaquil', coords: [-2.1894, -79.8890], availability: 'alta', activeTasks: 1 },
    ],
    services: [
        {
            id: 'presence',
            name: 'NIVEL 1: STARTER KIT (Activación Digital)',
            price: 250,
            setupFee: 50,
            threeMonthPrice: 650,
            level: 'ESENCIAL',
            enfoque: 'CONFIANZA VISUAL',
            filmmaker: '1 SESIÓN MENSUAL',
            narrative: 'Deja de perder clientes por tener un feed abandonado. Creamos tu vitrina digital profesional para activar la confianza inmediata en nuevos prospectos.',
            deliverables: { reels: '2', posts: '6', stories: '10' },
            features: ['1 Rodaje Mensual (2h)', '2 Reels Premium', '6 Carruseles Educativos / Posts', 'Gestión de Comunidad', 'Plan de Contenido Mensual']
        },
        {
            id: 'growth',
            name: 'NIVEL 2: GROWTH ENGINE (Tráfico & Ventas)',
            price: 450,
            setupFee: 100,
            threeMonthPrice: 1200,
            level: 'MÁS VENDIDO',
            enfoque: 'CONVERSIÓN & LEADS',
            filmmaker: '2 SESIONES MENSUALES',
            narrative: 'No solo visualizaciones, sino clientes. Implementamos un motor de captación orgánico que lleva tráfico cualificado directo a tu WhatsApp 24/7.',
            deliverables: { reels: '6', posts: '10', stories: '15' },
            features: ['2 Rodajes Mensuales (4h)', '6 Reels de Conversión (Hook/Story/CTA)', '10 Diseños de Alto Valor', 'Community Manager Activo', 'Estrategia de Captación', 'Optimización de Perfil (SEO + CTA)']
        },
        {
            id: 'authority',
            name: 'NIVEL 3: ELITE AUTHORITY (Dominio de Mercado)',
            price: 850,
            setupFee: 150,
            threeMonthPrice: 2300,
            level: 'ALTO VALOR',
            enfoque: 'POSICIONAMIENTO TOP TIER',
            filmmaker: 'CONTENIDO ILIMITADO (4 SESIONES)',
            narrative: 'Conviértete en la única opción lógica en tu ciudad. Producción cinematográfica, narrativa de marca y saturación en todas las plataformas principales.',
            deliverables: { reels: '12', posts: '15', stories: '30' },
            features: ['Rodajes Ilimitados (4 Sesiones/Mes)', '12 Reels Virales / Cinematográficos', '15 Carruseles y Flyers Promocionales', 'Configuración Básica de Embudos + ManyChat', '1 Spot Promocional de Alta Calidad (Mensual)']
        },
    ],
    automations: [
        {
            id: 'systems',
            name: 'NIVEL 4: SISTEMAS',
            items: ['CRM (Gestión de Clientes)', 'Chatbot (Respuestas Automáticas)', 'Landing Page (Captación de Leads)'],
            price: 'Se cotiza según necesidad',
            narrative: 'A medida que tu marca crece, implementamos sistemas para mejorar resultados.'
        },
        {
            id: 'scale',
            name: 'NIVEL 5: ESCALA',
            items: ['Página Web Profesional', 'Embudos de Venta', 'Automatización Avanzada'],
            price: 'Se cotiza como proyecto',
            narrative: 'Lleva tu negocio al siguiente nivel con infraestructura de alto rendimiento.'
        }
    ],
    tasks: [
        { id: 1, title: 'Reel Lanzamiento Q4', client: 'Nova Clínica', status: 'todo', priority: 'high', assigned_role: 'editor' },
        { id: 2, title: 'Testimonial Dr. Perez', client: 'Novaurology', status: 'in-progress', priority: 'medium', assigned_role: 'editor' },
        { id: 3, title: 'Post Carrusel Agro', client: 'DIIC Media', status: 'review', priority: 'low', assigned_role: 'design' },
        { id: 4, title: 'Rodaje Clínica Rey', client: 'Nova Clínica', status: 'todo', priority: 'high', assigned_role: 'filmmaker' },
        { id: 5, title: 'Edición Podcast Ep. 12', client: 'DIIC Media', status: 'completed', priority: 'medium', assigned_role: 'editor' },
        { id: 6, title: 'Campaña Ads Novaurology', client: 'Novaurology', status: 'in-progress', priority: 'high', assigned_role: 'community' },
        { id: 7, title: 'Edición reel corporativo', client: 'Nova Clínica', status: 'todo', priority: 'high', assigned_role: 'editor' },
    ],
    strategies: [
        { id: 1, client_id: 'nova', title: 'Estrategia Q4', status: 'active' }
    ],
    // ... (keep others if needed, but these are the main ones)
    production_rates: [
        // ====== PRODUCCIÓN ======
        { id: 'prod_reel_full', name: 'Reel Full Producción', cost_internal: 15, price_sale: 45, unit: 'video', description: 'Locación, conceptualización, hook script, grabación 4K, edición pro y sound design (Doble Margen).' },
        { id: 'prod_reel_edit', name: 'Reel (Solo Edición)', cost_internal: 8, price_sale: 25, unit: 'video', description: 'Montaje dinámico de material crudo del cliente. Subtítulos Alex Hormozi style, b-roll y retención al 100%.' },
        { id: 'prod_podcast', name: 'Video Podcast / Entrevista', cost_internal: 30, price_sale: 150, unit: 'episodio', description: 'Hasta 3 cámaras, montaje en multicam, masterización de audio y entrega (45-60 min).' },
        { id: 'prod_promo', name: 'Video Spot Promocional (Cinematic)', cost_internal: 50, price_sale: 200, unit: 'video', description: 'Pieza Hero (1-2 mins) orientada a conversión para pauta publicitaria. Grabación PRO y guion.' },
        { id: 'prod_photo', name: 'Sesión de Fotografía Comercial', cost_internal: 35, price_sale: 120, unit: 'sesión', description: 'Sesión en locación (1-2h), setup de iluminación flash y entrega de 30 fotografías con revelado.' },
        
        // ====== DISEÑO ======
        { id: 'dsn_carrusel', name: 'Carrusel Educativo (Premium)', cost_internal: 10, price_sale: 35, unit: 'pieza', description: 'Diseño persuasivo (5 a 8 slides), copywriting integrado y cover enganchador para guardar y compartir.' },
        { id: 'dsn_post', name: 'Post de Diseño Visual', cost_internal: 5, price_sale: 15, unit: 'pieza', description: 'Gráfica estática de alto valor visual para notices rápidos, quotes, infografías simples.' },
        { id: 'dsn_imprenta', name: 'Diseño Imprenta (Branding)', cost_internal: 15, price_sale: 40, unit: 'pieza', description: 'Banners, flyers físicos, gigantografías, tarjetas de presentación preparados para plot final.' },
        { id: 'dsn_portada', name: 'Miniaturas (Thumbnails) YouTube', cost_internal: 5, price_sale: 20, unit: 'pieza', description: 'Diseño especializado en puro CTR para plataformas de video o portadas impactantes de Reels.' },

        // ====== ESTRATEGIA Y GESTIÓN ======
        { id: 'str_cm', name: 'Gestión Community Manager', cost_internal: 80, price_sale: 200, unit: 'mes', description: 'Moderación de comunidad, publicación de parrilla, engagement manual con leads y stories pasivas diarias.' },
        { id: 'str_strat', name: 'Estrategia Orgánica Comercial', cost_internal: 30, price_sale: 100, unit: 'setup', description: 'Research de mercado, pilares y content buckets. Ángulos de venta y definición de perfiles demográficos.' },
        { id: 'str_ads', name: 'Gestión Meta Ads (Trafficker)', cost_internal: 50, price_sale: 150, unit: 'setup', description: 'Estructuración de campaña Base, segmentación avanzada, testing de creativos y Optimización diaria.' },
        { id: 'str_auto', name: 'Automatización (ManyChat / CRMs)', cost_internal: 20, price_sale: 80, unit: 'flujo', description: 'Flujos lógicos para responder a comentarios y DM, llevando al cliente a WhatsApp o Lead Form automáticamente.' }
    ],
    crm_stages: [
        { id: 'lead', title: 'Nuevos Leads', color: 'bg-blue-500', items: 5 },
        { id: 'qualifying', title: 'Calificando (IA)', color: 'bg-indigo-500', items: 3 },
        { id: 'offer', title: 'Propuesta Enviada', color: 'bg-yellow-500', items: 2 },
        { id: 'closing', title: 'Cierre / Pago', color: 'bg-green-500', items: 1 },
    ],
    profiles: [
        { id: 'a95d5a4c-093d-4806-85c5-45bf6ed3f76f', role: 'ADMIN', full_name: 'Admin DIIC' },
        { id: 'd5a277d0-1e52-4416-8975-430ea47f7d14', role: 'COMMUNITY', full_name: 'Reyshell (Quito)' },
        { id: '46db6cc3-a1eb-4993-9c8e-5b2da24a8738', role: 'COMMUNITY', full_name: 'Leslie' },
        { id: 'jessica_user_id', role: 'CLIENT', full_name: 'Dra. Jessica Reyes', client_id: 'jessica_reyes', brand: 'Nova Estética' },
    ],
    social_analytics: [
        { user_id: 'jessica_user_id', platform: 'instagram', followers_count: 12450, followers_growth: 120, engagement_rate: 4.8, total_interactions: 8540 },
        { user_id: 'jessica_user_id', platform: 'facebook', followers_count: 5200, followers_growth: 45, engagement_rate: 2.1, total_interactions: 1200 },
        { user_id: 'jessica_user_id', platform: 'youtube', followers_count: 850, followers_growth: 15, engagement_rate: 6.2, total_interactions: 450 },
    ],
    brand_analytics: [
        { user_id: 'jessica_user_id', current_level: 2, growth_percentage: 15, health_score: 88, updated_at: new Date().toISOString() }
    ],
    campaigns: [
        { id: 'camp_001', user_id: 'jessica_user_id', name: 'Captación Médica Q4', type: 'FULL', objective: 'LEADS', status: 'ACTIVE', budget_daily: 25.00 },
        { id: 'camp_002', user_id: 'jessica_user_id', name: 'Branding Nova Estética', type: 'BOOST', objective: 'OUTREACH', status: 'ACTIVE', budget_daily: 10.00 }
    ],
    insights_daily: [
        { date: '2026-04-12', campaign_id: 'camp_001', spend: 24.50, impressions: 4500, reach: 3200, clicks: 88, conversions: 12 },
        { date: '2026-04-13', campaign_id: 'camp_001', spend: 25.10, impressions: 4800, reach: 3400, clicks: 92, conversions: 14 },
        { date: '2026-04-14', campaign_id: 'camp_001', spend: 24.80, impressions: 4200, reach: 3100, clicks: 75, conversions: 9 },
        { date: '2026-04-15', campaign_id: 'camp_001', spend: 26.00, impressions: 5100, reach: 3800, clicks: 110, conversions: 18 },
        { date: '2026-04-16', campaign_id: 'camp_001', spend: 25.20, impressions: 4600, reach: 3300, clicks: 84, conversions: 11 },
        { date: '2026-04-17', campaign_id: 'camp_001', spend: 24.90, impressions: 4400, reach: 3150, clicks: 79, conversions: 10 },
        { date: '2026-04-18', campaign_id: 'camp_001', spend: 25.50, impressions: 4750, reach: 3500, clicks: 95, conversions: 15 }
    ],
    crm_leads: [
        { id: 1, user_id: 'jessica_user_id', name: 'Maria Garcia', status: 'lead', source: 'Instagram Ads', date: '2026-04-18' },
        { id: 2, user_id: 'jessica_user_id', name: 'Juan Perez', status: 'qualifying', source: 'WhatsApp Bot', date: '2026-04-18' },
        { id: 3, user_id: 'jessica_user_id', name: 'Elena Torres', status: 'offer', source: 'Facebook Ads', date: '2026-04-17' }
    ]
};


