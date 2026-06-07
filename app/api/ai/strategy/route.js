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

        const prompt = `OBJETIVO: Investigar y analizar en profundidad el ecosistema digital completo de la marca buscando de manera individual cada canal provisto.
        Sitio Web Principal / Enlace base: ${url || 'No especificado'}
        ${brandName ? `(Nombre registrado de la marca: "${brandName}")` : ''}
        ${socialUrlsContext ? `\nPerfiles de Redes Sociales de la marca:${socialUrlsContext}` : ''}
        ${extractedContext}
        
        INSTRUCCIONES CRÍTICAS DE BÚSQUEDA Y ANÁLISIS:
        1. Utiliza obligatoriamente la herramienta de Google Search para realizar búsquedas activas y obtener datos REALES, FIABLES y ACTUALIZADOS sobre el sitio web y sobre CADA UNO de los perfiles de redes sociales provistos arriba.
        2. DEBES ejecutar consultas de Google Search separadas o específicas para cada enlace de red social provisto (por ejemplo: si se ingresó un link de Facebook, busca en Google qué dice ese perfil o fanpage; si se ingresó Instagram, busca información del feed de ese usuario; etc.). No consolides todo en una sola búsqueda genérica.
        3. Investiga y mapea la información real sobre la marca de todos los canales activos: qué servicios o productos promueven en su web, qué tipo de publicaciones hacen en Instagram/Facebook/TikTok, quiénes lideran la marca, cuál es su propuesta de valor única, su tono de comunicación y su contexto comercial real.
        4. NO INVENTES DATOS. Si tras buscar activamente en Google no encuentras resultados reales para algún campo, coloca "Información no indexada en Google para este canal". Bajo ninguna circunstancia uses datos ficticios o ejemplos simulados.
        5. Como estratega, diseña de 3 a 4 botones o chips de búsqueda adicionales hiper-específicos para este nicho/empresa basándote en lo hallado en las búsquedas (ej. temas locales, alianzas, debilidades de competidores o dudas específicas).
        6. RESPONDE EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO.
        
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
            "socialAudit": "Auditoría en profundidad de la huella en redes sociales de la marca. Para cada red provista (Facebook, Instagram, TikTok, YouTube, LinkedIn), detalla de forma profesional su presencia, su actividad real, calidad visual, engagement con la comunidad y oportunidades estratégicas de mejora. Sé muy específico con el contenido que publican. Si no se proveyeron redes, indica 'Sin canales sociales configurados para auditoría'.",
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
        
        let errorMessage = `Falla en el escáner de IA: ${error.message || "Error desconocido de red"}`;
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

