import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    // 0. Base Fallback Metadata
    const steps = [
        { msg: 'Iniciando escaneo de huella digital...', icon: 'Target', source: 'google' },
        { msg: 'Infiltrando perfiles en Meta (FB/IG)...', icon: 'Search', source: 'meta' },
        { msg: 'Localizando fundadores en LinkedIn...', icon: 'Users', source: 'linkedin' },
        { msg: 'Analizando ecosistema de tráfico...', icon: 'Zap', source: 'traffic' },
        { msg: 'Compilando reporte de inteligencia...', icon: 'Database', source: 'ai' }
    ];

    let url = '';
    let brandName = '';
    
    try {
        const body = await req.json();
        url = body.url || '';
        brandName = body.brandName || '';
    } catch (e) {
        console.error("Invalid req body:", e.message);
    }

    const fallbackData = {
        brandName: (brandName || "Marca Investigada"),
        leadership: "Analizando perfiles clave en LinkedIn y Meta...",
        whatItDoes: `Agente especializado en el sector detectado en ${url}`,
        whatItOffers: "Investigación táctica de servicios y productos en curso.",
        targetAudience: "Segmento afín a la presencia digital encontrada.",
        problemSolved: "Mejora sistemática de posicionamiento y reputación.",
        valueProp: "Autoridad y especialización en el sector profesional.",
        tone: "Profesional y Directo (Auditando ecosistema digital...)",
        mainGoal: "Maximización de conversión y autoridad de marca",
        marketContext: "Contexto: Auditoría profunda de footprint digital.",
        _isFallback: true
    };

    if (!url) return NextResponse.json({ data: fallbackData, steps });

    try {
        const prompt = `Eres un ANALISTA ESTRATÉGICO SENIOR y TRAFFICKER. 
        Analiza profundamente la marca en ${url} y su presencia en redes sociales (FB, IG, LinkedIn, TikTok).
        Busca: Fundadores/CEO, core de negocio, servicios principales, audiencia ideal, dolores que resuelven y su ventaja competitiva.
        
        Responde ÚNICAMENTE en JSON:
        {
            "brandName": "Nombre limpio",
            "leadership": "CEO / Fundadores detectados",
            "whatItDoes": "Qué hace la empresa",
            "whatItOffers": "Qué vende",
            "targetAudience": "Público objetivo",
            "problemSolved": "Problema resuelto",
            "valueProp": "Propuesta de Valor",
            "tone": "Tono comunicativo",
            "mainGoal": "Meta de negocio",
            "marketContext": "Contexto de mercado y RRSS"
        }`;

        let aiResponse = "";
        try {
            // Intentar con motor 2.0
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash", 
                tools: [{ google_search: {} }] 
            });
            const aiResult = await model.generateContent(prompt);
            aiResponse = aiResult.response.text();
        } catch (primeError) {
            console.warn("Primary AI failed, trying backup engine:", primeError.message);
            const modelBackup = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash", 
                tools: [{ google_search: {} }] 
            });
            const aiResultBackup = await modelBackup.generateContent(prompt);
            aiResponse = aiResultBackup.response.text();
        }

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const strategyData = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ data: strategyData, steps });
        }

        throw new Error("No JSON found in response");

    } catch (error) {
        console.error("Strategy Engine - Safe Fallback Activated:", error.message);
        return NextResponse.json({ data: fallbackData, steps });
    }
}
