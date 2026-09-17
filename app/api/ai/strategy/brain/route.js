import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const body = await req.json();
        const { 
            action = 'chat', 
            message, 
            history = [], 
            clientName = 'Marca DIIC', 
            profile = {}, 
            researches = [], 
            selectedFolderId = null 
        } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ success: false, error: 'GEMINI_API_KEY no configurada' }, { status: 500 });
        }

        const safeBrandName = (profile.brandName || clientName || 'Marca').replace(/[-_\s]+workspace\s*$/i, '').trim();

        // Helper to run content with model fallbacks
        const generateWithFallback = async (prompt, isJson = false) => {
            const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
            let lastError = null;

            for (const modelName of modelsToTry) {
                try {
                    const modelConfig = { model: modelName };
                    if (isJson) {
                        modelConfig.generationConfig = { responseMimeType: 'application/json' };
                    }
                    const model = genAI.getGenerativeModel(modelConfig);
                    const result = await model.generateContent(prompt);
                    return result.response.text();
                } catch (err) {
                    console.warn(`[AI Strategy Brain] Model ${modelName} failed, trying next fallback:`, err.message);
                    lastError = err;
                }
            }
            throw lastError || new Error('Fallo al invocar modelos de Inteligencia Artificial');
        };

        // ACTION 1: INTERACTIVE STRATEGIC BRAIN CHAT
        if (action === 'chat') {
            if (!message) {
                return NextResponse.json({ success: false, error: 'Mensaje requerido' }, { status: 400 });
            }

            const relevantResearches = selectedFolderId && selectedFolderId !== 'all'
                ? researches.filter(r => (r.folderId === selectedFolderId || r.folder_id === selectedFolderId))
                : researches;

            const researchesContext = relevantResearches.map((r, idx) => `
--- INVESTIGACIÓN #${idx + 1}: ${r.title} ---
Tipo/Categoría: ${r.category || r.type || 'General'}
Fecha: ${r.createdAt || r.created_at || 'Reciente'}
Resumen/Hallazgos: ${typeof r.data === 'string' ? r.data : JSON.stringify(r.data || r.summary || r.content || '').substring(0, 1500)}
Puntos de Fricción / Dolores: ${JSON.stringify(r.frictionPoints || r.painPoints || (r.data?.frictionPoints) || [])}
Ganchos / Ideas: ${JSON.stringify(r.hooks || r.ideas || (r.data?.hooks) || [])}
`).join('\n');

            const profileContext = `
PERFIL ESTRATÉGICO ACTUAL DE LA MARCA:
- Nombre de Marca: ${safeBrandName}
- Liderazgo / Fundadores: ${profile.leadership || 'No especificado'}
- Qué Hace (Actividad / Sector): ${profile.whatItDoes || 'No especificado'}
- Qué Ofrece (Servicios / Productos): ${profile.whatItOffers || 'No especificado'}
- Público Objetivo / Avatar: ${profile.targetAudience || 'Clientes potenciales del nicho'}
- Problemas / Dolores que Resuelve: ${profile.problemSolved || 'Necesidades y fricciones de su mercado'}
- Propuesta Única de Valor (UVP): ${profile.valueProp || 'Diferencial competitivo en definición'}
- Tono de Comunicación: ${profile.tone || 'Profesional, empático y orientado a resultados'}
- Objetivo Comercial Principal: ${profile.mainGoal || 'Crecimiento, posicionamiento y captación'}
- Contexto de Mercado / Geográfico: ${profile.marketContext || 'No especificado'}
- Auditoría de Redes: ${profile.socialAudit || 'No especificado'}
`;

            const systemInstruction = `Eres el Director Supremo de Inteligencia y Estrategia de Crecimiento de DIIC ZONE (DIIC AI Brain) para la marca "${safeBrandName}".
Tu función es actuar como el cerebro estratégico experto que conoce a fondo todas las investigaciones, dossiers temáticos, competidores, puntos de fricción y el perfil estratégico real del negocio.

CONOCIMIENTO DE LA MARCA:
${profileContext}

INVESTIGACIONES Y DOSSIERS GUARDADOS (${relevantResearches.length} documentos):
${researchesContext || 'No hay investigaciones guardadas adicionales aún. Utiliza el conocimiento base del perfil estratégico de la marca.'}

INSTRUCCIONES CRÍTICAS DE RESPUESTA:
1. Responde de manera sumamente analítica, profesional, estructurada y directa al grano, utilizando formato Markdown elegante (negritas estratégicas, listas organizadas, citas > para advertencias o notas clave).
2. Basa tus recomendaciones SIEMPRE en la realidad e industria del cliente y en los hallazgos reales de las investigaciones guardadas (dolores de prospectos, ganchos de alta retención, ventajas competitivas, objeciones de compra).
3. Adapta el lenguaje a la verdadera industria del cliente (gastronomía, servicios, tecnología, retail, salud, consultoría, etc.). NO asumas un nicho médico a menos que el perfil o las investigaciones sean expresamente sobre salud.
4. Si te piden ideas de contenido, guiones o copys de pauta, provee ganchos (0-3s), desarrollo de alto valor y llamados a la acción (CTA) precisos para conversión.`;

            const chatHistoryFormatted = history.map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text || h.content || '' }]
            }));

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const chat = model.startChat({
                history: [
                    { role: 'user', parts: [{ text: systemInstruction }] },
                    { role: 'model', parts: [{ text: `Entendido. Soy el Asistente y Director Estratégico de DIIC ZONE para ${safeBrandName}. Tengo acceso a todas las investigaciones, carpetas y perfil estratégico de la marca. ¿En qué podemos avanzar hoy?` }] },
                    ...chatHistoryFormatted
                ]
            });

            const result = await chat.sendMessage(message);
            const responseText = result.response.text();

            return NextResponse.json({
                success: true,
                reply: responseText
            });
        }

        // ACTION 2: CONSOLIDATE RESEARCHES INTO STRATEGIC PROFILE (100% REAL DATA)
        if (action === 'consolidate_profile') {
            const researchesToConsolidate = researches.length > 0 ? researches : [];
            if (researchesToConsolidate.length === 0) {
                return NextResponse.json({ success: false, error: 'No se seleccionaron investigaciones para consolidar' }, { status: 400 });
            }

            const preparedResearches = researchesToConsolidate.map((r, i) => {
                let fullText = '';
                if (typeof r.data === 'string') {
                    fullText = r.data;
                } else if (r.data && typeof r.data === 'object') {
                    fullText = r.data.insight || r.data.content || r.data.summary || JSON.stringify(r.data);
                } else {
                    fullText = r.summary || r.content || '';
                }

                return {
                    docIndex: i + 1,
                    title: r.title,
                    category: r.category || r.type || 'Auditoría',
                    tags: r.tags || [],
                    contentDetails: fullText,
                    competitorsList: r.data?.competitors || []
                };
            });

            const prompt = `Eres el Director Supremo de Inteligencia y Estrategia de Crecimiento de DIIC ZONE (DIIC AI Brain).
Tu objetivo es consolidar y sintetizar de forma exhaustiva, profesional y con total rigor los siguientes ${preparedResearches.length} documentos/investigaciones para generar el Perfil Estratégico 360° unificado de la marca "${safeBrandName}".

DOCUMENTOS E INVESTIGACIONES COMPLETAS DISPONIBLES:
${JSON.stringify(preparedResearches, null, 2)}

REGLAS DE ORO DE PRECISIÓN Y REALIDAD:
1. Extrae y consolida TODA la información real contenida en los documentos anteriores (público objetivo real, productos y platos o servicios reales, propuesta de valor real, dolores del cliente y puntos de fricción reales, competidores reales, canales sociales auditados).
2. ADAPTA el perfil 100% al nicho de mercado y sector comercial real identificado en los documentos (por ejemplo: si es un restaurante, pizzería, consultoría, e-commerce, gimnasio o clínica, TODA la información debe pertenecer exclusivamente a esa realidad).
3. PROHIBICIÓN TOTAL DE DATOS FICTICIOS: No inventes especialidades médicas, dolores físicos ni tratamientos de salud si el negocio no es del sector médico.
4. Si en los documentos aparece el nombre comercial real del negocio (ejemplo: "Vito's Pizza of Mechanicsburg"), colócalo en "brandName".
5. Si los documentos mencionan fundadores, directores o liderazgo, inclúyelos en "leadership" (o déjalo vacío si no se especifica, sin inventar nombres).
6. Si en los documentos se encontraron competidores, inclúyelos en la lista "competitors" con su nombre y análisis.

Devuelve OBLIGATORIAMENTE un JSON con esta estructura exacta:
{
  "brandName": "Nombre real y exacto del negocio o marca",
  "leadership": "Fundadores, directores o líderes reales hallados (o vacío si no se halló)",
  "whatItDoes": "Descripción detallada y ejecutiva de la actividad principal, especialidad y nicho del negocio",
  "whatItOffers": "Catálogo completo y sintetizado de productos, servicios, menú o soluciones reales",
  "targetAudience": "Perfil demográfico y psicográfico detallado del cliente o consumidor ideal",
  "problemSolved": "Matriz profunda de problemas reales, dolores, necesidades, objeciones y fricciones que resuelve",
  "valueProp": "Propuesta Única de Valor (UVP) y factor diferencial clave frente a la competencia",
  "tone": "Tono de comunicación, arquetipo y personalidad de marca real",
  "mainGoal": "Objetivo comercial y estratégico de crecimiento detectado",
  "marketContext": "Ubicación geográfica, entorno competitivo y contexto de mercado",
  "socialAudit": "Diagnóstico y auditoría de la presencia en redes sociales (Instagram, Facebook, TikTok, etc.) y oportunidades de mejora",
  "competitors": [
    {
      "name": "Nombre de competidor 1",
      "url": "URL o ubicación",
      "strengthsWeaknesses": "Fortalezas y debilidades frente a nuestra marca"
    }
  ],
  "contentPillars": [
    "Pilar 1 adaptado a su negocio real",
    "Pilar 2 adaptado a su negocio real",
    "Pilar 3 adaptado a su negocio real",
    "Pilar 4 adaptado a su negocio real"
  ],
  "frictionPoints": [
    "Punto de fricción o dolor real 1",
    "Punto de fricción o dolor real 2"
  ],
  "winningHooks": [
    "Gancho de alta conversión 1",
    "Gancho de alta conversión 2"
  ],
  "dynamicButtons": [
    "Búsqueda o pregunta estratégica sugerida 1",
    "Búsqueda o pregunta estratégica sugerida 2",
    "Búsqueda o pregunta estratégica sugerida 3"
  ],
  "executiveSummary": "Resumen ejecutivo de 2 a 3 párrafos sobre la estrategia global, ventajas competitivas y plan de crecimiento"
}`;

            const responseRaw = await generateWithFallback(prompt, true);
            let consolidatedProfile = {};
            try {
                consolidatedProfile = JSON.parse(responseRaw || '{}');
            } catch (pErr) {
                console.error('[AI Strategy Brain] JSON parse error:', pErr, responseRaw);
                const jsonMatch = responseRaw.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    consolidatedProfile = JSON.parse(jsonMatch[0]);
                }
            }

            return NextResponse.json({
                success: true,
                consolidatedProfile
            });
        }

        // ACTION 3: COPILOT SEARCH & ENRICHMENT (Profile Copilot Bar)
        if (action === 'copilot_search') {
            if (!message) {
                return NextResponse.json({ success: false, error: 'Pregunta o consulta requerida' }, { status: 400 });
            }

            const relevantResearches = researches || [];
            const researchesContext = relevantResearches.map((r, idx) => `
--- INVESTIGACIÓN #${idx + 1}: ${r.title || 'Dossier'} ---
Categoría: ${r.category || 'General'}
Contenido: ${typeof r.data === 'string' ? r.data : JSON.stringify(r.data || r.summary || '').substring(0, 1200)}
`).join('\n');

            const prompt = `Eres el Copiloto de Inteligencia Estratégica y Consultor de Crecimiento de DIIC ZONE para la marca "${safeBrandName}".
El usuario está visualizando el "Perfil Estratégico 360°" de su negocio y necesita responder una duda, investigar datos faltantes, evaluar el mercado o enriquecer campos estratégicos.

CONTEXTO ACTUAL DEL PERFIL DE LA MARCA:
- Nombre de Marca: ${safeBrandName}
- Liderazgo / Fundador: ${profile.leadership || 'No especificado'}
- Qué Hace (Actividad / Nicho): ${profile.whatItDoes || 'No especificado'}
- Qué Ofrece (Servicios / Menú / Productos): ${profile.whatItOffers || 'No especificado'}
- Público Objetivo / Avatar: ${profile.targetAudience || 'No especificado'}
- Problemas / Dolores que Resuelve: ${profile.problemSolved || 'No especificado'}
- Propuesta de Valor (UVP): ${profile.valueProp || 'No especificado'}
- Tono de Comunicación: ${profile.tone || 'No especificado'}
- Objetivo Comercial: ${profile.mainGoal || 'No especificado'}
- Contexto de Mercado / Geografía: ${profile.marketContext || 'No especificado'}
- Auditoría Redes: ${profile.socialAudit || 'No especificado'}
- Competidores Registrados: ${JSON.stringify(profile.competitors || [])}

INVESTIGACIONES GUARDADAS DISPONIBLES EN EL DOSSIER (${relevantResearches.length} documentos):
${researchesContext || 'No hay investigaciones previas guardadas. Usa el contexto del perfil y el conocimiento general del nicho del cliente.'}

CONSULTA O PREGUNTA DEL ESTRATEGA / USUARIO:
"${message}"

INSTRUCCIONES CRÍTICAS:
1. Responde de forma analítica, estructurada y persuasiva usando Markdown elegante (listas, negritas, bullets, citas >).
2. Si la consulta pide completar, deducir o mejorar campos del perfil (por ejemplo: propuesta de valor, dolores/problemas resueltos, competidores, público objetivo, liderazgo, oferta, tono), genera datos pertinentes y realistas adaptados 100% al nicho de "${safeBrandName}".
3. En "suggestedUpdates", devuelve un objeto con los campos del perfil sugeridos para actualizar (claves válidas: brandName, leadership, whatItDoes, whatItOffers, targetAudience, problemSolved, valueProp, tone, mainGoal, marketContext, socialAudit, competitors). Si no aplica actualizar ningún campo, devuelve null.
4. En "summary", devuelve un titular/resumen de 1 línea para guardar en el repositorio de investigaciones.

Devuelve OBLIGATORIAMENTE un JSON con esta estructura exacta:
{
  "reply": "Respuesta completa y profunda en formato Markdown...",
  "suggestedUpdates": {
    "problemSolved": "Texto enriquecido o nuevo..."
  },
  "summary": "Resumen conciso del hallazgo..."
}`;

            const responseRaw = await generateWithFallback(prompt, true);
            let parsed = {};
            try {
                parsed = JSON.parse(responseRaw || '{}');
            } catch (pErr) {
                const jsonMatch = responseRaw.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                } else {
                    parsed = { reply: responseRaw, suggestedUpdates: null, summary: message };
                }
            }

            return NextResponse.json({
                success: true,
                reply: parsed.reply || responseRaw,
                suggestedUpdates: parsed.suggestedUpdates || null,
                summary: parsed.summary || message
            });
        }

        return NextResponse.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });

    } catch (err) {
        console.error('[API /api/ai/strategy/brain] Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message || 'Error interno del servidor'
        }, { status: 500 });
    }
}
