import { 
    Sparkles, ShieldCheck, Heart, Users, Target, Rocket, 
    BrainCircuit, Zap, MessageSquare, History, FileText, 
    Megaphone, Calendar, PhoneCall, Workflow, Bot, BarChart3,
    Video, Layout, Search, Layers, Star, 
    StickyNote, Type, Pencil, Box, PenTool,
    Instagram, Facebook, Youtube, Globe, Chrome,
    PlayCircle, CheckCircle2, Clock, Lightbulb, AlertCircle,
    Music, Mic, Send, Smartphone, AtSign, Mail, Globe2, 
    LifeBuoy, UserPlus, Repeat, TrendingUp, BarChart, ShoppingCart, Headset
} from 'lucide-react';

export const STRATEGIC_COLUMNS = [
    { id: 'conciencia', label: 'Conciencia', desc: 'Alcance y descubrimiento' },
    { id: 'interés', label: 'Interés', desc: 'Curiosidad e interacción' },
    { id: 'consideración', label: 'Consideración', desc: 'Educar y confianza' },
    { id: 'conversión', label: 'Conversión', desc: 'Venta y cierre' },
    { id: 'retención', label: 'Retención', desc: 'Fidelización y LTV' }
];

export const STRATEGIC_AREAS = [
    { 
        id: 'creativa', 
        label: 'Zona Creativa', 
        color: '#6366f1', 
        icon: PenTool,
        categories: ['imagen', 'video', 'audio', 'imprenta']
    },
    { 
        id: 'crm', 
        label: 'Automatización CRM', 
        color: '#10b981', 
        icon: Workflow,
        categories: ['crm']
    },
    { 
        id: 'conversiones', 
        label: 'Conversiones y Formularios', 
        color: '#f43f5e', 
        icon: Target,
        categories: ['recurso']
    }
];

export const NODE_CATEGORIES = {
    conciencia: { 
        id: 'conciencia', 
        label: 'Conciencia', 
        color: '#6366f1', 
        glow: '#818cf8',
        shape: 'leaf',
        icon: Sparkles, 
        desc: 'Generar alcance y descubrimiento (Awareness).' 
    },
    interés: { 
        id: 'interés', 
        label: 'Interes', 
        color: '#10b981', 
        glow: '#34d399',
        shape: 'leaf',
        icon: Zap, 
        desc: 'Despertar curiosidad y fomentar interacción.' 
    },
    consideración: { 
        id: 'consideración', 
        label: 'Consideración', 
        color: '#8b5cf6', 
        glow: '#a78bfa',
        shape: 'hex',
        icon: ShieldCheck, 
        desc: 'Educar y ayudar a explorar solución.' 
    },
    conversión: { 
        id: 'conversión', 
        label: 'Conversión', 
        color: '#f43f5e', 
        glow: '#fb7185',
        shape: 'pill',
        icon: Target, 
        desc: 'Transformar leads en transacciones.' 
    },
    retención: { 
        id: 'retención', 
        label: 'Retención', 
        color: '#06b6d4', 
        glow: '#22d3ee',
        shape: 'pill',
        icon: Repeat, 
        desc: 'Mantener comprometidos y fomentar el regreso.' 
    },
    especial: { 
        id: 'especial', 
        label: 'Especial', 
        color: '#94a3b8', 
        glow: '#cbd5e1',
        shape: 'rect',
        icon: StickyNote, 
        desc: 'Anotaciones y herramientas auxiliares.' 
    }
};

