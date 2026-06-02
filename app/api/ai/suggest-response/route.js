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
                1. Genera una respuesta corta, coherente y altamente persuasiva (máximo 3 párrafos).
                2. Adapta la comunicación exactamente al tono definido por la marca (${tone}).
                3. Usa la propuesta de valor (${valueProp}) y los servicios reales (${whatItOffers}) para sonar sumamente profesional. NO inventes servicios que no estén explícitamente citados en la información de arriba.
                4. Usa el nombre de la persona para personalizar el trato.
                5. Agrega una llamada a la acción (CTA) natural enfocada en agendar o avanzar con su interés.
                6. Solo devuelve el texto de la respuesta, nada más.
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
