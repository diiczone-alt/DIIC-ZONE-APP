import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * STRATEGIC INTELLIGENCE ENGINE (GOD MODE)
 * Performs real-time multi-platform search grounding to avoid invented data.
 */
export async function POST(req) {
    // Dynamic steps for high-fidelity UI feedback
    const steps = [
        { id: 'grounding', msg: 'Activando Motores de Búsqueda Google...', icon: 'Search', source: 'google' },
        { id: 'social', msg: 'Rastreando Huella en FB, IG, TikTok y LinkedIn...', icon: 'Globe', source: 'social' },
        { id: 'leadership', msg: 'Verificando Liderazgo y Directorio Académico...', icon: 'ShieldCheck', source: 'linkedin' },
        { id: 'synthesis', msg: 'Compilando Inteligencia Estratégica Real...', icon: 'Zap', source: 'ai' }
    ];

    try {
        const { url, brandName } = await req.json();
        if (!url) return NextResponse.json({ error: 'Falta la URL de investigación' }, { status: 400 });

        if (!process.env.GEMINI_API_KEY) {
            console.error("[NeuralInvestigator] CRITICAL: GEMINI_API_KEY is not defined in environment variables.");
            return NextResponse.json({ error: 'Falla de configuración: API Key no detectada.' }, { status: 500 });
        }

        console.log(`[NeuralInvestigator] Starting Grounded Search for: ${brandName || url}`);

        // Extract Handle for better searching on social media
        let extractedContext = "";
        if (url.includes('instagram.com/')) {
            const handle = url.split('instagram.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de Instagram (@${handle}). Busca información sobre este especialista, médico o marca en Google, LinkedIn y directorios locales.`;
        } else if (url.includes('facebook.com/')) {
            const handle = url.split('facebook.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de Facebook (${handle}). Busca información sobre este negocio en Google y otras redes.`;
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            tools: [{ 
                googleSearch: {}
            }]
        });

        const prompt = `OBJETIVO: Investigar y analizar el ecosistema digital en la URL: ${url}.
        ${brandName ? `(Nombre registrado: "${brandName}")` : ''}
        ${extractedContext}
        
        INSTRUCCIONES CRÍTICAS:
        1. Utiliza Google Search para obtener datos REALES y ACTUALIZADOS.
        2. Si la URL es de Instagram/Facebook y el contenido está bloqueado para bots, busca el nombre del perfil en Google para hallar su sitio web, LinkedIn o directorios médicos/comerciales.
        3. NO INVENTES DATOS. Si no hallas nada, usa "Información no indexada" o "Dato no detectable".
        4. RESPONDE EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO.
        
        ESTRUCTURA JSON OBLIGATORIA:
        {
            "brandName": "Nombre real detectado o el registrado",
            "leadership": "Fundadores o especialistas hallados",
            "whatItDoes": "Descripción de la actividad principal",
            "whatItOffers": "Productos o servicios específicos",
            "targetAudience": "A quién se dirigen",
            "problemSolved": "Dolor que mitigan",
            "valueProp": "USP detectado",
            "tone": "Estilo de comunicación",
            "mainGoal": "Objetivo aparente (Ventas, LeadGen, etc)",
            "marketContext": "Ubicación y competencia detectada"
        }`;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (genError) {
            console.warn("[NeuralInvestigator] Primary Search Model failed.", genError.message);
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            result = await fallbackModel.generateContent(prompt + "\n\n(Fallback: No tienes acceso a búsqueda en vivo, usa tu conocimiento base o indica que no hay datos).");
            steps.push({ msg: 'Usando base de conocimiento (Búsqueda limitada)', icon: 'AlertTriangle', source: 'warning' });
        }

        const responseText = result.response.text();

        // Improved Robust JSON Extraction
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                let data = JSON.parse(jsonMatch[0]);
                return NextResponse.json({ data, steps });
            } catch (parseError) {
                console.error("[NeuralInvestigator] JSON Parse Error:", parseError);
            }
        }
        
        // If we reach here, it's because the AI didn't provide JSON or it was malformed
        if (responseText.length > 20) {
            // Tentativa de rescate: devolver el texto crudo en un campo si es coherente
            return NextResponse.json({ 
                data: { 
                    brandName: brandName || "No detectado",
                    whatItDoes: responseText.substring(0, 500) 
                }, 
                steps: [{ msg: 'Información parcial extraída', icon: 'AlertTriangle' }] 
            });
        }

        throw new Error("El motor de búsqueda no encontró huella digital suficiente para este enlace.");

    } catch (error) {
        console.error("[NeuralInvestigator] Critical Error:", error);
        
        let errorMessage = "Falla crítica en la red de búsqueda global.";
        if (error.message?.includes("SAFETY")) errorMessage = "Contenido restringido por filtros de seguridad.";
        if (error.message?.includes("quota") || error.message?.includes("429")) errorMessage = "Cuota de IA excedida. Reintenta en 60 segundos.";
        if (error.message?.includes("huella digital")) errorMessage = error.message;

        return NextResponse.json({ 
            error: errorMessage,
            details: error.message,
            steps: [{ msg: 'Interferencia en la señal de búsqueda', icon: 'AlertTriangle', source: 'error' }]
        }, { status: 500 });
    }
}