export const NODE_TYPES = {
    // 🧲 Conciencia (Awareness)
    educativo: { category: 'conciencia', label: 'Contenido Educativo', icon: BrainCircuit, desc: 'Enseña algo de alto valor.' },
    gancho: { category: 'conciencia', label: 'Gancho de Curiosidad', icon: Zap, desc: 'Retiene la atención inmediata.' },
    reel_viral: { category: 'conciencia', label: 'Reel Viral', icon: Video, desc: 'Máximo alcance y tendencia.' },
    problema: { category: 'conciencia', label: 'Problema Común', icon: AlertCircle, desc: 'Ataca un dolor específico.' },
    ads: { category: 'conciencia', label: 'Paid Ads (Meta/Google)', icon: Megaphone, desc: 'Tráfico pagado estratégico.' },
    influencer: { category: 'conciencia', label: 'Influencer Collab', icon: Users, desc: 'Alcance mediante terceros.' },
    seo_blog: { category: 'conciencia', label: 'SEO / Blog Post', icon: Search, desc: 'Atraer tráfico orgánico de búsqueda.' },
    pr_media: { category: 'conciencia', label: 'PR / Prensa', icon: Globe2, desc: 'Apariciones en medios externos.' },

    // ❤️ Interés
    estilo_vida: { category: 'interés', label: 'Estilo de Vida', icon: Calendar, desc: 'Conecta con tu realidad.' },
    historia_personal: { category: 'interés', label: 'Historia Personal', icon: FileText, desc: 'Tu "por qué" y origen.' },
    opinion: { category: 'interés', label: 'Opinión / Filtro', icon: MessageSquare, desc: 'Tu postura ante un tema.' },
    behind_scenes: { category: 'interés', label: 'Behind the Scenes', icon: History, desc: 'Humanización de la marca.' },
    ugc: { category: 'interés', label: 'UGC (Contenido de Usuario)', icon: Smartphone, desc: 'Prueba social auténtica.' },
    community_post: { category: 'interés', label: 'Community Spotlight', icon: Heart, desc: 'Destacar a tu audiencia.' },
    qa_session: { category: 'interés', label: 'Q&A Sesión', icon: MessageSquare, desc: 'Resolver dudas en directo.' },

    // 🛡️ Consideración
    caso_exito: { category: 'consideración', label: 'Caso de Éxito', icon: Search, desc: 'Resultados reales paso a paso.' },
    testimonio: { category: 'consideración', label: 'Testimonio', icon: Users, desc: 'Validación de clientes.' },
    explicacion_pro: { category: 'consideración', label: 'Explicación Experta', icon: ShieldCheck, desc: 'Análisis de tu método.' },
    whitepaper: { category: 'consideración', label: 'Whitepaper / Data Report', icon: FileText, desc: 'Investigación y datos propios.' },
    speaking: { category: 'consideración', label: 'Public Speaking', icon: Mic, desc: 'Autoridad en escenarios o eventos.' },
    awards: { category: 'consideración', label: 'Premios / Certificaciones', icon: ShieldCheck, desc: 'Validación institucional.' },
    deep_dive: { category: 'consideración', label: 'Audit / Deep Dive', icon: Search, desc: 'Análisis técnico avanzado.' },

    // 💰 Conversión (BOFU)
    oferta: { category: 'conversión', label: 'Oferta Directa', icon: Megaphone, desc: 'Promoción por tiempo limitado.' },
    cierre: { category: 'conversión', label: 'Cierre / CTA', icon: Target, desc: 'Cierre de venta estratégico.' },
    retargeting: { category: 'conversión', label: 'Retargeting Offer', icon: Repeat, desc: 'Recuperación de carritos o interés.' },
    order_bump: { category: 'conversión', label: 'Order Bump / Upsell', icon: ShoppingCart, desc: 'Incrementar ticket promedio.' },
    vsl: { category: 'conversión', label: 'Video Sales Letter', icon: PlayCircle, desc: 'Video estructurado de ventas.' },
    guarantee: { category: 'conversión', label: 'Garantía / Trust', icon: ShieldCheck, desc: 'Reducción de fricción de compra.' },

    // 🚀 Escala
    lead_magnet: { category: 'retención', label: 'Lead Magnet', icon: Box, desc: 'Recurso por datos de contacto.' },
    automatizacion: { category: 'retención', label: 'Automatización', icon: Workflow, desc: 'Flujo de escala inteligente.' },
    referral: { category: 'retención', label: 'Referral Program', icon: UserPlus, desc: 'Crecimiento mediante referidos.' },
    affiliate: { category: 'retención', label: 'Affiliate Network', icon: Users, desc: 'Venta por intermediarios.' },
    subscription: { category: 'retención', label: 'Subscription Model', icon: Calendar, desc: 'Ingresos recurrentes.' },
    enterprise: { category: 'retención', label: 'Enterprise / B2B Sale', icon: TrendingUp, desc: 'Cierre de cuentas grandes.' },

    // 🤖 CRM & Automatización
    lead_score: { category: 'crm', label: 'Lead Scoring', icon: Target, desc: 'Calificación automática de leads.' },
    email_sequence: { category: 'crm', label: 'Email Nurturing', icon: Mail, desc: 'Secuencia automática de correos.' },
    whatsapp_bot: { category: 'crm', label: 'WhatsApp Automation', icon: MessageSquare, desc: 'Atención automática por chat.' },
    sms_reminder: { category: 'crm', label: 'SMS / Notificación', icon: Smartphone, desc: 'Alertas críticas directas.' },
    crm_sync: { category: 'crm', label: 'CRM Sync / Hubspot', icon: Repeat, desc: 'Integración de datos de cliente.' },
    support_ticket: { category: 'crm', label: 'Support / Ticket', icon: Headset, desc: 'Post-venta y fidelización.' },

    // 💡 Especiales
    sticky: { category: 'especial', label: 'Nota Adhesiva', icon: StickyNote, desc: 'Anotaciones rápidas.' },
    label: { category: 'especial', label: 'Etiqueta', icon: Type, desc: 'Textos en el lienzo.' }
};

