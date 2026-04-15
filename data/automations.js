export const AUTOMATIONS = [
    // NIVEL 1 - BÁSICO
    {
        id: 'whatsapp-basic',
        title: 'Respuestas Automáticas WhatsApp',
        description: 'Configuración inicial de mensajes de bienvenida, ausencia y respuestas rápidas para no perder clientes.',
        level: 1,
        price: 'Gratis',
        tools: ['WhatsApp Business'],
        category: 'general',
        benefits: ['Respuesta inmediata', 'Imagen profesional', 'Ahorro de tiempo'],
        status: 'active'
    },
    {
        id: 'faq-bot',
        title: 'Chatbot de Preguntas Frecuentes',
        description: 'Bot básico que responde las 10 preguntas más comunes de tu negocio automáticamente.',
        level: 1,
        price: 50,
        tools: ['ManyChat', 'Instagram'],
        category: 'general',
        benefits: ['Atención 24/7', 'Filtrado de curiosos'],
        status: 'available'
    },

    // NIVEL 2 - INTERMEDIO
    {
        id: 'appointment-assistant',
        title: 'Asistente de Agendamiento',
        description: 'Sistema que gestiona tu agenda, confirma citas y envía recordatorios para reducir el ausentismo.',
        level: 2,
        price: 150,
        tools: ['N8N', 'Google Calendar', 'WhatsApp API'],
        category: 'general',
        benefits: ['Agenda automática', 'Reducción de ausentismo', 'Sincronización total'],
        status: 'available'
    },
    {
        id: 'medical-reminder',
        title: 'Recordatorio de Pacientes',
        description: 'Envío automático de preparación previa y confirmación de asistencia para consultas médicas.',
        level: 2,
        price: 200,
        tools: ['Make', 'WhatsApp API'],
        category: 'medical',
        benefits: ['Menos inasistencias', 'Mejor experiencia paciente'],
        status: 'locked'
    },

    // NIVEL 3 - AVANZADO
    {
        id: 'ai-chatbot',
        title: 'Chatbot Inteligente con IA',
        description: 'Asistente entrenado con la información de tu negocio capaz de sostener conversaciones naturales.',
        level: 3,
        price: 450,
        tools: ['OpenAI', 'LangChain', 'WhatsApp'],
        category: 'general',
        benefits: ['Conversación natural', 'Venta consultiva', 'Soporte complejo'],
        status: 'locked'
    },

    // NIVEL 4 - PROFESIONAL
    {
        id: 'crm-auto',
        title: 'CRM Automatizado',
        description: 'Registro automático de leads, clasificación y seguimiento de embudos de venta.',
        level: 4,
        price: 800,
        tools: ['HubSpot', 'N8N'],
        category: 'general',
        benefits: ['Orden total', 'Seguimiento de ventas', 'Reportes automáticos'],
        status: 'locked'
    },

    // NIVEL 5 - EMPRESARIAL
    {
        id: 'full-ecosystem',
        title: 'Ecosistema de Automatización Total',
        description: 'Integración completa de facturación, agenda, marketing y operaciones internas.',
        level: 5,
        price: 2500,
        tools: ['Custom API', 'ERP', 'AWS'],
        category: 'general',
        benefits: ['Escalabilidad total', 'Reducción de personal operativo'],
        status: 'locked'
    }
];

export const LEVELS = [
    { id: 1, name: 'Básico', description: 'Automatización esencial' },
    { id: 2, name: 'Intermedio', description: 'Gestión y Agendamiento' },
    { id: 3, name: 'Avanzado', description: 'Inteligencia Artificial' },
    { id: 4, name: 'Profesional', description: 'CRM y Ventas' },
    { id: 5, name: 'Empresarial', description: 'Ecosistema Total' },
];
