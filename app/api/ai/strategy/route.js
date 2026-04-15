import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * AI Strategic Research Agent
 * Performs a deep scan of a URL and returns marketing/business strategy.
 */
export async function POST(req) {
    try {
        const { url, brandName } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ 
                error: "GEMINI_API_KEY no configurada. Por favor, añade tu llave al archivo .env.local" 
            }, { status: 500 });
        }

        // 1. Basic Scraping (Server-Side)
        let pageSource = "";
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            pageSource = await response.text();
            
            // Clean up using more standard regex flags
            pageSource = pageSource.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
            pageSource = pageSource.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, '');
            pageSource = pageSource.substring(0, 15000); 
        } catch (e) {
            console.error("Scraping error:", e);
            pageSource = "Error extrayendo contenido.";
        }

        // 2. Modeling the AI Request
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Actúa como el CEO y Estratega de Nicho de DIIC ZONE. 
            Tu misión es realizar una "Investigación Profunda" de la siguiente marca:
            Marca: ${brandName || 'Sincronizar desde Web'}
            URL: ${url}
            
            Contenido de referencia (Scraped):
            ${pageSource}

            BASADO EN LA INFORMACIÓN REAL, genera una estrategia en JSON con:
            {
              "brandName": "...",
              "whatItDoes": "...",
              "whatItOffers": "...",
              "targetAudience": "...",
              "problemSolved": "...",
              "valueProp": "...",
              "tone": "...",
              "mainGoal": "..."
            }
            IMPORTANTE: Responde solo JSON puro.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const strategyData = JSON.parse(cleanJson);

        return NextResponse.json(strategyData);

    } catch (error) {
        console.error("AI Bridge Error:", error);
        return NextResponse.json({ 
            error: "Error procesando la investigación estratégica." 
        }, { status: 500 });
    }
}
