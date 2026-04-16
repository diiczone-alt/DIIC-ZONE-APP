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
            name: 'NIVEL 1: PRESENCIA DIGITAL',
            price: 250,
            setupFee: 50,
            threeMonthPrice: 300,
            level: 'PRICING INDIVIDUAL',
            enfoque: 'CONFIANZA VISUAL',
            filmmaker: '1 SESIÓN',
            narrative: 'Deja de ser invisible. Construimos tu autoridad digital con contenido profesional desde el primer día.',
            deliverables: { reels: '1', posts: '4', stories: '6-8' },
            features: ['1 Video Filmmaker', '1 Reel', '4 Carruseles', 'Community', 'Calendario']
        },
        {
            id: 'growth',
            name: 'NIVEL 2: CRECIMIENTO',
            price: 350,
            setupFee: 50,
            threeMonthPrice: 450,
            level: 'PLAN CLAVE',
            enfoque: 'CAPTAR CLIENTES',
            filmmaker: '1 SESIÓN',
            narrative: 'No solo publiques, vende. Creamos el sistema que atrae clientes calificados a tu WhatsApp 24/7.',
            deliverables: { reels: '3', posts: '8', stories: '10-15' },
            features: ['1 Video Filmmaker', '3 Reels', '8 Carruseles', 'Community', 'Estrategia', 'Calendario']
        },
        {
            id: 'authority',
            name: 'NIVEL 3: AUTORIDAD',
            price: 500,
            setupFee: 50,
            threeMonthPrice: 850,
            level: 'AUTORIDAD ELITE',
            enfoque: 'AUTORIDAD ELITE',
            filmmaker: '2 SESIONES',
            narrative: 'Conviértete en el referente #1. Producción cinematográfica y narrativa de marca para cobrar lo que realmente vales.',
            deliverables: { reels: '4', posts: '12', stories: '15-25' },
            features: ['2 Videos Filmmaker', '4 Reels', '12 Carruseles', 'Community', 'Estrategia Fuerte', 'Calendario']
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
        { id: 'tiktok', name: 'TikTok (Crecimiento)', price_range: [2.00, 2.50], unit: 'pieza' },
        { id: 'reel', name: 'Instagram Reel (Calidad)', price: 5.00, unit: 'pieza' },
        { id: 'youtube', name: 'YouTube (Largo Formato)', price_min: 10.00, unit: 'video' },
        { id: 'podcast', name: 'Podcast / Entrevistas', price: 20.00, unit: 'episodio' },
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
    ]
};
