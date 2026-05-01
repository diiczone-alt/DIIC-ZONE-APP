import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { clientContext } = await req.json();
        
        if (!clientContext) {
            return NextResponse.json({ error: 'Contexto de cliente requerido' }, { status: 400 });
        }

        console.log(`[NeuralGrowth] Generando alertas dinámicas para: ${clientContext.name || 'Cliente sin nombre'}`);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            // We use responseMimeType JSON to force strict array parsing
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        // We will generate 3 to 5 highly relevant alerts based on their profile.
        // Alert Types: 'activity', 'performance', 'system', 'operational', 'intelligence_insight', 'smart_risk', 'smart_opportunity', 'recommendation_insight'
        // Severity: 'critical', 'warning', 'info', 'success'
        // Colors: 'red', 'yellow', 'blue', 'indigo', 'emerald'

        const prompt = `ERES EL DIRECTOR DE ESTRATEGIA (CMO) DE UNA AGENCIA DE ALTO NIVEL Y ESTÁS MONITOREANDO EL NEGOCIO DE TU CLIENTE.
        
        AQUÍ ESTÁ LA INFORMACIÓN ESTRATÉGICA DEL CLIENTE:
        Nombre/Marca: ${clientContext.name || clientContext.brandName || 'No definido'}
        Qué Hace: ${clientContext.whatItDoes || 'No definido'}
        Qué Ofrece (Productos/Servicios): ${clientContext.whatItOffers || 'No definido'}
        Público Objetivo: ${clientContext.targetAudience || 'No definido'}
        Nivel de Crecimiento Actual: ${clientContext.maturity_level || 'Inicial (Presencia Digital)'}
        
        TU MISIÓN: Genera entre 3 y 5 alertas/recomendaciones operativas basadas ESTRICTAMENTE en su nicho y nivel de crecimiento.
        No des alertas genéricas (ej. "Mejora tus redes"). Sé MUY ESPECÍFICO a su nicho. Si es médico, habla de pacientes y consultas. Si es academia, habla de alumnos e inscripciones.
        
        Incluye al menos una alerta de tipo "smart_opportunity" y una alerta de tipo "recommendation_insight".
        
        DEVUELVE UN ARRAY JSON ESTRICTO CON ESTE FORMATO EXACTO:
        [
          {
            "id": "generar_id_unico",
            "type": "smart_opportunity", // usar los tipos válidos
            "severity": "success",
            "title": "Título Corto e Impactante",
            "msg": "Mensaje detallado pero directo al grano (máx 3 líneas).",
            "action": "Botón Call to Action Corto",
            "service": "Servicio de Agencia a Vender",
            "targetTab": "identity", // identity, catalog, rewards, settings (OPCIONAL)
            "iconName": "Sparkles", // Nombres válidos en Lucide-react (ej: AlertTriangle, TrendingDown, Clock, Zap, Target, Lightbulb, Activity)
            "color": "emerald", // red, yellow, blue, indigo, emerald
            // (OPCIONAL, SOLO PARA type = 'recommendation_insight'):
            "recommendation_data": {
                "focus": "Foco de la estrategia",
                "insight": "Dato curioso del nicho...",
                "suggestions": ["Sugerencia 1", "Sugerencia 2"],
                "bestTime": "Ej. 7:30 PM",
                "confidence": 95
            }
          }
        ]
        
        NO DEVUELVAS NADA MÁS QUE EL ARRAY JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const data = JSON.parse(text);
        
        return NextResponse.json({ alerts: data });

    } catch (error) {
        console.error("GROWTH ALERTS ERROR:", error);
        return NextResponse.json({ 
            error: "Falla en el motor predictivo de crecimiento",
            details: error.message 
        }, { status: 500 });
    }
}
