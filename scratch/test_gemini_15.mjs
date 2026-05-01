import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testGrounding() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        console.log("Testing with gemini-1.5-flash and googleSearch tool...");
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            tools: [{ 
                googleSearch: {}
            }]
        });

        const prompt = "Investiga quién es la Dra. Jess Rey Uro en Instagram.";
        const result = await model.generateContent(prompt);
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("ERROR:", error);
    }
}

testGrounding();
