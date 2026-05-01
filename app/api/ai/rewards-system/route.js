import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { clientContext } = await req.json();
        
        if (!clientContext) {
            return NextResponse.json({ error: 'Contexto de cliente requerido' }, { status: 400 });
        }

        console.log(`[NeuralRewards] Generando misiones dinámicas para: ${clientContext.name || clientContext.brandName || 'Cliente sin nombre'}`);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `ERES EL DIRECTOR DE GAMIFICACIÓN Y GROWTH DE UNA AGENCIA DE ALTO NIVEL PARA EL CLIENTE:
        
        Nombre/Marca: ${clientContext.name || clientContext.brandName || 'No definido'}
        Qué Hace: ${clientContext.whatItDoes || 'No definido'}
        Qué Ofrece (Productos/Servicios): ${clientContext.whatItOffers || 'No definido'}
        Público Objetivo: ${clientContext.targetAudience || 'No definido'}
        Nivel Actual: ${clientContext.maturity_level || 'Inicial (Presencia Digital)'}
        
        Misión: Generar el "Sistema de Recompensas" COMPLETAMENTE personalizado para este cliente específico basado en su nicho y estrategia.
        Usa una terminología que conecte con su rubro. Si es médico, usa pacientes, citas, tratamientos. Si es una academia de deportes, usa alumnos, partidos, entrenamientos. Si es B2B, usa contratos, leads corporativos.

        DEVUELVE UN OBJETO JSON EXACTAMENTE CON ESTA ESTRUCTURA (SIN TEXTO EXTRA):
        {
          "activeMission": {
            "title": "Misión Activa",
            "quantity": "1 contenido", // Ajusta el texto al nicho, ej: "1 video explicativo de cirugía", "1 reel de entrenamiento",
            "reward": "Diseño Adicional Gratis" // Premio que le da la agencia
          },
          "resultRewards": [ // Exactamente 3 elementos
            {
              "goal": "50 Consultas Nuevas", // Reemplazar "50 Leads" por algo de su nicho
              "reward": "Diseño Gratis",
              "progress": 45 // Número del 0 al 100 aleatorio creíble
            },
            {
              "goal": "100 Evaluaciones", // Reemplazar
              "reward": "Video Extra",
              "progress": 22
            },
            {
              "goal": "ROI > 300% en Ads", // O algo similar como "Vender 3 Tickets High-End"
              "reward": "Optimización Ads",
              "progress": 0
            }
          ],
          "levelBenefits": [ // Sincronizado con Madurez del Negocio (Niveles 1 al 5)
            { "level": "1", "name": "Presencia Digital", "benefit": "Identidad visual y setup de ecosistema", "requirement": "Completar Onboarding Inicial", "status": "unlocked" },
            { "level": "2", "name": "Estrategia", "benefit": "Diseño adicional gratis adaptado a tu nicho", "requirement": "1 Mes de pauta y contenido activo", "status": "unlocked" },
            { "level": "3", "name": "Marca", "benefit": "Video extra corto mensual (Reel Expert)", "requirement": "Consolidación de Autoridad (3 Meses)", "status": "locked" },
            { "level": "4", "name": "Automatización", "benefit": "Optimización de campaña IA profunda", "requirement": "Sistema de Leads Automatizado", "status": "locked" },
            { "level": "5", "name": "Escala", "benefit": "Asesoría estratégica 1 a 1 de nivel Master", "requirement": "Dominio de Nicho y ROI Exponencial", "status": "locked" }
          ],
          "constancyRewards": [ // Exactamente 3 elementos (3 meses, 6 meses, 1 año)
            { "time": "3 Meses", "reward": "Post Adicional en tu red principal", "status": "achieved" },
            { "time": "6 Meses", "reward": "Sesión Creativa Extra para tu rubro", "status": "upcoming", "daysLeft": "45" },
            { "time": "1 Año", "reward": "Campaña Estratégica Completa", "status": "locked" }
          ],
          "referralRewards": [ // 2 beneficios concretos
            "Descuento en tu próxima factura",
            "Pack de Contenido Extra para tu industria"
          ]
        }`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const data = JSON.parse(text);
        
        return NextResponse.json({ rewards: data });

    } catch (error) {
        console.error("REWARDS AI ERROR:", error);
        return NextResponse.json({ 
            error: "Falla en el motor de recompensas",
            details: error.message 
        }, { status: 500 });
    }
}
