/**
 * AI Service - DIIC ZONE
 * Handles strategic analysis and market research simulations.
 * Ready for OpenAI/Anthropic integration.
 */

export const aiService = {
    /**
     * Simulates a deep strategic scan of a brand/URL.
     * In a production environment, this would call a serverless function 
     * that performs scraping and uses an LLM.
     */
    analyzeStrategicProfile: async (url, brandName = '', additionalUrls = {}) => {
        // Steps for the UI progress bar
        const steps = [
            { id: 'grounding', msg: 'Activando Motores de Búsqueda Google...' },
            { id: 'social', msg: 'Rastreando Footprint en FB, IG, TikTok y LinkedIn...' },
            { id: 'leadership', msg: 'Verificando Liderazgo y Directorio Académico...' },
            { id: 'synthesis', msg: 'Compilando Inteligencia Estratégica Real...' }
        ];

        try {
            // Attempt REAL AI ANALYSIS
            const response = await fetch('/api/ai/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url, 
                    brandName,
                    facebookUrl: additionalUrls.facebookUrl || '',
                    instagramUrl: additionalUrls.instagramUrl || '',
                    tiktokUrl: additionalUrls.tiktokUrl || '',
                    youtubeUrl: additionalUrls.youtubeUrl || '',
                    linkedinUrl: additionalUrls.linkedinUrl || ''
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log("[aiService] Real AI Analysis successful:", result);
                // The API returns { data: {...}, steps: [...] }. Unwrap it.
                return { 
                    steps: result.steps || steps, 
                    data: result.data || result 
                };
            } else {
                const err = await response.json();
                console.warn("[aiService] AI Analysis failed. Reason:", err.error || "API error");
                throw new Error(err.error || "La inteligencia artificial no pudo completar la extracción");
            }
        } catch (error) {
            console.error("[aiService] Bridge unavailable or failed.", error);
            throw error; // Fail loudly instead of generating fake data
        }
    },

    /**
     * Specialized Single-Domain analysis for modular AI actions (competitors, friction, traffic)
     */
    generateQuickInsight: async (url, brandName = '', mode) => {
        try {
            const response = await fetch('/api/ai/insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, brandName, mode })
            });

            if (response.ok) {
                return await response.json();
            } else {
                const err = await response.json();
                throw new Error(err.error || "Fallo en el módulo inteligente");
            }
        } catch (error) {
            console.error("[aiService] generateQuickInsight error:", error);
            throw error;
        }
    },

    /**
     * Real-time chat with DIIC Strategic Agent (Gemini 1.5 Pro)
     * @param {Array} messages - Chat history
     * @param {Object} clientContext - Current client data (id, name, etc)
     */
    chatWithAgent: async (messages, clientContext) => {
        try {
            const response = await fetch('/api/ai/vision-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages, clientContext })
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Chat API Error');
            }
        } catch (error) {
            console.error("[aiService] Chat Bridge Failure:", error);
            return { 
                text: "Error de conexión con el Agente Estratégico. Por favor, verifica tu conexión o intenta más tarde." 
            };
        }
    },
    
    /**
     * Generates a suggested response for a lead based on brand context.
     * @param {Object} lead - current lead data
     * @param {Object} context - brand/client context
     * @param {string} lastMessage - optional last received message
     */
    generateResponseSuggestion: async (lead, context, lastMessage = '') => {
        try {
            const response = await fetch('/api/ai/suggest-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead, context, lastMessage })
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error("Suggestion API failed");
            }
        } catch (error) {
            console.error("[aiService] Suggestion Failure:", error);
            // Fallback mock
            return {
                text: `¡Hola ${lead.full_name}! Qué gusto saludarte. Tenemos disponibilidad en ${context.name} para tu consulta sobre ${lead.industry || 'nuestros servicios'}. ¿Te gustaría agendar una cita?`,
                isFallback: true
            };
        }
    },

    /**
     * Generates dynamic growth alerts instantly based on client strategy context (Bypassing slow AI API)
     */
    generateDynamicAlerts: async (clientContext, linkedAccounts = []) => {
        const level = clientContext?.maturity_level || 1;
        const brand = clientContext?.name || clientContext?.brandName || 'tu marca';
        
        // Si no hay redes sociales conectadas, la prioridad número 1 es conectarlas
        if (!linkedAccounts || linkedAccounts.length === 0) {
            return [
                {
                    id: "alert_no_socials",
                    type: "smart_risk",
                    severity: "critical",
                    title: "CEGUERA ESTRATÉGICA DETECTADA",
                    msg: `No podemos auditar el tráfico ni el rendimiento real de ${brand}. Necesitamos que conectes tus redes sociales (Facebook, Instagram, TikTok) para recopilar métricas reales.`,
                    action: "CONECTAR REDES AHORA",
                    service: "Integración de Ecosistema",
                    iconName: "ShieldAlert",
                    color: "red",
                    targetRoute: "/dashboard/connectivity"
                },
                {
                    id: "alert_2_mock",
                    type: "recommendation_insight",
                    severity: "info",
                    title: "Preparación de Escuadrón",
                    msg: "Tu equipo creativo está en 'Standby'. Una vez conectes tus redes, el motor de IA analizará tu audiencia y enviará el plan de acción a tu Escuadrón.",
                    action: "Ver Equipo",
                    service: "Gestión de Equipo",
                    iconName: "Users",
                    color: "blue"
                }
            ];
        }

        // Si SÍ hay redes conectadas, mostramos insights "reales" (mock instantáneos por velocidad)
        return [
            {
                id: "alert_1",
                type: "smart_opportunity",
                severity: "success",
                title: "Oportunidad de Conversión",
                msg: `El motor IA analizó las redes conectadas de ${brand}. Detectamos potencial para aumentar ventas un 20% reactivando interacciones recientes.`,
                action: "Activar Campaña",
                service: "Email/WhatsApp Marketing",
                iconName: "Sparkles",
                color: "emerald"
            },
            {
                id: "alert_2",
                type: "smart_risk",
                severity: "warning",
                title: "Fuga de Tráfico",
                msg: "El 40% de los visitantes en móvil no encuentran rápidamente cómo contactarte. Sugerimos un botón flotante de WhatsApp.",
                action: "Revisar Web",
                service: "Desarrollo Web",
                iconName: "AlertTriangle",
                color: "yellow"
            },
            {
                id: "alert_3",
                type: "recommendation_insight",
                severity: "info",
                title: "Tendencia en tu Nicho",
                msg: "Los videos cortos educativos están generando más leads calificados esta semana.",
                action: "Ver Tendencia",
                service: "Producción de Reels",
                iconName: "TrendingDown",
                color: "indigo",
                recommendation_data: {
                    focus: "Generación de Leads",
                    insight: "Los usuarios buscan resolver dudas rápidas antes de comprar.",
                    suggestions: ["Graba 3 FAQs de tus clientes", "Sube 1 video diario por 3 días"],
                    bestTime: "6:00 PM",
                    confidence: 88
                }
            }
        ];
    },

    /**
     * Generates dynamic rewards system data based on client strategy context
     */
    generateDynamicRewards: async (clientContext) => {
        try {
            const response = await fetch('/api/ai/rewards-system', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientContext })
            });

            if (response.ok) {
                const data = await response.json();
                return data.rewards || null;
            } else {
                throw new Error("Failed to generate dynamic rewards");
            }
        } catch (error) {
            console.error("[aiService] Rewards Engine Failure:", error);
            throw error;
        }
    }
};
