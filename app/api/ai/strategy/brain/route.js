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

            const prompt = `Eres el Director Supremo de Inteligencia y Estrategia de Crecimiento de DIIC ZONE (DIIC AI Brain).
Tu objetivo es consolidar y sintetizar con total precisión, fidelidad y rigor los siguientes ${researchesToConsolidate.length} documentos/investigaciones para generar el Perfil Estratégico 360° unificado de la marca "${safeBrandName}".

DOCUMENTOS E INVESTIGACIONES DISPONIBLES:
${JSON.stringify(researchesToConsolidate.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category || r.type,
    tags: r.tags || [],
    content: r.data || r.summary || r.content
})), null, 2)}

INSTRUCCIONES CRÍTICAS DE PRECISIÓN Y REALIDAD:
1. Extrae y compila ÚNICAMENTE datos 100% REALES basados en el contenido de las investigaciones provistas.
2. ADAPTA TODO al nicho y sector comercial REAL que aparece en los documentos (por ejemplo: si las investigaciones son sobre un restaurante, pizzería, comercio, agencia, software o empresa de servicios, TODO el análisis debe pertenecer exclusivamente a esa industria).
3. PROHIBICIÓN ABSOLUTA: NO inventes servicios médicos, traumatología ni dolores articulares salvo que los documentos sean explícitamente sobre una clínica médica.
4. Si las investigaciones contienen el nombre comercial del negocio (ejemplo: "Vito's Pizza of Mechanicsburg"), utilízalo en "brandName" si es más específico que el nombre genérico.
5. Identifica el liderazgo real si aparece en las investigaciones (o déjalo vacío si no se menciona, sin inventar nombres falsos).
6. Extrae los dolores, puntos de fricción, público objetivo, propuesta de valor y ganchos reales detectados en los estudios.

Devuelve OBLIGATORIAMENTE un JSON con esta estructura exacta:
{
  "brandName": "Nombre real y exacto de la marca analizada",
  "leadership": "Liderazgo, fundadores o directores reales identificados (o dejar vacío si no se halló)",
  "whatItDoes": "Descripción ejecutiva, clara y detallada de la actividad principal del negocio, nicho y especialidad",
  "whatItOffers": "Catálogo sintetizado de productos, servicios y soluciones reales que ofrece",
  "targetAudience": "Perfil demográfico y psicográfico detallado del cliente/consumidor ideal",
  "problemSolved": "Matriz de problemas reales, dolores, fricciones y necesidades que resuelve para sus clientes",
  "valueProp": "Propuesta Única de Valor (UVP) y diferencial competitivo real frente a la competencia",
  "tone": "Tono de comunicación y personalidad de la marca (ej. cercano, formal, familiar, disruptivo, etc.)",
  "mainGoal": "Objetivo comercial y estratégico principal",
  "marketContext": "Ubicación geográfica, entorno de mercado, competidores y contexto detectado",
  "socialAudit": "Resumen diagnóstico de la presencia en redes sociales y canales digitales",
  "contentPillars": [
    "Pilar 1 relevante para su industria real",
    "Pilar 2 relevante para su industria real",
    "Pilar 3 relevante para su industria real",
    "Pilar 4 relevante para su industria real"
  ],
  "frictionPoints": [
    "Punto de fricción o dolor real 1",
    "Punto de fricción o dolor real 2"
  ],
  "winningHooks": [
    "Gancho de alta retención 1 adaptado a su negocio",
    "Gancho de alta retención 2 adaptado a su negocio"
  ],
  "dynamicButtons": [
    "Pregunta de investigación estratégica relevante 1",
    "Pregunta de investigación estratégica relevante 2",
    "Pregunta de investigación estratégica relevante 3"
  ],
  "executiveSummary": "Resumen ejecutivo de 2 a 3 párrafos sobre la estrategia global y oportunidades de crecimiento"
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

        return NextResponse.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });

    } catch (err) {
        console.error('[API /api/ai/strategy/brain] Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message || 'Error interno del servidor'
        }, { status: 500 });
    }
}
