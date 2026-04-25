// FORCE REFRESH - TIMESTAMP: 2026-04-17T18:44:00
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * AI Strategic Agent - DIIC ZONE
 * Final fix for build error.
 */
export async function POST(req) {
    try {
        const { messages, clientContext } = await req.json();
        
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "AI Key missing" }, { status: 500 });
        }

        // 1. Context
        let extendedContext = "";
        if (clientContext?.id) {
            try {
                const { data: client } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', clientContext.id)
                    .single();

                const { data: tasks } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('client', clientContext.name)
                    .order('created_at', { ascending: false })
                    .limit(10);

                extendedContext = `
                    CONTEXTO DEL CLIENTE ACTUAL:
                    - Nombre: ${client?.name || clientContext.name}
                    - Industria: ${client?.industry || 'Marketing'}
                    
                    TAREAS:
                    ${tasks?.map(t => `- [${t.status}] ${t.title}`).join('\n') || 'Sin tareas.'}
                `;
            } catch (e) {
                extendedContext = "Contexto no disponible.";
            }
        }

        // 2. IA
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: `Eres el Estratega Maestro de DIIC ZONE. Usa este contexto: ${extendedContext}`
        });

        const chat = model.startChat({
            history: messages.slice(0, -1).map(m => ({
                role: m.sender === 'me' ? 'user' : 'model',
                parts: [{ text: m.text }],
            })),
        });

        const result = await chat.sendMessage(messages[messages.length - 1].text);
        return NextResponse.json({ text: result.response.text() });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ text: "Error en el Agente." }, { status: 500 });
    }
}
