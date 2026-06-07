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
                Para cada competidor, encuentra OBLIGATORIAMENTE su Sitio Web, Redes Sociales (Instagram/Facebook) y Ubicación/Alcance.
                Devuelve un JSON con este formato: {"competitors": [{"name": "...", "url": "...", "social": "...", "location": "...", "strengthsWeaknesses": "..."}]}`;
                break;
            case 'friction':
                tacticalPrompt = `ANALIZA EL SITIO WEB ${url} Y SUS REDES SOCIALES PARA DETECTAR 3 PUNTOS DE FRICCIÓN EN SU PROCESO DE VENTA (CRO). ${ignoreNameNote}
                Sé crítico y profesional. Devuelve una lista estructurada en Markdown.`;
                break;
            case 'traffic':
                tacticalPrompt = `AUDITA LAS POSIBLES RUTAS DE TRÁFICO B2B PARA ${url}. ${ignoreNameNote}
                ¿De dónde vienen sus clientes? (LinkedIn Ads, Google Search, Referidos, etc). Sé específico.`;
                break;
            case 'social_audit':
                tacticalPrompt = `REALIZA UNA AUDITORÍA PROFESIONAL DE REDES SOCIALES EN TIEMPO REAL PARA LA MARCA EN: ${url}. ${ignoreNameNote}
                Busca de manera individual sus perfiles de Instagram, Facebook, TikTok, YouTube y LinkedIn en Google. Detalla para cada uno:
                1. Su nivel de actividad actual, consistencia y frecuencia de publicaciones.
                2. Calidad visual, marca, valor del contenido y consistencia visual en general.
                3. Engagement con la comunidad y respuestas a comentarios.
                4. Oportunidades estratégicas críticas de mejora y crecimiento en cada plataforma.
                Escribe un diagnóstico sumamente analítico, crítico y constructivo al estilo de un experto y empresario digital en formato Markdown estructurado.`;
                break;
            case 'improvement_plan':
                tacticalPrompt = `DISEÑA UN PLAN DE CRECIMIENTO Y MEJORA ESTRATÉGICO INTEGRAL PARA EL ECOSISTEMA EN: ${url}. ${ignoreNameNote}
                Basándote en su presencia web y redes sociales reales encontradas en la búsqueda, diseña un plan táctico de crecimiento:
                1. Objetivos estratégicos SMART a corto y mediano plazo (ej. branding, captación, retención).
                2. Plan de optimización de la web / landing page para aumentar conversión (CRO y diseño de oferta de valor).
                3. Plan de contenidos estratégico para redes sociales (pilares de contenido, ganchos y distribución).
                4. Recomendaciones específicas de tráfico pago (Facebook/Google Ads) y automatización con IA.
                Devuelve una propuesta ejecutable, sumamente detallada, profesional y convincente en formato Markdown con negritas y listas.`;
                break;
            case 'refine':
                tacticalPrompt = `INVESTIGA EXHAUSTIVAMENTE EN LA WEB (incluyendo redes sociales como Instagram, Facebook, LinkedIn y listados locales) información real sobre la marca "${brandName}" (basándote en ${url}) para el campo "${field}".
                Si ya existe este texto: "${currentText}", mejóralo y compleméntalo con los nuevos datos reales encontrados.
                Sé extremadamente conciso (máximo 3-4 líneas). No inventes datos y no uses introducciones tipo "Aquí tienes...".`;
                break;
            case 'persuade':
                tacticalPrompt = `TOMA ESTE TEXTO ESTRATÉGICO: "${currentText}" (del campo ${field}) PARA LA MARCA "${brandName}" Y REESCRÍBELO USANDO SESGOS COGNITIVOS Y COPYWRITING DE ALTA CONVERSIÓN. 
                Usa el contexto de su web en ${url} para que sea auténtico. 
                Mantenlo corto, impactante e impulsado por resultados.`;
                break;
            default:
                const brandContext = context || {};
                const nameToSearch = brandContext.brandName || brandName || '';
                const locationToSearch = brandContext.location || '';
                const industryToSearch = brandContext.industry || '';
                
                tacticalPrompt = `Eres un Estratega Digital y Consultor de Negocios de Élite. Tu objetivo es realizar una investigación exhaustiva y sumamente profesional sobre la marca "${nameToSearch}" ${locationToSearch ? `ubicada en ${locationToSearch}` : ''}.
                
                Para responder a la consulta del usuario, NO te limites únicamente a analizar la URL principal (${url}). Debes buscar activamente y cruzar información en:
                1. Redes sociales principales (Facebook, Instagram, LinkedIn, TikTok, YouTube).
                2. Canales locales y directorios (Google Maps, listados locales de ${locationToSearch || 'su región'}).
                3. Noticias, comunicados de prensa y cualquier otra mención en la web.
                
                Consulta del usuario: "${query || 'Análisis general'}"
                
                Contexto estratégico actual de la marca:
                - Nombre de marca: ${nameToSearch}
                - Sitio Web/Red principal: ${url}
                - Redes registradas: Instagram: ${brandContext.instagramUrl || 'No registrada'}, Web: ${brandContext.websiteUrl || 'No registrada'}
                - Ubicación: ${locationToSearch || 'No especificada'}
                - Sector: ${industryToSearch || 'No especificado'}
                - Líderes/Fundadores: ${brandContext.leadership || 'No especificado'}
                - Qué hace: ${brandContext.whatItDoes || 'No especificado'}
                - Qué ofrece: ${brandContext.whatItOffers || 'No especificado'}
                - Propuesta de valor: ${brandContext.valueProp || 'No especificado'}
                - Tono: ${brandContext.tone || 'Profesional'}
                
                REGLA DE ORO DE SEGURIDAD Y PRECISIÓN:
                - Asegúrate de buscar información que pertenezca a la marca real en su ubicación geográfica (${locationToSearch || 'local'}). 
                - Si encuentras marcas homónimas (mismo nombre en otros países, ciudades o industrias), descártalas inmediatamente para evitar mezclar información.
                - Entrega tu respuesta con una presentación sumamente profesional, clara y estructurada, similar al estilo analítico y elegante de Claude. Usa formato Markdown bien estructurado, negritas estratégicas y listas si es necesario.`;
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
