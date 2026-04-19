/**
 * Configuración de Nichos para el Ecosistema de Crecimiento
 * Aquí definimos el lenguaje, los consejos de facturación y los protocolos
 * que transforman el dashboard en un "Acompañamiento Estratégico".
 */

export const nicheConfig = {
    generic: {
        id: 'business',
        label: 'Empresa',
        gender: 'neutral',
        terms: {
            heroTitle: 'HAZ CRECER TU MARCA CON',
            heroGradient: 'ESTRATEGIA, CONTENIDO Y SISTEMAS',
            mainObjective: 'Crecimiento de Marca',
            customerLabel: 'Clientes',
            revenueLabel: 'Facturación',
            businessLabel: 'Negocio',
            strategyLabel: 'Estrategia Digital',
            ctaLabel: 'Solicitar asesoría',
            protocolLabel: 'Protocolo de Acción'
        },
        mentorship: {
            title: 'Protocolo de Expansión Corporativa',
            description: 'Nuestra prioridad es estructurar tu negocio para que sea escalable y predecible.',
            facturacionTip: 'Optimiza tu LTV (valor de vida del cliente) para aumentar la rentabilidad sin depender de pauta constante.'
        }
    },
    medical: {
        id: 'medical',
        label: 'Médico/a',
        gender: 'dynamic', // Se adaptará a Médico o Médica según el nombre
        terms: {
            heroTitle: 'ESCALA TU AUTORIDAD MÉDICA CON',
            heroGradient: 'PROTOCOLOS, CONTENIDO Y PACIENTES',
            mainObjective: 'Autoridad & Consultas',
            customerLabel: 'Pacientes',
            revenueLabel: 'Facturación Médica',
            businessLabel: 'Consultorio / Clínica',
            strategyLabel: 'Protocolo de Salud Digital',
            ctaLabel: 'Agendar Diagnóstico Estratégico',
            protocolLabel: 'Protocolo de Acompañamiento'
        },
        mentorship: {
            title: 'Guía de Autoridad e Ingresos Médicos',
            description: 'Su especialidad merece ser el referente del sector. Nos enfocamos en transformar su conocimiento en confianza para atraer a los pacientes ideales.',
            facturacionTip: 'Enfóquese en tratamientos de alta complejidad o quirúrgicos (High-Ticket) para aumentar su facturación ética.'
        },
        levels: {
            presencia: {
                title: "Nivel 1 — Presencia Ética",
                subtitle: "Base profesional y confianza",
                fullDesc: "Establecemos un perfil que transmita seguridad y profesionalismo. Un médico sin orden digital pierde pacientes antes de la primera consulta.",
                features: ["Optimización de perfil médico", "Identidad visual profesional", "Educación preventiva base", "Configuración de biografía médica"]
            },
            crecimiento: {
                title: "Nivel 2 — Posicionamiento",
                subtitle: "Alcance y visibilidad cualificada",
                fullDesc: "No queremos seguidores, queremos pacientes potenciales. Implementamos estrategias para que su especialidad llegue a quienes realmente necesitan su ayuda.",
                features: ["Reels informativos de autoridad", "Pauta médica ética", "Gestión de consultas iniciales", "Análisis de demanda sectorial"]
            },
            autoridad: {
                title: "Nivel 3 — Referente",
                subtitle: "Autoridad absoluta en la especialidad",
                fullDesc: "Usted deja de ser un médico más para ser EL especialista. Posicionamos su marca mediante casos de transformación y testimonios de pacientes.",
                features: ["Videos de alta autoridad", "Resultados y testimonios éticos", "Gestión de reputación digital", "Artículos de especialidad"]
            },
            sistemas: {
                title: "Nivel 4 — Consultorio Digital",
                subtitle: "Automatización de agendamientos",
                fullDesc: "Su tiempo es lo más valioso. Implementamos sistemas para que el paciente agende y confirme su cita sin intervención humana constante.",
                features: ["CRM Médico (Gestión de Pacientes)", "WhatsApp Automatizado", "Pagos y señas online", "Confirmación automática"]
            },
            escala: {
                title: "Nivel 5 — Clínica de Alto Impacto",
                subtitle: "Dominiación y rentabilidad",
                fullDesc: "El nivel de máxima facturación. Escalamos la inversión para llenar su agenda de procedimientos quirúrgicos o tratamientos premium.",
                features: ["Escalada de pauta para cirugía", "Lanzamiento de programas de salud", "Expansión institucional", "Optimización de ROI médico"]
            }
        },
        dailyProtocols: {
            presencia: [
                { id: 'bio', task: 'Completar perfil y biografía ética', impact: 'Confianza' },
                { id: 'photo', task: 'Validar 1 fotografía de autoridad', impact: 'Impacto' }
            ],
            crecimiento: [
                { id: 'leads', task: 'Calificar 5 nuevos pacientes en CRM', impact: 'Facturación' },
                { id: 'comments', task: 'Responder a 3 comentarios de valor', impact: 'Alcance' }
            ],
            autoridad: [
                { id: 'script', task: 'Revisar guion de video de autoridad', impact: 'Reputación' },
                { id: 'testimony', task: 'Solicitar 1 testimonio de éxito', impact: 'Confianza' }
            ],
            sistemas: [
                { id: 'agenda', task: 'Verificar confirmaciones automáticas', impact: 'Tiempo' },
                { id: 'automation', task: 'Revisar flujo de bot de WhatsApp', impact: 'Eficiencia' }
            ],
            escala: [
                { id: 'roi', task: 'Analizar ROI de tratamientos premium', impact: 'Facturación' },
                { id: 'scale', task: 'Autorizar escala de presupuesto publicitario', impact: 'Dominio' }
            ]
        }
    }
};


/**
 * Helper para obtener la configuración según el nicho
 */
export const getNicheConfig = (userNiche = '') => {
    const niche = userNiche.toLowerCase();
    
    if (['doctor', 'hospital', 'clinica', 'clínica', 'medico', 'médico', 'dentista', 'especialista'].some(k => niche.includes(k))) {
        return nicheConfig.medical;
    }
    
    return nicheConfig.generic;
};