export const NODE_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C' },
    { id: 'tiktok', label: 'TikTok', icon: Chrome, color: '#000000' }, 
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000' },
    { id: 'web', label: 'Web/Blog', icon: Globe, color: '#4F46E5' }
];

export const NODE_OBJECTIVES = [
    { id: 'atraer', label: 'Atraer', icon: Magnet, desc: 'Generar alcance y nuevos ojos.' },
    { id: 'educar', label: 'Educar', icon: BrainCircuit, desc: 'Aportar valor y nutrir confianza.' },
    { id: 'convertir', label: 'Convertir', icon: Target, desc: 'Llamar a la acción y cerrar venta.' }
];

export const NODE_STAGES = [
    { id: 'conciencia', label: 'Conciencia', icon: 'zap', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'interés', label: 'Interés', icon: 'message-square', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'consideración', label: 'Consideración', icon: 'shield-check', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'conversión', label: 'Conversión', icon: 'target', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    { id: 'retención', label: 'Retención', icon: 'users', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
];

// Layout & Workspace Partitioning Constants
export const STRATEGIC_RAILS = {
    HUBS_X: 950,
    PARTITION_X: 1200,
    COLUMNS: [1400, 2000, 2600, 3200, 3800],
    VERTICAL_PADDING: 110,
    COLUMN_WIDTH: 500
};

export const NODE_STATUS = {
    idea: { label: 'Idea', icon: Lightbulb, color: 'text-gray-400', bg: 'bg-gray-500/10' },
    creando: { label: 'En Creación', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    listo: { label: 'Listo', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    publicado: { label: 'Publicado', icon: PlayCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
};

export const NODE_CONTENT_TYPES = {
    video: { id: 'video', label: 'Video', icon: Video, color: '#f43f5e' },
    imagen: { id: 'imagen', label: 'Imagen / Estático', icon: Layout, color: '#3b82f6' },
    recurso: { id: 'recurso', label: 'Recurso / CRM', icon: Box, color: '#10b981' }
};

export const BUSINESS_TYPES = [
    { id: 'medico', label: 'Sector Médico / Salud', icon: ShieldCheck },
    { id: 'marca_personal', label: 'Marca Personal / Coach', icon: Users },
    { id: 'empresa', label: 'Empresa / B2B', icon: Rocket },
    { id: 'ecommerce', label: 'E-commerce / Retail', icon: Box },
    { id: 'otro', label: 'Otro', icon: Lightbulb }
];

export const STRATEGIC_GOALS = [
    { id: 'alcance', label: 'Alcance y Conciencia', desc: 'Foco en visibilidad y nuevos leads.' },
    { id: 'autoridad', label: 'Confianza y Educación', desc: 'Foco en consideración y pericia.' },
    { id: 'ventas', label: 'Conversión de Ventas', desc: 'Foco en cierre e ingresos.' },
    { id: 'fidelización', label: 'Retención y LTV', desc: 'Foco en recompras y lealtad.' }
];

export const GROWTH_LEVELS = [
    { id: 1, label: 'Nivel 1: Presencia Digital', desc: 'Bases y visibilidad inicial.' },
    { id: 2, label: 'Nivel 2: Estrategia', desc: 'Flujos de contenido estructurados.' },
    { id: 3, label: 'Nivel 3: Crecimiento', desc: 'Optimización de alcance y comunidad.' },
    { id: 4, label: 'Nivel 4: Automatización', desc: 'Sistemas de venta automáticos.' },
    { id: 5, label: 'Nivel 5: Escala', desc: 'Expansión de mercado y pauta pro.' }
];

export const CONTENT_STATUS = {
    pendiente: { label: 'Pendiente', color: 'text-gray-400', bg: 'bg-gray-500/10' },
    produccion: { label: 'En Producción', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    editado: { label: 'Editado', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    aprobado: { label: 'Aprobado', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    listo: { label: 'Listo para Publicar', color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
};

export const NODE_CONTENT_SUBTYPES = {
    video: [
        { id: 'v_educativo', label: 'Educativo / Tutorial', icon: BrainCircuit, desc: 'Tutoriales, consejos y valor práctico.', category: 'conexión' },
        { id: 'v_autoridad', label: 'Autoridad / Experto', icon: ShieldCheck, desc: 'Análisis profundo de industria.', category: 'autoridad' },
        { id: 'v_testimonio', label: 'Caso de Éxito / Entrevista', icon: Users, desc: 'Resultados reales y entrevistas.', category: 'autoridad' },
        { id: 'v_promocional', label: 'Promocional / Directo', icon: Megaphone, desc: 'Oferta, venta y lanzamiento.', category: 'conversión' },
        { id: 'v_viral', label: 'Reel Viral / Tendencia', icon: Zap, desc: 'Entretenimiento y alcance masivo.', category: 'atracción' },
        { id: 'v_vsl', label: 'Video Sales Letter (VSL)', icon: PlayCircle, desc: 'Video estructurado de ventas de alto impacto.', category: 'conversión' },
        { id: 'v_documentary', label: 'Cinematic Documentary', icon: History, desc: 'Narrativa profunda de marca.', category: 'conexión' },
        { id: 'v_podcast', label: 'Clip de Podcast / Talk', icon: MessageSquare, desc: 'Fragmentos de conversación potentes.', category: 'autoridad' },
        { id: 'v_live_highlights', label: 'Highlights de Live', icon: PlayCircle, desc: 'Lo mejor de tus transmisiones.', category: 'conexión' },
        { id: 'v_showreel', label: 'Showreel / Portfolio', icon: Layout, desc: 'Muestra visual de tus mejores trabajos.', category: 'autoridad' },
        { id: 'v_webinar_pro', label: 'Webinar de Autoridad', icon: Video, desc: 'Clase magistral grabada de alto valor.', category: 'autoridad' },
        { id: 'v_mini_training', label: 'Entrenamiento Rápido', icon: BrainCircuit, desc: 'Micro-cápsula educativa de alto impacto.', category: 'conexión' },
        { id: 'v_challenge', label: 'Desafío / Reto', icon: Zap, desc: 'Contenido dinámico para generar acción.', category: 'atracción' }
    ],
    imagen: [
        { id: 'i_post', label: 'Post Simple / Gráfica', icon: Layout, desc: 'Imagen única de alto impacto.', category: 'atracción' },
        { id: 'i_carrusel_edu', label: 'Carrusel Educativo', icon: Layers, desc: 'Secuencia de valor paso a paso.', category: 'conexión' },
        { id: 'i_historia', label: 'Historia Estratégica', icon: Instagram, desc: 'Secuencia de historias de conversión.', category: 'conexión' },
        { id: 'i_comparativa', label: 'Gráfica Comparativa', icon: BarChart3, desc: 'Antes vs Después / Vs Competencia.', category: 'autoridad' },
        { id: 'i_infografia', label: 'Infografía Pro', icon: Search, desc: 'Datos y procesos visualizados.', category: 'autoridad' },
        { id: 'i_promocion', label: 'Promoción / Flash Sale', icon: Target, desc: 'Gráfica de oferta directa.', category: 'conversión' },
        { id: 'i_frase', label: 'Cita / Branding', icon: Star, desc: 'Identidad y autoridad mental.', category: 'atracción' },
        { id: 'i_blueprint', label: 'Blueprint / Mapa', icon: Workflow, desc: 'Diagrama de tu metodología.', category: 'autoridad' },
        { id: 'i_deck', label: 'Presentación / Deck', icon: FileText, desc: 'Presentación de propuesta o servicio.', category: 'conversión' }
    ],
    recurso: [
        { id: 'r_lead_magnet', label: 'Lead Magnet (PDF)', icon: Box, desc: 'Material gratuito por suscripción.', category: 'conciencia' },
        { id: 'r_masterclass', label: 'Masterclass / Webinar', icon: Video, desc: 'Clase magistral de conversión.', category: 'consideración' },
        { id: 'r_workshop', label: 'Taller / Workshop', icon: Users, desc: 'Sesión práctica grupal.', category: 'conversión' },
        { id: 'r_checklist', label: 'Checklist / Template', icon: CheckCircle2, desc: 'Hoja de ruta o plantilla lista.', category: 'interés' },
        { id: 'r_appointment', label: 'Cita / Consultoría', icon: Calendar, desc: 'Agendamiento estratégico de llamada.', category: 'conversión' },
        { id: 'r_form', label: 'Formulario / Quiz', icon: Target, desc: 'Cualificación de leads mediante datos.', category: 'conversión' },
        { id: 'r_email_sequence', label: 'Secuencia Nurture', icon: Mail, desc: 'Serie de correos para calentar leads.', category: 'retención' },
        { id: 'r_crm_flow', label: 'CRM Nurture Flow', icon: Bot, desc: 'Flujo automático de nutrición CRM.', category: 'retención' },
        { id: 'r_whatsapp_funnel', label: 'WhatsApp Funnel', icon: MessageSquare, desc: 'Embudo de ventas por chat.', category: 'retención' }
    ]
};
 
export const MASTER_CONTENT_TYPES = {
    video: {
        id: 'video',
        label: 'Video',
        icon: Video,
        defaultDriveFolder: 'Drive/Videos/Proyectos',
        productionFields: ['script', 'duration', 'resolution', 'frameRate'],
        outputFields: ['mp4_export', 'thumbnail'],
        tools: ['script_editor', 'teleprompter', 'video_analytics']
    },
    imagen: {
        id: 'imagen',
        label: 'Imagen',
        icon: Layout,
        defaultDriveFolder: 'Drive/Diseños/Proyectos',
        productionFields: ['concept_sketch', 'dimensions', 'color_palette'],
        outputFields: ['png_export', 'jpg_export', 'source_file'],
        tools: ['design_studio', 'stock_finder', 'image_optimizer']
    },
    historia: {
        id: 'historia',
        label: 'Historia',
        icon: Instagram,
        defaultDriveFolder: 'Drive/Historias/Activas',
        productionFields: ['sequence_plan', 'interactive_stickers'],
        outputFields: ['vertical_export'],
        tools: ['story_builder', 'engagement_tracker']
    },
    recurso: {
        id: 'recurso',
        label: 'Recurso / Lead Magnet',
        icon: Box,
        defaultDriveFolder: 'Drive/Recursos/Magnets',
        productionFields: ['outline', 'value_proposition'],
        outputFields: ['pdf_export', 'link_access'],
        tools: ['document_builder', 'conversion_monitor']
    }
};

// Helper for Lucide icons missing in this context but needed
function Magnet(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 15-4-4 6.75-6.75a5.25 5.25 0 0 1 7.5 0l3.25 3.25a5.25 5.25 0 0 1 0 7.5L13 22l-4-4" /><path d="m9 18-4-4" /><path d="m14 13-4-4" />
    </svg>
  );
}

export const PARRILLA_COLUMNS = [
    { id: 'fecha', label: 'FECHA', width: 'w-32' },
    { id: 'formato', label: 'FORMATO', width: 'w-40' },
    { id: 'enfoque', label: 'ESPECIALIDAD / ENFOQUE', width: 'w-48' },
    { id: 'tipo', label: 'TIPO DE POST', width: 'w-40' },
    { id: 'tema', label: 'TEMA', width: 'flex-1' },
    { id: 'producto', label: 'PRODUCTO', width: 'w-48' },
    { id: 'guion', label: 'GUIÓN', width: 'w-32' },
    { id: 'proceso', label: 'PROCESO', width: 'w-40' },
    { id: 'programacion', label: 'PROGRAMACIÓN', width: 'w-48' },
    { id: 'estado', label: 'ESTADO', width: 'w-40' },
    { id: 'seguimiento', label: 'SEGUIMIENTO', width: 'w-48' }
];

export const PRODUCTION_FLOW_STEPS = [
    { id: 'start', label: 'START' },
    { id: 'production', label: 'PRODUCTION' },
    { id: 'review', label: 'REVIEW' },
    { id: 'approval', label: 'APPROVAL' },
    { id: 'copy', label: 'COPY' },
    { id: 'scheduled', label: 'SCHEDULED' },
    { id: 'published', label: 'PUBLISHED' }
];

export const CONTENT_FORMATS = {
    'video': { label: 'Video / Reel', color: 'bg-blue-600', text: 'text-white' },
    'reel': { label: 'Reel', color: 'bg-amber-100', text: 'text-amber-800' },
    'post': { label: 'Post', color: 'bg-indigo-600', text: 'text-white' },
    'story': { label: 'Story', color: 'bg-purple-600', text: 'text-white' },
    'recurso': { label: 'Recurso', color: 'bg-emerald-600', text: 'text-white' }
};

// Strategic Formats for the Selection Dropdown
export const STRATEGIC_FORMATS = [
    { id: 'v_reels', label: 'Reel (Instagram/FB)', icon: Video, color: '#f43f5e', areaId: 'creativa', category: 'video' },
    { id: 'v_tiktok', label: 'TikTok (9:16)', icon: Zap, color: '#000000', areaId: 'creativa', category: 'video' },
    { id: 'v_youtube', label: 'YouTube (Horizontal)', icon: Youtube, color: '#FF0000', areaId: 'creativa', category: 'video' },
    { id: 'v_historias', label: 'Video Historia (Full Screen)', icon: Instagram, color: '#E1306C', areaId: 'creativa', category: 'video' },
    { id: 'i_post', label: 'Post Estático (Cuadrado/Retrato)', icon: Layout, color: '#3b82f6', areaId: 'creativa', category: 'imagen' },
    { id: 'i_historias', label: 'Imagen Historia (Vertical)', icon: Instagram, color: '#E1306C', areaId: 'creativa', category: 'imagen' },
    { id: 'i_portadas', label: 'Portada (Cover Photo)', icon: Layout, color: '#fbbf24', areaId: 'creativa', category: 'imagen' },
    { id: 'i_carrucel', label: 'Carrusel de Valor', icon: Layers, color: '#8b5cf6', areaId: 'creativa', category: 'imagen' },
    { id: 'v_podcast', label: 'Podcast / Entrevista', icon: Mic, color: '#a855f7', areaId: 'creativa', category: 'video' },
    { id: 'v_masterclass', label: 'Masterclass / Webinar', icon: Video, color: '#f43f5e', areaId: 'creativa', category: 'video' },
    { id: 'i_deck', label: 'Presentación / Deck', icon: FileText, color: '#6366f1', areaId: 'creativa', category: 'imagen' },
    { id: 'l3_crm_email', label: 'Email Nurturing Flow', icon: Mail, color: '#06b6d4', areaId: 'crm', category: 'crm' },
    { id: 'l3_crm_scoring', label: 'Lead Scoring Automático', icon: Target, color: '#10b981', areaId: 'crm', category: 'crm' },
    { id: 'l3_crm_retargeting', label: 'WhatsApp / Retargeting', icon: MessageSquare, color: '#f43f5e', areaId: 'crm', category: 'crm' },
    { id: 'r_community', label: 'Hub de Comunidad', icon: Users, color: '#10b981', areaId: 'conversiones', category: 'recurso' },
    { id: 'r_audit', label: 'Auditoría Estratégica', icon: Search, color: '#8b5cf6', areaId: 'conversiones', category: 'recurso' },
    { id: 'r_affiliate', label: 'Portal de Afiliados', icon: Globe2, color: '#f59e0b', areaId: 'conversiones', category: 'recurso' },
    { id: 'r_form', label: 'Landing / Formulario', icon: Target, color: '#fbbf24', areaId: 'conversiones', category: 'recurso' }
];

// Utility: Maps any node to its Strategic Hub/Lane ID
export const getNodeLaneId = (node) => {
    if (!node) return null;

    // 1. Precise Identifier Check (Wizard Standard)
    if (node.data?.subtype) {
        const sub = node.data.subtype.toLowerCase();
        if (sub.includes('tiktok')) return 'hub_tiktok';
        if (sub.includes('reel')) return 'hub_reels';
        if (sub.includes('story') || sub.includes('historia')) return 'hub_stories';
        if (sub.includes('video') || sub.includes('youtube')) return 'hub_videos';
        if (sub.includes('post')) return 'hub_posts';
        if (sub.includes('crm') || sub.includes('email')) return 'hub_crm';
        if (sub.includes('form')) return 'hub_forms';
        if (sub.includes('product')) return 'hub_products';
    }

    // 2. Visual Title Analysis (Emergency Fallback)
    const title = (node.data?.title || '').toLowerCase();
    if (title.includes('tiktok')) return 'hub_tiktok';
    if (title.includes('reel')) return 'hub_reels';
    if (title.includes('story') || title.includes('historia')) return 'hub_stories';
    if (title.includes('video')) return 'hub_videos';
    if (title.includes('post')) return 'hub_posts';
    if (title.includes('crm') || title.includes('email')) return 'hub_crm';
    if (title.includes('form') || title.includes('registro')) return 'hub_forms';
    if (title.includes('producto')) return 'hub_products';

    // 3. Deep Context Discovery
    const type = (node.data?.type || '').toLowerCase();
    const t = (node.type || '').toLowerCase();
    const searchStr = `${title} ${type} ${t}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (searchStr.includes('tiktok')) return 'hub_tiktok';
    if (searchStr.includes('reel')) return 'hub_reels';
    if (searchStr.includes('video') || t === 'educativo' || t === 'video') return 'hub_videos';
    if (searchStr.includes('post') || searchStr.includes('imagen')) return 'hub_posts';
    if (searchStr.includes('historia') || searchStr.includes('story')) return 'hub_stories';
    if (searchStr.includes('crm') || searchStr.includes('email')) return 'hub_crm';
    if (searchStr.includes('form') || searchStr.includes('registro')) return 'hub_forms';
    if (searchStr.includes('producto') || searchStr.includes('vault')) return 'hub_products';
    
    return null;
};
