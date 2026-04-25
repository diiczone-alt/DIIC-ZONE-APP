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
                console.log("[aiService] Real AI Analysis successful:", data);
                return { steps, data };
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
    }
};
