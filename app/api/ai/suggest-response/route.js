import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
    try {
        const { lead, context, lastMessage } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "AI Key missing" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: `
                Eres un experto en Ventas y atención al cliente de DIIC ZONE.
                Tu objetivo es generar una respuesta persuasiva, profesional y empática para un paciente/lead.
                
                CONTEXTO DE LA MARCA:
                - Nombre: ${context.name}
                - Industria/Especialidad: ${context.industry || 'Medicina Estética'}
                - Tono: Sofisticado, médico, cercano y profesional.
                
                DATOS DEL PACIENTE:
                - Nombre: ${lead.full_name}
                - Interés: ${lead.industry || 'Consulta general'}
                - Origen: ${lead.source || 'Social Media'}
                
                MENSAJE RECIBIDO (Si hay uno):
                "${lastMessage}"

                INSTRUCCIONES:
                1. Genera una respuesta corta (máximo 3 párrafos).
                2. Usa el nombre del paciente para personalizar.
                3. Menciona la especialidad de la marca: ${context.industry}.
                4. Incluye un llamado a la acción (CTA) para agendar una cita o pedir más info.
                5. El tono debe ser de autoridad pero sumamente amable.
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
