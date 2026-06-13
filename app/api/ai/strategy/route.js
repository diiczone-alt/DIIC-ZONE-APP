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

        // --- STAGE 1: GROUNDED RESEARCH ---
        let researchResult;
        let usedModelName = "gemini-2.5-flash";
        let usedGrounding = true;
        
        const researchPrompt = `OBJETIVO: Investigar y realizar una auditoría exhaustiva en tiempo real sobre la marca y sus canales digitales para obtener datos 100% reales.
        Nombre de la marca: ${brandName || 'No especificado'}
        Sitio Web Principal / Enlace base: ${url || 'No especificado'}
        ${socialUrlsContext ? `\nPerfiles de Redes Sociales de la marca:${socialUrlsContext}` : ''}
        ${extractedContext}
        
        INSTRUCCIONES CRÍTICAS DE BÚSQUEDA Y ANÁLISIS:
        1. Utiliza obligatoriamente la herramienta de Google Search para realizar búsquedas activas y obtener datos REALES, FIABLES y ACTUALIZADOS sobre el sitio web y sobre CADA UNO de los perfiles de redes sociales provistos arriba.
        2. DEBES ejecutar consultas de Google Search separadas o específicas para cada enlace de red social provisto (por ejemplo: si se ingresó un link de Facebook, busca en Google qué dice ese perfil o fanpage; si se ingresó Instagram, busca información del feed de ese usuario; etc.). No consolides todo en una sola búsqueda genérica.
        3. Escribe un reporte de investigación detallado y en profundidad que contenga las siguientes secciones:
           - NOMBRE DE LA MARCA
           - LIDERAZGO (Fundadores, directores o especialistas reales hallados)
           - QUÉ HACE LA MARCA (Actividad principal y sector)
           - QUÉ OFRECE (Productos, servicios o portafolio específico)
           - PÚBLICO OBJETIVO (Público objetivo y perfil de cliente ideal real)
           - PROBLEMAS QUE RESUELVE (Dolor o problemas específicos que mitigan)
           - PROPUESTA DE VALOR (Propuesta Única de Valor / USP real)
           - TONO DE COMUNICACIÓN (Estilo de comunicación en publicaciones y web)
           - OBJETIVO COMERCIAL APARENTE (Metas o KPIs percibidos)
           - CONTEXTO DE MERCADO Y GEOGRÁFICO (Ubicación, mercado y entorno competitivo)
           - AUDITORÍA DE REDES SOCIALES: Detalla e investiga de manera exhaustiva y profunda la presencia de la marca en Facebook, Instagram, TikTok, YouTube y/o LinkedIn. Para cada red social provista arriba, escribe un diagnóstico detallado, su actividad real, calidad de contenido, engagement y oportunidades específicas de mejora estratégica. ¡Sé muy específico con el contenido real que publican! Comenta sobre la consistencia visual y de marca. Si no se proveyeron redes sociales, indica "Sin canales sociales configurados para auditoría".
           - PREGUNTAS ESTRATÉGICAS SUGERIDAS (Diseña de 3 a 4 preguntas o búsquedas específicas basadas en los hallazgos reales de la investigación para este nicho).

        NO INVENTES DATOS. Si tras buscar activamente en Google no encuentras resultados reales para algún campo, coloca "Información no indexada en Google para este canal". Bajo ninguna circunstancia uses datos ficticios o ejemplos simulados.`;

        try {
            console.log("[NeuralInvestigator] Attempting gemini-2.5-flash with search...");
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash", 
                tools: [{ googleSearch: {} }]
            });
            researchResult = await model.generateContent(researchPrompt);
        } catch (genError) {
            console.warn("[NeuralInvestigator] Primary model (gemini-2.5-flash with search) failed:", genError.message);
            
            // Fallback 1: gemini-2.0-flash with search grounding (typically has separate/larger limits)
            try {
                console.log("[NeuralInvestigator] Attempting Fallback 1: gemini-2.0-flash with search...");
                const model = genAI.getGenerativeModel({ 
                    model: "gemini-2.0-flash", 
                    tools: [{ googleSearch: {} }]
                });
                researchResult = await model.generateContent(researchPrompt);
                usedModelName = "gemini-2.0-flash";
                steps.push({ msg: 'Usando motor de búsqueda secundario (Gemini 2.0)', icon: 'Globe', source: 'google' });
            } catch (err1) {
                console.warn("[NeuralInvestigator] Fallback 1 failed:", err1.message);
                
                // Fallback 2: gemini-2.5-flash without search grounding
                try {
                    console.log("[NeuralInvestigator] Attempting Fallback 2: gemini-2.5-flash without search...");
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    researchResult = await model.generateContent(researchPrompt + "\n\n(Fallback: No tienes acceso a búsqueda en vivo, usa tu conocimiento base o indica que no hay datos).");
                    usedGrounding = false;
                    steps.push({ msg: 'Usando base de conocimiento (Búsqueda offline)', icon: 'AlertTriangle', source: 'warning' });
                } catch (err2) {
                    console.warn("[NeuralInvestigator] Fallback 2 failed:", err2.message);
                    
                    // Fallback 3: gemini-2.0-flash without search grounding (highly stable free tier model)
                    console.log("[NeuralInvestigator] Attempting Fallback 3: gemini-2.0-flash without search...");
                    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                    researchResult = await model.generateContent(researchPrompt + "\n\n(Fallback: No tienes acceso a búsqueda en vivo, usa tu conocimiento base o indica que no hay datos).");
                    usedModelName = "gemini-2.0-flash";
                    usedGrounding = false;
                    steps.push({ msg: 'Usando base de conocimiento secundaria (Búsqueda offline)', icon: 'AlertTriangle', source: 'warning' });
                }
            }
        }

        const researchText = researchResult.response.text();

        // --- STAGE 2: JSON STRUCTURING ---
        const structuringPrompt = `Toma el siguiente informe de investigación de una marca y estructúralo EXACTAMENTE en el formato JSON solicitado. No inventes información, utiliza únicamente los hechos reales presentados en el informe. Si el informe dice que algo no se encontró o no está indexado, refléjalo con esa misma frase.

        Informe de investigación:
        \"\"\"
        ${researchText}
        \"\"\"

        FORMATO JSON OBLIGATORIO:
        {
            "brandName": "Nombre real de la marca o el registrado",
            "leadership": "Liderazgo, fundadores o especialistas reales hallados",
            "whatItDoes": "Descripción detallada de la actividad principal y sector",
            "whatItOffers": "Productos, servicios o portafolio específico ofrecido",
            "targetAudience": "Público objetivo y perfil de cliente ideal real",
            "problemSolved": "Dolor o problemas específicos que mitigan",
            "valueProp": "Propuesta Única de Valor (USP) real detectada",
            "tone": "Tono y estilo de comunicación real en sus publicaciones y web",
            "mainGoal": "Objetivo comercial aparente",
            "marketContext": "Ubicación geográfica, mercado y entorno competitivo",
            "socialAudit": "Auditoría en profundidad de la huella en redes sociales. Para cada red provista (Facebook, Instagram, TikTok, YouTube, LinkedIn), resume de forma muy profesional, analítica, experta y empresarial su presencia, su actividad real, calidad de contenido, engagement y oportunidades específicas de mejora estratégica. Si no hay redes, indica 'Sin canales sociales configurados para auditoría'.",
            "dynamicButtons": ["Pregunta sugerida 1", "Pregunta sugerida 2", "Pregunta sugerida 3"]
        }

        Responde únicamente con el JSON válido.`;

        let responseText;
        try {
            console.log(`[NeuralInvestigator] Structuring JSON with ${usedModelName}...`);
            const structuringModel = genAI.getGenerativeModel({ model: usedModelName });
            const structuringResult = await structuringModel.generateContent(structuringPrompt);
            responseText = structuringResult.response.text();
        } catch (structError) {
            console.warn("[NeuralInvestigator] Primary structuring failed, falling back to gemini-2.0-flash:", structError.message);
            const fallbackStruct = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const structuringResult = await fallbackStruct.generateContent(structuringPrompt);
            responseText = structuringResult.response.text();
        }

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

