import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testStrategy() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            tools: [{ 
                googleSearch: {}
            }]
        });

        const url = "https://www.instagram.com/dra.jess.rey.uro/";
        const prompt = `OBJETIVO DE INVESTIGACIÓN: Ecosistema digital ubicado EXACTAMENTE en la URL: ${url}.
        
        SÉ 100% ESTRICTO Y HONESTO. BUSCA EN GOOGLE usando operadores como "site:instagram.com" o buscando el enlace exacto.
        REGLA DE ORO: NO confundas la marca con empresas homónimas (con el mismo nombre) en otros países o rubros. Asegúrate de que la información que extraes pertenece EXACTAMENTE al perfil o web en el enlace proporcionado.
        Si la página está vacía, no está indexada o el acceso a la red social está muy restringido, no inventes datos de otras empresas similares. Di "Información restringida o no indexada".
        Si el sitio web es de salud o medicina, busca el nombre del especialista y sus tratamientos.
        
        ESTRUCTURA JSON OBLIGATORIA:
        {
            "brandName": "...",
            "leadership": "...",
            "whatItDoes": "...",
            "whatItOffers": "...",
            "targetAudience": "...",
            "problemSolved": "...",
            "valueProp": "...",
            "tone": "...",
            "mainGoal": "...",
            "marketContext": "..."
        }`;

        console.log("Calling model...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Raw Response:", responseText);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            console.log("JSON Match found!");
            console.log(JSON.parse(jsonMatch[0]));
        } else {
            console.log("No JSON match found.");
        }
    } catch (error) {
        console.error("ERROR:", error);
    }
}

testStrategy();
