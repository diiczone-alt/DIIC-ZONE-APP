export const proposalTemplates = {
    'medical': {
        name: 'Paquete Salud & Bienestar',
        description: 'Estrategia de posicionamiento para doctores y clínicas.',
        plans: {
            'basic': {
                name: 'Presencia Digital',
                price: 800,
                includes: [
                    'Gestión de Instagram y Facebook',
                    '8 Diseños Gráficos Mensuales',
                    '1 Edición de Video (Reel)',
                    'Respuesta básica de comentarios'
                ]
            },
            'pro': {
                name: 'Crecimiento de Pacientes (Recomendado)',
                price: 1500,
                includes: [
                    'Gestión Total Redes Sociales',
                    '12 Piezas de Contenido (Diseño/Video)',
                    'Campaña Ads (Google/Meta) - Gestión',
                    'Chatbot de Citas Automático',
                    'Reporte Mensual de ROI'
                ]
            },
            'premium': {
                name: 'Dominio de Autoridad',
                price: 2500,
                includes: [
                    'Producción de Video Profesional (Visita mensual)',
                    'Estrategia de Marca Personal',
                    'Funnel de Ventas Automatizado',
                    'CRM Dedicado',
                    'Asesoría de Negocio 1 a 1'
                ]
            }
        }
    },
    'real-estate': {
        name: 'Paquete Inmobiliario',
        description: 'Generación de leads cualificados para venta/renta.',
        plans: {
            'basic': {
                name: 'Escaparate Digital',
                price: 1000,
                includes: [
                    'Publicación de 5 Propiedades',
                    'Gestión de Portales Inmobiliarios',
                    'Diseño de Fichas Técnicas'
                ]
            },
            'pro': {
                name: 'Lead Generation',
                price: 2000,
                includes: [
                    'Campaña "Lead Form" en Facebook',
                    'Video Tours de Propiedades (3 al mes)',
                    'Automatización de WhatsApp',
                    'Filtrado de Prospectos'
                ]
            }
        }
    },
    'restaurant': {
        name: 'Experiencia Gastronómica',
        description: 'Atracción de comensales y fidelización.',
        plans: {
            'pro': {
                name: 'Full Table',
                price: 1200,
                includes: [
                    'Fotografía de Menú Mensual',
                    'Gestión de Influencers (Micro)',
                    'Campaña de Fines de Semana',
                    'Gestión de Reservas Web'
                ]
            }
        }
    }
};

export const getTemplateByNiche = (niche) => {
    // Simple mock logic to map niche names
    const normalized = niche.toLowerCase();
    if (normalized.includes('salud') || normalized.includes('dental') || normalized.includes('doctor') || normalized.includes('medico')) return proposalTemplates['medical'];
    if (normalized.includes('inmobiliaria') || normalized.includes('real estate') || normalized.includes('casa')) return proposalTemplates['real-estate'];
    if (normalized.includes('restaurante') || normalized.includes('comida') || normalized.includes('gastro')) return proposalTemplates['restaurant'];

    // Default fallback
    return proposalTemplates['medical']; // Fallback for demo
};
