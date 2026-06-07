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
        const { url, brandName, facebookUrl, instagramUrl, tiktokUrl, youtubeUrl, linkedinUrl } = await req.json();
        if (!url && !facebookUrl && !instagramUrl && !tiktokUrl && !youtubeUrl && !linkedinUrl) {
            return NextResponse.json({ error: 'Falta la URL de investigación' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("[NeuralInvestigator] CRITICAL: GEMINI_API_KEY is not defined in environment variables.");
            return NextResponse.json({ error: 'Falla de configuración: API Key no detectada.' }, { status: 500 });
        }

        const primarySearchUrl = url || instagramUrl || facebookUrl || tiktokUrl || youtubeUrl || linkedinUrl;
        console.log(`[NeuralInvestigator] Starting Grounded Search for: ${brandName || primarySearchUrl}`);

        let socialUrlsContext = "";
        if (facebookUrl) socialUrlsContext += `\n- Facebook: ${facebookUrl}`;
        if (instagramUrl) socialUrlsContext += `\n- Instagram: ${instagramUrl}`;
        if (tiktokUrl) socialUrlsContext += `\n- TikTok: ${tiktokUrl}`;
        if (youtubeUrl) socialUrlsContext += `\n- YouTube: ${youtubeUrl}`;
        if (linkedinUrl) socialUrlsContext += `\n- LinkedIn: ${linkedinUrl}`;

        // Extract Handle for better searching on social media
        let extractedContext = "";
        if (url && url.includes('instagram.com/')) {
            const handle = url.split('instagram.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de Instagram (@${handle}). Busca información sobre este especialista, médico o marca en Google, LinkedIn y directorios locales.`;
        } else if (url && url.includes('facebook.com/')) {
            const handle = url.split('facebook.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de Facebook (${handle}). Busca información sobre este negocio en Google y otras redes.`;
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            tools: [{ 
                googleSearch: {}
            }]
        });

        const prompt = `OBJETIVO: Investigar y analizar el ecosistema digital completo de la marca.
        Sitio Web Principal / Enlace base: ${url || 'No especificado'}
        ${brandName ? `(Nombre registrado de la marca: "${brandName}")` : ''}
        ${socialUrlsContext ? `\nPerfiles de Redes Sociales de la marca:${socialUrlsContext}` : ''}
        ${extractedContext}
        
        INSTRUCCIONES CRÍTICAS:
        1. Utiliza Google Search para realizar búsquedas activas y obtener datos REALES, FIABLES y ACTUALIZADOS sobre el sitio web y cada uno de los perfiles de redes sociales provistos arriba.
        2. Realiza búsquedas específicas en Google para rastrear lo que hace la marca, sus líderes/fundadores, sus servicios, su propuesta de valor única y su contexto de mercado.
        3. NO INVENTES DATOS. Si no hallas nada tras las búsquedas en Google, coloca "Información no indexada" o "Dato no detectable". No uses datos simulados de ejemplo bajo ninguna circunstancia.
        4. Como estratega, diseña de 3 a 4 botones o chips de búsqueda adicionales hiper-específicos para este nicho/empresa basándote en lo hallado en las búsquedas (ej. temas locales, alianzas, debilidades de competidores o dudas específicas).
        5. RESPONDE EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO.
        
        ESTRUCTURA JSON OBLIGATORIA:
        {
            "brandName": "Nombre real de la marca detectado en las búsquedas o el registrado",
            "leadership": "Fundadores, directores o especialistas reales hallados",
            "whatItDoes": "Descripción detallada de la actividad principal y sector",
            "whatItOffers": "Productos, servicios o portafolio específico ofrecido",
            "targetAudience": "Público objetivo y perfil de cliente ideal real",
            "problemSolved": "Dolor o problemas específicos que mitigan para su audiencia",
            "valueProp": "Propuesta Única de Valor (USP) real detectada",
            "tone": "Tono y estilo de comunicación real en sus publicaciones y web",
            "mainGoal": "Objetivo comercial aparente",
            "marketContext": "Ubicación geográfica, mercado y entorno competitivo real detectado",
            "dynamicButtons": ["Búsqueda o pregunta estratégica sugerida 1", "Búsqueda o pregunta estratégica sugerida 2", "Búsqueda o pregunta estratégica sugerida 3"]
        }
        
        REQUISITOS PARA dynamicButtons:
        - Deben ser exactamente de 3 a 4 preguntas o búsquedas estratégicas basadas en los hallazgos reales de la investigación y específicas para este nicho.
        - Evita generalidades y no inventes datos.`;

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
                if (!data.dynamicButtons) {
                    data.dynamicButtons = [];
                }
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
                    whatItDoes: responseText.substring(0, 500),
                    dynamicButtons: []
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

