import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
    try {
        const { context } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "AI Key missing" }, { status: 500 });
        }

        const strategic = context?.onboarding_data?.strategic || {};
        const brandName = strategic.brandName || context?.name || 'la empresa';
        const industry = strategic.industry || context?.industry || 'General';
        const whatItDoes = strategic.whatItDoes || '';
        const whatItOffers = strategic.whatItOffers || '';
        const problemSolved = strategic.problemSolved || '';
        const valueProp = strategic.valueProp || '';

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: `
                Eres un consultor experto de marketing digital de DIIC ZONE.
                Tu tarea es generar exactamente 3 preguntas simuladas frecuentes que un prospecto real le enviaría por chat (ej. WhatsApp o Instagram Direct) a este negocio en específico.
                
                CONTEXTO DE LA MARCA:
                - Nombre de la Marca: ${brandName}
                - Industria/Nicho: ${industry}
                - ¿Qué hace?: ${whatItDoes}
                - ¿Qué ofrece?: ${whatItOffers}
                - Propuesta de Valor (USP): ${valueProp}
                - Dolor que resuelve: ${problemSolved}

                REGLAS DE RESPUESTA:
                1. Genera exactamente 3 preguntas.
                2. Cada pregunta debe caber en una sola línea y tener menos de 65 caracteres.
                3. Deben sonar muy naturales, cortas y directas, como un cliente real escribiendo de forma rápida.
                4. Solo devuelve las preguntas separadas por saltos de línea. Sin números, sin viñetas, sin introducciones.
            `
        });

        const prompt = "Genera 3 preguntas de cliente cortas para esta marca en base a su perfil estratégico.";
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const questions = responseText
            .split('\n')
            .map(q => q.trim().replace(/^[-*•\d.]\s*/, '')) // Clean up potential bullet points or numbers
            .filter(q => q.length > 0)
            .slice(0, 3);

        return NextResponse.json({ questions });

    } catch (error) {
        console.error("Generate Questions API Error:", error);
        return NextResponse.json({ error: "Error generating questions" }, { status: 500 });
    }
}
