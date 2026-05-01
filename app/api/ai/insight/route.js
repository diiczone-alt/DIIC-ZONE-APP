import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * TACTICAL INSIGHT ENGINE
 * Specialized modules for Competitors, Friction, and B2B Traffic.
 * Uses Dynamic Search Grounding to ensure reliability and authenticity.
 */
export async function POST(req) {
    try {
        const { url, brandName, mode, query, context, field, currentText } = await req.json();
        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

        console.log(`[NeuralInsight] Recalibrating ${mode} search for: ${url}`);

        // Extract Handle for better searching on social media
        let extractedContext = "";
        if (url.includes('instagram.com/')) {
            const handle = url.split('instagram.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de Instagram. El usuario es @${handle}.`;
        } else if (url.includes('facebook.com/')) {
            const handle = url.split('facebook.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de Facebook. El nombre de página/usuario es ${handle}.`;
        } else if (url.includes('tiktok.com/')) {
            const handle = url.split('tiktok.com/')[1].split('/')[0];
            extractedContext = `\nNOTA IMPORTANTE: Se trata de un perfil de TikTok. El usuario es ${handle}.`;
        }

        // Initialize Gemini with Dynamic Search Grounding
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            tools: [{ 
                googleSearch: {}
            }] 
        });

        let tacticalPrompt = "";
        const ignoreNameNote = brandName ? `(Nota: Si la URL parece pertenecer a una empresa distinta a "${brandName}", ignora el nombre registrado y basa tu análisis exclusivamente en la marca que encuentres en la URL).` : '';
        
        switch (mode) {
            case 'competitors':
                tacticalPrompt = `INVESTIGA Y LISTA LOS 3 COMPETIDORES DIRECTOS REALES DEL ECOSISTEMA EN: ${url}. ${ignoreNameNote}
                Devuelve un JSON con este formato: {"competitors": [{"name": "...", "usp": "...", "threat": "Low/Med/High"}]}`;
                break;
            case 'friction':
                tacticalPrompt = `ANALIZA EL SITIO WEB ${url} Y SUS REDES SOCIALES PARA DETECTAR 3 PUNTOS DE FRICCIÓN EN SU PROCESO DE VENTA (CRO). ${ignoreNameNote}
                Sé crítico y profesional. Devuelve una lista estructurada en Markdown.`;
                break;
            case 'traffic':
                tacticalPrompt = `AUDITA LAS POSIBLES RUTAS DE TRÁFICO B2B PARA ${url}. ${ignoreNameNote}
                ¿De dónde vienen sus clientes? (LinkedIn Ads, Google Search, Referidos, etc). Sé específico.`;
                break;
            case 'refine':
                tacticalPrompt = `INVESTIGA Y DETECTA INFORMACIÓN REAL PARA EL CAMPO "${field}" DE LA MARCA "${brandName}" BASÁNDOTE EN: ${url}. 
                Si ya existe este texto: "${currentText}", mejóralo con datos encontrados en la web. 
                Sé extremadamente conciso (máximo 3-4 líneas). No uses introducciones tipo "Aquí tienes...".`;
                break;
            case 'persuade':
                tacticalPrompt = `TOMA ESTE TEXTO ESTRATÉGICO: "${currentText}" (del campo ${field}) PARA LA MARCA "${brandName}" Y REESCRÍBELO USANDO SESGOS COGNITIVOS Y COPYWRITING DE ALTA CONVERSIÓN. 
                Usa el contexto de su web en ${url} para que sea auténtico. 
                Mantenlo corto, impactante e impulsado por resultados.`;
                break;
            default:
                tacticalPrompt = `Responde a la siguiente consulta estratégica de manera ESTRICTA sobre el ecosistema en la URL exacta: ${url}. ${ignoreNameNote}
                REGLA DE ORO: NO confundas la marca con empresas homónimas (con el mismo nombre o similar) en otros países o rubros. Asegúrate de que la información que utilizas pertenece EXACTAMENTE al perfil proporcionado y no a otra academia o empresa aleatoria.
                Consulta del usuario: "${query || 'Análisis general'}"
                Contexto actual de la plataforma: ${JSON.stringify(context || {})}. 
                Sé honesto, usa datos reales de búsqueda y si la info pertenece a otro país u otra empresa, corrígete.`;
        }

        let result;
        try {
            result = await model.generateContent(tacticalPrompt);
        } catch (genError) {
            console.warn("[Insight Engine] Search Model failed (Quota/Limit). Falling back to base model.", genError.message);
            const fallbackModel = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
            });
            result = await fallbackModel.generateContent(tacticalPrompt + "\n\n(NOTA: Tus herramientas de búsqueda en vivo están caídas por límite de cuota. Usa tu conocimiento base y provee estimaciones creíbles y educadas que sean realistas para el nicho mencionado.)");
        }

        const text = result.response.text();
        
        // If mode is competitors, try to parse JSON
        if (mode === 'competitors') {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return NextResponse.json(JSON.parse(jsonMatch[0]));
                } catch (e) {
                    console.error("JSON Parse error in competitors:", e);
                }
            }
        }

        return NextResponse.json({ insight: text });

    } catch (error) {
        console.error("INSIGHT ENGINE ERROR:", error);
        return NextResponse.json({ 
            error: "Falla en el motor de tácticas reales",
            insight: `Interferencia en la búsqueda: ${error.message}` 
        }, { status: 500 });
    }
}
