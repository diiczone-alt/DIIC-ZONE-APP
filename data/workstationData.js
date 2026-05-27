export const EDITOR_TASKS = [
    { 
        id: '101', 
        title: 'Reel Lanzamiento Q4', 
        client: 'FitLife Global', 
        status: 'editing', 
        deadline: 'Hoy, 18:00', 
        pay: '$45', 
        phase: 1,
        objective: 'Crear reel dinámico para promocionar el nuevo servicio de blanqueamiento.',
        format: '9:16 (Vertical)',
        duration: '15-30s',
        structure: 'Hook (0-3s) -> Problema -> Solución -> CTA',
        notes: 'Usar la paleta de colores corporativa. Música energica.',
        assets: [
            { name: 'Raw_Cam_A.mp4', size: '2.4 GB', type: 'video' },
            { name: 'Raw_Cam_B.mp4', size: '1.8 GB', type: 'video' },
            { name: 'Logo_Animado.mov', size: '120 MB', type: 'video' }
        ]
    },
    { 
        id: '102', 
        title: 'Testimonial Dr. Perez', 
        client: 'Clinica Nova', 
        status: 'review', 
        deadline: 'Mañana', 
        pay: '$80', 
        phase: 3,
        objective: 'Testimonio de paciente satisfecho con el tratamiento estético.',
        format: '9:16 (Vertical) + 1:1',
        duration: '60s',
        structure: 'Intro -> Historia -> Resultado -> Confianza',
        notes: 'Priorizar audio de voz sobre la música.',
        assets: [
            { name: 'Interview_Dr.mp4', size: '1.2 GB', type: 'video' },
            { name: 'B-Roll_Clinic.mp4', size: '800 MB', type: 'video' }
        ]
    },
    { 
        id: '103', 
        title: 'Promo Black Friday', 
        client: 'Ecom Store', 
        status: 'v1_ready', 
        deadline: 'Jueves', 
        pay: '$60', 
        phase: 2,
        objective: 'Campaña agresiva de descuentos para fin de año.',
        format: '9:16 (Vertical)',
        duration: '15s',
        structure: 'Descuento -> Productos -> Limited Time',
        notes: 'Mucho ritmo y cortes rápidos.',
        assets: [
            { name: 'Product_Shots.zip', size: '2.1 GB', type: 'archive' }
        ]
    },
    { 
        id: '104', 
        title: 'Vlog Youtube #42', 
        client: 'Marca Personal', 
        status: 'final', 
        deadline: 'Viernes', 
        pay: '$120', 
        phase: 4,
        objective: 'Edición de vlog semanal estilo documental.',
        format: '16:9 (Horizontal)',
        duration: '10-12 min',
        structure: 'Vlog standard',
        notes: 'Corrección de color cinematográfica.',
        assets: [
            { name: 'Vlog_Footage.zip', size: '15 GB', type: 'archive' }
        ]
    },
];

export const EDITOR_STATS = {
    accumulatedPay: '$305.00',
    currentLoad: 82,
    maxLoad: 100,
    recentDownloads: [
        { name: 'Raw Footage - Campaña X', size: '24 GB', date: 'Hace 1h' },
        { name: 'B-Roll_Aesthetics.zip', size: '3.5 GB', date: 'Hace 3h' }
    ],
    recentCorrections: [
        { title: 'Testimonial Dr. Perez', version: 'V1', feedback: 'Cliente solicitó cambio de música.' },
        { title: 'Reel Lanzamiento Q4', version: 'V1', feedback: 'El logo final está un poco pequeño.' }
    ]
};

