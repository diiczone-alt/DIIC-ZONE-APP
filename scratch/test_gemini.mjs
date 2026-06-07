import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log("Testing Gemini with Google Search tool...");
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            tools: [{ 
                googleSearch: {}
            }]
        });

        const prompt = `OBJETIVO: Investigar y analizar en profundidad la red social provista.
        Facebook: https://www.facebook.com/diiczone
        
        Realiza una búsqueda en Google para encontrar este perfil y dame un resumen real de su última actividad, número de seguidores o lo que encuentres.
        Responde en formato JSON:
        {
            "socialAudit": "Auditoría real"
        }`;

        const result = await model.generateContent(prompt);
        console.log("Response Text:");
        console.log(result.response.text());
        console.log("Grounding Metadata:");
        console.log(JSON.stringify(result.response.candidates?.[0]?.groundingMetadata, null, 2));
    } catch (err) {
        console.error("Error calling Gemini:", err);
    }
}

test();
