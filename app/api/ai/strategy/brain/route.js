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
            clientName = 'Dr. Oscar Cujilema', 
            profile = {}, 
            researches = [], 
            selectedFolderId = null 
        } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ success: false, error: 'GEMINI_API_KEY no configurada' }, { status: 500 });
        }

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
PERFIL ESTRATÉGICO CONSOLIDADO:
- Marca: ${profile.brandName || clientName}
- Propuesta de Valor (UVP): ${profile.valueProp || profile.uniqueValueProposition || 'Líder en Traumatología y Cirugía Artroscópica'}
- Avatar / Cliente Ideal: ${profile.targetAudience || profile.idealClient || 'Pacientes con dolor articular, deportistas y adultos mayores'}
- Problemas / Dolores que Resuelve: ${profile.problemSolved || profile.painsSolved || 'Dolor de rodilla, lesiones de hombro y artrosis'}
- Qué Ofrece: ${profile.whatItOffers || 'Cirugía artroscópica, valoraciones e infiltraciones guiadas'}
- Tono de Comunicación: ${profile.tone || 'Médico experto, empático, autoritario pero accesible'}
`;

            const systemInstruction = `Eres el Director de Estrategia de Crecimiento y Marketing Médico de DIIC ZONE (DIIC AI Brain) para la marca "${clientName}".
Tu función es actuar como el cerebro estratégico supremo que conoce a fondo todas las investigaciones, carpetas, competidores, puntos de fricción y perfiles guardados del cliente.

CONOCIMIENTO ACTUAL DE LA MARCA:
${profileContext}

INVESTIGACIONES Y DOSSIERS GUARDADOS (${relevantResearches.length} documentos):
${researchesContext || 'No hay investigaciones guardadas adicionales aún. Utiliza el conocimiento base del perfil estratégico.'}

INSTRUCCIONES DE RESPUESTA:
1. Responde de manera profesional, estructurada, ejecutiva y directa al grano, utilizando formato Markdown elegante (negritas, listas, citas > para alertas estratégicas).
2. Basa tus recomendaciones SIEMPRE en los hallazgos reales de las investigaciones guardadas (dolores de pacientes, ganchos de alta retención, mitos clínicos, ventajas competitivas).
3. Si te piden ideas de contenido, guiones o copys de pauta, provee ganchos (0-3s), cuerpo y llamados a la acción precisos para WhatsApp médico.
4. Si no hay suficiente información sobre un tema específico en las investigaciones, sugiérele al estratega qué tipo de búsqueda adicional debería realizar en Capa 1.`;

            const chatHistoryFormatted = history.map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text || h.content || '' }]
            }));

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const chat = model.startChat({
                history: [
                    { role: 'user', parts: [{ text: systemInstruction }] },
                    { role: 'model', parts: [{ text: `Entendido. Soy el Asistente Estratégico de DIIC ZONE para ${clientName}. Tengo acceso a todas las investigaciones, carpetas y perfil estratégico de la marca. ¿En qué puedo ayudarte hoy?` }] },
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

        // ACTION 2: CONSOLIDATE RESEARCHES INTO STRATEGIC PROFILE
        if (action === 'consolidate_profile') {
            const researchesToConsolidate = researches.length > 0 ? researches : [];
            if (researchesToConsolidate.length === 0) {
                return NextResponse.json({ success: false, error: 'No se seleccionaron investigaciones para consolidar' }, { status: 400 });
            }

            const prompt = `Eres el Director de Estrategia Médica de DIIC ZONE.
Tu tarea es consolidar y sintetizar los siguientes ${researchesToConsolidate.length} documentos/investigaciones en un Perfil Estratégico 360° unificado para la marca "${clientName}".

INVESTIGACIONES:
${JSON.stringify(researchesToConsolidate.map(r => ({
    title: r.title,
    category: r.category || r.type,
    content: r.data || r.summary || r.content
})))}

Genera un JSON con esta estructura exacta:
{
  "brandName": "${clientName}",
  "whatItDoes": "Descripción ejecutiva de la especialidad y actividad principal",
  "whatItOffers": "Catálogo sintetizado de servicios principales y soluciones médicas",
  "targetAudience": "Perfil demográfico y psicográfico del paciente/cliente ideal",
  "problemSolved": "Matriz de dolores, miedos y puntos de fricción principales que resuelve",
  "valueProp": "Propuesta Única de Valor (UVP) diferencial frente a la competencia",
  "tone": "Tono de comunicación y arquetipo de marca",
  "mainGoal": "Objetivo principal de posicionamiento y captación de pacientes",
  "contentPillars": [
    "Pilar 1: Dolor articular y síntomas de alarma",
    "Pilar 2: Mitos médicos y educación",
    "Pilar 3: Casos de éxito y recuperación",
    "Pilar 4: Procedimientos y valoraciones"
  ],
  "frictionPoints": [
    "Miedo al dolor de la cirugía",
    "Costo o incertidumbre del tratamiento",
    "Falso mito de reposo absoluto"
  ],
  "winningHooks": [
    "¿Te duele la rodilla y no sabes por qué? 3 señales de alarma",
    "¿Mito o verdad? Lo que nadie te dice sobre los esguinces"
  ],
  "executiveSummary": "Resumen ejecutivo de 3 párrafos sobre la estrategia global de la marca"
}`;

            const jsonModel = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const result = await jsonModel.generateContent(prompt);
            const consolidatedProfile = JSON.parse(result.response.text() || '{}');

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
