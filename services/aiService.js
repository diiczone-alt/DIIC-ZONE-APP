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
    analyzeStrategicProfile: async (url, brandName = '') => {
        // Steps for the UI progress bar
        const steps = [
            { id: 'scraping', msg: 'Rastreando activos digitales...' },
            { id: 'parsing', msg: 'Analizando arquitectura de información...' },
            { id: 'keywords', msg: 'Extrayendo keywords de nicho...' },
            { id: 'audience', msg: 'Identificando patrones de audiencia...' },
            { id: 'strategy', msg: 'Generando propuesta de valor CEO...' }
        ];

        try {
            // Attempt REAL AI ANALYSIS
            const response = await fetch('/api/ai/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, brandName })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("[aiService] Real AI Analysis successful");
                return { steps, data };
            } else {
                const err = await response.json();
                console.warn("[aiService] Falling back to simulation. Reason:", err.error || "API error");
            }
        } catch (error) {
            console.error("[aiService] Bridge unavailable. Falling back to simulation.", error);
        }

        // FALLBACK: Simulation logic if real API is not ready
        const mockResponses = {
            'fitness': {
                brandName: brandName || 'Apex Performance',
                whatItDoes: 'Optimización física y mental para emprendedores de alto rendimiento.',
                whatItOffers: 'Programas de Biohacking, Coaching 1-a-1 y suplementación inteligente basada en biomarcadores.',
                targetAudience: 'CEOs y fundadores (30-45 años) con poco tiempo que buscan maximizar su energía y longevidad.',
                problemSolved: 'Burnout, falta de energía y estancamiento físico debido a la alta carga laboral.',
                valueProp: 'Transformamos tu cuerpo en tu activo más rentable mediante sistemas de salud basados en datos.',
                tone: 'Autoritario, científico pero motivador y directo.',
                mainGoal: 'Consolidar la marca como el referente #1 de Biohacking en habla hispana y lograr $500K en ventas anuales.'
            },
            'realestate': {
                brandName: brandName || 'Lux Living Group',
                whatItDoes: 'Boutique de inversión inmobiliaria de lujo y gestión de patrimonio.',
                whatItOffers: 'Acceso a off-market deals, asesoría legal internacional y gestión de alquileres vacacionales premium.',
                targetAudience: 'Inversores internacionales y nómadas digitales de alto patrimonio buscando refugio de capital.',
                problemSolved: 'Complejidad legal y falta de transparencia en inversiones inmobiliarias extranjeras.',
                valueProp: 'Hacemos que invertir en el Caribe sea tan seguro y rentable como en Nueva York.',
                tone: 'Sofisticado, exclusivo, transparente y orientado a resultados.',
                mainGoal: 'Dominar el mercado de rentas cortas de lujo y expandir el portafolio a 3 nuevos países en 2026.'
            },
            'generic': {
                brandName: brandName || 'Ecosistema Digital',
                whatItDoes: 'Consultoría estratégica de crecimiento y escalabilidad digital.',
                whatItOffers: 'Sistemas de adquisición de clientes, automatización de procesos y diseño de oferta High-Ticket.',
                targetAudience: 'Expertos, coaches y agencias estancadas entre los $5K y $10K mensuales.',
                problemSolved: 'Dependencia del dueño de negocio y falta de previsibilidad en la facturación.',
                valueProp: 'Construimos sistemas que venden mientras duermes, permitiéndote recuperar tu libertad.',
                tone: 'Disruptivo, visionario, honesto y altamente tecnológico.',
                mainGoal: 'Escalar 100 negocios al nivel de $50K/mes con un margen operativo del 40%.'
            }
        };

        // Select strategy based on URL keywords or default to generic
        const lowerUrl = url.toLowerCase();
        let niche = 'generic';
        if (lowerUrl.includes('fit') || lowerUrl.includes('gym') || lowerUrl.includes('salud')) niche = 'fitness';
        if (lowerUrl.includes('real') || lowerUrl.includes('home') || lowerUrl.includes('casa') || lowerUrl.includes('lux')) niche = 'realestate';

        return {
            steps,
            data: mockResponses[niche]
        };
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
    }
};
