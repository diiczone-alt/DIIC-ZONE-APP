
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testStrategy() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const url = "https://serviciosagropecuariosecuador.com/";
    const brandName = "Servicios Agropecuarios Ecuador";

    console.log(`[Test] Starting Grounded Search for: ${brandName || url}`);

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest", 
            tools: [{ 
                googleSearchRetrieval: {
                    dynamicRetrievalConfig: {
                        mode: "MODE_DYNAMIC",
                        dynamicThreshold: 0.3,
                    },
                } 
            }] 
        });

        const prompt = `INVESTIGACIÓN OMNI-NIVEL SOBRE: "${brandName || 'Sugerido por URL'}" (${url}).
        
        SÉ 100% HONESTO. BUSCA EN GOOGLE Y REDES SOCIALES (LinkedIn, Facebook, IG).
        Si no encuentras al dueño o CEO real, di "Investigando directorio...".
        Si el sitio web es de salud (ej: Nova Urology), busca el nombre del especialista.
        
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

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Response Text:", responseText);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            let data = JSON.parse(jsonMatch[0]);
            console.log("Parsed Data:", data);
        } else {
            console.log("No JSON found in response.");
        }

    } catch (error) {
        console.error("Error during test:", error);
    }
}

testStrategy();
