import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
    try {
        const { lead, context, lastMessage } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "AI Key missing" }, { status: 500 });
        }

        const strategic = context.onboarding_data?.strategic || {};
        const brandName = strategic.brandName || context.name;
        const industry = strategic.industry || context.industry || 'General';
        const whatItDoes = strategic.whatItDoes || '';
        const whatItOffers = strategic.whatItOffers || '';
        const problemSolved = strategic.problemSolved || '';
        const valueProp = strategic.valueProp || '';
        const tone = strategic.tone || 'Profesional, cercano y sofisticado';

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: `
                Eres un experto en Ventas y atención al cliente de DIIC ZONE.
                Tu objetivo es generar una respuesta persuasiva, profesional y empática para un paciente o lead.
                
                CONTEXTO ESTRATÉGICO DE LA MARCA (DATOS REALES):
                - Nombre de la Marca: ${brandName}
                - Industria/Nicho: ${industry}
                - ¿Qué hace?: ${whatItDoes}
                - ¿Qué ofrece?: ${whatItOffers}
                - Dolor que resuelve: ${problemSolved}
                - Propuesta de Valor (USP): ${valueProp}
                - Tono de Comunicación: ${tone}
                
                DATOS DEL RECEPTOR:
                - Nombre: ${lead.full_name}
                - Interés registrado: ${lead.industry || 'Consulta o asesoría'}
                - Origen: ${lead.source || 'Social Media'}
                
                MENSAJE RECIBIDO (Si hay uno):
                "${lastMessage || ''}"

                INSTRUCCIONES DE RESPUESTA:
                1. DIÁLOGO PROGRESIVO ("IR POCO A POCO"): No intentes vender todo ni abrumar al cliente con textos largos de golpe. Responde de forma directa, corta (máximo 2 párrafos breves, idealmente de 2 a 3 oraciones por respuesta) y sumamente natural.
                2. VENTA CONSULTIVA Y EMPATÍA: Escucha activamente la duda del cliente. Brinda ayuda y calidez primero. Haz preguntas de calificación sencillas para avanzar el proceso de compra paso a paso (ej. "¿Para qué fecha te gustaría agendar?" o "¿Qué tipo de evento estás planeando?").
                3. REDIRECCIÓN NATURAL A LA CONVERSIÓN: Cada mensaje debe terminar con una pregunta abierta o un micro-compromiso que guíe al prospecto hacia la conversión (agendar una cita, cotizar un producto, etc.) de manera fluida y sin presión.
                4. USO RIGUROSO DE DATOS REALES: Responde basándote únicamente en lo que la empresa ofrece (${whatItOffers}) y hace (${whatItDoes}). Si te preguntan por un servicio, precio o detalle que no conoces, indica cordialmente que lo consultarás o haz una pregunta aclaratoria en lugar de simular datos falsos.
                5. TONO DE MARCA: Adapta la comunicación exactamente al tono definido: ${tone}.
                6. Solo devuelve el texto de la respuesta final que se enviará al cliente, sin introducciones ni comentarios extras.
            `
        });

        const prompt = lastMessage 
            ? `Responde al siguiente mensaje del paciente: "${lastMessage}"`
            : "Genera un mensaje de bienvenida y seguimiento inicial para este paciente.";

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });

    } catch (error) {
        console.error("Suggestion API Error:", error);
        return NextResponse.json({ error: "Error generating suggestion" }, { status: 500 });
    }
}