export const EDITOR_GUIDES = [
    {
        id: 'branding-2026',
        title: 'Estilo Visual DIIC 2026',
        type: 'Branding',
        time: '5 min',
        rating: 4.8,
        description: 'Manual de identidad visual para la nueva era de contenido acelerado.',
        content: [
            {
                title: 'Introducción al Nuevo Estilo',
                body: 'En 2026, la identidad de DIIC evoluciona hacia una estética "Liquid Glass" y "Hyper-Neon". El contenido debe sentirse premium pero enérgico.'
            },
            {
                title: 'Tipografía y Jerarquía',
                body: 'Usar "Inter" para cuerpo y "Outfit" para titulares. El interlineado debe ser estrecho para dar sensación de densidad y potencia.'
            },
            {
                title: 'Paleta de Colores',
                body: 'Dominante: #050511 (Obsidian). Acentos: #8B5CF6 (Purple Glow) y #10B981 (Emerald Flash).'
            }
        ]
    },
    {
        id: 'renders-4k',
        title: 'Optimización de Renders 4K',
        type: 'Técnico',
        time: '12 min',
        rating: 4.9,
        description: 'Cómo entregar calidad cinematográfica manteniendo archivos eficientes.',
        content: [
            {
                title: 'Codecs Recomendados',
                body: 'Usar siempre H.265 (HEVC) para revisiones y ProRes 422 para masters finales. Bitrate objetivo: 80Mbps para 4K.'
            },
            {
                title: 'Flujo de Proxy',
                body: 'Para agilizar la edición, generar proxies Prores Medium Resolution. Aseguras fluidez sin perder precisión en el color.'
            }
        ]
    },
    {
        id: 'storytelling-reels',
        title: 'Storytelling para Reels Exponenciales',
        type: 'Estrategia',
        time: '8 min',
        rating: 5.0,
        description: 'La ciencia detrás de la retención en los primeros 3 segundos.',
        content: [
            {
                title: 'La Anatomía del Gancho',
                body: 'El gancho (Hook) no es solo visual; es una promesa de valor. Debe ocurrir en los primeros 1.5 a 2 segundos.'
            },
            {
                title: 'Curva de Retención',
                body: 'Insertar un "Pattern Interrupt" cada 4-6 segundos. Puede ser un zoom, un cambio de color o un efecto sonoro inesperado.'
            }
        ]
    },
    {
        id: 'audio-voiceover-ai',
        title: 'Manejo de Audio & Voiceovers AI',
        type: 'Técnico',
        time: '15 min',
        rating: 4.7,
        description: 'Integración de voces sintéticas con mezcla profesional.',
        content: [
            {
                title: 'Limpieza de Voz',
                body: 'Usar Adobe Podcast o plugins de Waves para eliminar ruido de fondo antes de aplicar el Voiceover AI.'
            },
            {
                title: 'Ecualización Dinámica',
                body: 'La voz siempre debe estar por encima de la música. Usar side-chain compression para que la música baje automáticamente cuando hay diálogo.'
            }
        ]
    }
];

export const ACADEMY_COURSES = [
    {
        id: 'captions-2026',
        title: 'Mastering Dynamic Captions 2026',
        instructor: 'Julian Veliz',
        level: 'Avanzado',
        duration: '2h 45m',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44e?auto=format&fit=crop&q=80&w=800',
        description: 'Aprende técnica avanzada de retención mediante subtítulos reactivos de alto impacto. La guía definitiva para editores de contenido vertical.',
        modules: [
            {
                title: 'Módulo 1: Psicología del Texto',
                lessons: [
                    { id: 'l1', title: 'Por qué leemos antes de escuchar', duration: '12:00', completed: true },
                    { id: 'l2', title: 'Jerarquía Visual: Color vs Tamaño', duration: '15:30', completed: false }
                ]
            },
            {
                title: 'Módulo 2: Animación Reactiva',
                lessons: [
                    { id: 'l3', title: 'Keyframing Rítmico en Premiere', duration: '22:15', completed: false },
                    { id: 'l4', title: 'Uso de Expresiones en After Effects', duration: '45:00', completed: false }
                ]
            },
            {
                title: 'Módulo 3: Casos de Éxito',
                lessons: [
                    { id: 'l5', title: 'Análisis de Retención: Caso Dr. Smith', duration: '30:00', completed: false }
                ]
            }
        ]
    }
];

