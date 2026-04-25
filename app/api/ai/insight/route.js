import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { url, brandName, mode, query, field, currentText, file } = await req.json();
        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

        // 1. Context Building
        const contextPrompt = `
            Actúa como un CONSULTOR ESTRATÉGICO SENIOR de la agencia DIIC ZONE.
            Marca: ${brandName || 'Sujeto en análisis'}
            Sitio Web: ${url}
            Modo: ${mode}
            ${field ? `Campo a optimizar: ${field}` : ''}
            ${currentText ? `Contenido actual: ${currentText}` : ''}
        `;

        const modePrompts = {
            competitors: "Investiga profundamente los COMPETIDORES de esta marca usando Google Search. Devuelve un JSON con un array 'competitors' que contenga {name, url, location, reviews, social, strengthsWeaknesses}.",
            friction: "Analiza el sitio web ${url} buscando PUNTOS DE FRICCIÓN (UX/UI/CRO) que impidan la conversión. Sé muy crítico y profesional.",
            traffic: "Audita las posibles RUTA DE TRÁFICO y estrategias de pauta para esta marca en su sector.",
            refine: "Optimiza este texto para que sea más persuasivo y profesional sin perder el core del negocio.",
            chat: `Responde a esta duda del cliente sobre su estrategia: ${query}. Usa el contexto del sitio ${url} y los datos recolectados.`
        };

        const systemPrompt = `
            ${contextPrompt}
            INSTRUCCIÓN ESPECÍFICA: ${modePrompts[mode] || modePrompts.chat}
            
            IMPORTANTE: Si no encuentras datos reales, usa tu conocimiento de industria para dar una proyección estratégica profesional. No digas "no puedo".
            RESPUESTA SIEMPRE EN FORMATO MARKDOWN PROFESIONAL.
        `;

        const contentArray = [systemPrompt];
        if (file && file.data) {
            contentArray.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.data
                }
            });
        }

        // 3. Generative Logic with Failover
        try {
            let model = genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash", 
                tools: [{ google_search: {} }] 
            });

            let aiResult;
            try {
                aiResult = await model.generateContent(contentArray);
            } catch (quotaError) {
                console.warn("Insight API 429 Failover...");
                model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", tools: [{ google_search: {} }] });
                aiResult = await model.generateContent(contentArray);
            }

            const responseText = aiResult.response.text();
            
            // If it's competitors mode, try to extract JSON
            if (mode === 'competitors') {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return NextResponse.json({ competitors: parsed.competitors || [] });
                }
            }

            return NextResponse.json({ insight: responseText });

        } catch (aiError) {
            console.error("AI Insight Core Error:", aiError.message);
            return NextResponse.json({ 
                insight: "Análisis estratégico proyectado: Basado en el sector de la marca, se recomiendan optimizaciones inmediatas en la arquitectura de conversión y diversificación de canales de tráfico en Meta y Google Ads.", 
                isFallback: true 
            });
        }

    } catch (error) {
        console.error("Critical Insight API Fail:", error);
        return NextResponse.json({ 
            insight: "Interrupción temporal en la red de inteligencia. Intenta refrescar o continuar con la auditoría manual.",
            isFallback: true
        });
    }
}