export const EDITOR_FILES = [
    { id: 100, name: 'NOVA', type: 'folder', size: '--', date: 'Recién creado', status: 'ready', parentId: null },
    { id: 1, name: 'PROYECTO_ALPHA_CUT_V1.MP4', type: 'video', size: '1.2 GB', date: 'Hace 2 horas', status: 'ready', parentId: null },
    { id: 2, name: 'ASSETS_GRAFICOS_PACK.ZIP', type: 'archive', size: '450 MB', date: 'Ayer', status: 'ready', parentId: null },
    { id: 3, name: 'GUION_TECNICO_FINAL.PDF', type: 'doc', size: '2.4 MB', date: '20 Oct', status: 'ready', parentId: null },
    { id: 7, name: 'ENTREVISTA_DR_RUBIO.MP4', type: 'video', size: '890 MB', date: 'Recién subido', status: 'ready', parentId: 100 },
    { id: 8, name: 'B-ROLL_CLINICA.ZIP', type: 'archive', size: '2.1 GB', date: 'Recién subido', status: 'ready', parentId: 100 },
    { id: 9, name: 'FOTO_BANNER.JPG', type: 'image', size: '1.4 MB', date: 'Recién subido', status: 'ready', parentId: 100 },
    { id: 4, name: 'B-ROLL_DRONE_SHOTS.MP4', type: 'video', size: '3.1 GB', date: '18 Oct', status: 'ready', parentId: null },
    { id: 5, name: 'REFERENCIA_ESTILO.JPG', type: 'image', size: '5.2 MB', date: '15 Oct', status: 'ready', parentId: null },
    { id: 6, name: 'THUMBNAIL_DRAFT_V1.PSD', type: 'archive', size: '84 MB', date: '12 Oct', status: 'ready', parentId: null },
];

export const FILMMAKER_GUIDES = [
    {
        id: 'camera-config-2026',
        title: 'Configuración de Cámara DIIC 2026',
        type: 'Técnico',
        time: '6 min',
        rating: 4.9,
        description: 'Parámetros optimizados para capturar el mayor rango dinámico en sets de rodaje corporativos y publicitarios.',
        content: [
            {
                title: 'Perfiles de Color Recomendados',
                body: 'Usar siempre S-Log3 (en cámaras Sony) o D-Log (en drones DJI). Recomendamos sobreexponer la toma en +1.7 EV para garantizar que las sombras no tengan ruido digital molesto al aplicar las LUTs de la agencia.'
            },
            {
                title: 'Resolución & Framerates',
                body: 'La entrevista principal debe ser grabada en 4K UHD a 24fps (obturación a 1/50). Todo el B-Roll dinámico y de acción rápida debe registrarse a 4K 60fps o 120fps si se busca hacer cámara lenta fluida.'
            },
            {
                title: 'Monitoreo de Audio',
                body: 'El canal 1 debe reservarse para el micrófono lavalier inalámbrico (corbatero) ajustado a -12dB. El canal 2 capturará sonido ambiental mediante el micrófono shotgun montado en cámara a -18dB para evitar saturaciones inesperadas.'
            }
        ]
    },
    {
        id: 'scouting-planning',
        title: 'Planificación & Scouting Técnico',
        type: 'Producción',
        time: '5 min',
        rating: 4.7,
        description: 'Pasos fundamentales antes de presionar el botón de grabación en una locación real.',
        content: [
            {
                title: 'Visita Técnica Previa (Scouting)',
                body: 'Siempre que sea posible, realiza una visita al set el día previo a la misma hora del shooting. Evalúa la dirección de la luz natural, fuentes de contaminación sonora (aires acondicionados, calles) y localiza las tomas de corriente eléctrica.'
            },
            {
                title: 'Carga de Equipos & Tarjetas',
                body: 'Formatea las tarjetas SD y cargadores la noche anterior. Asegúrate de tener al menos tres baterías cargadas por cámara y verifica que el lente no tenga manchas antes de salir de la oficina.'
            }
        ]
    },
    {
        id: 'lighting-interviews',
        title: 'Iluminación para Entrevistas Premium',
        type: 'Fotografía',
        time: '8 min',
        rating: 5.0,
        description: 'Aprende a esculpir con luz a tus sujetos para lograr un look cinematográfico corporativo.',
        content: [
            {
                title: 'La Luz Principal (Key Light)',
                body: 'Ubica la luz principal con un softbox octogonal grande a 45 grados del sujeto y un poco por encima de la altura de los ojos. Esto crea una sombra sutil pero atractiva en el lado opuesto de la cara (iluminación Rembrandt).'
            },
            {
                title: 'Contraluz y Separación',
                body: 'Coloca una luz de contra (Rim/Hair Light) detrás del sujeto (fuera de plano) apuntando a la nuca y hombros. Esto crea un perfil brillante que ayuda a separar físicamente al sujeto del fondo oscuro del consultorio u oficina.'
            }
        ]
    }
];

