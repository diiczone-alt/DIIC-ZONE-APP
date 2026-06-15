import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
    try {
        const { lead, context, lastMessage } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "AI Key missing" }, { status: 500 });
        }

        const strategic = context.onboarding_data?.strategic || {};
        let brandName = strategic.brandName || 
                        context.onboarding_data?.company_profile?.company_name || 
                        context.onboarding_data?.brand?.brandName || 
                        context.name || 
                        'mi negocio';
        brandName = brandName.replace(/[-_]workspace/gi, '').trim();
        const brandNameLower = brandName.toLowerCase();
        if (brandNameLower === 'neyser') brandName = 'Espiga de oro';
        else if (brandNameLower === 'mauro') brandName = 'Servicios Agropecuarios Ecuador';
        else if (brandNameLower === 'fernando') brandName = 'ACEI';
        else if (brandNameLower === 'christian') brandName = 'NovaUrology';
        else if (brandNameLower === 'oscar cujilema' || brandNameLower === 'dr. oscar cujilema') brandName = 'Dr. Oscar Cujilema';
        const industry = strategic.industry || context.industry || 'General';
        
        const industryDefaults = {
            'estetica': {
                whatItDoes: 'Clínica de medicina estética y armonización facial avanzada.',
                whatItOffers: 'Tratamientos no invasivos como aplicación de toxina botulínica, ácido hialurónico, rinomodelación y rejuvenecimiento facial.',
                problemSolved: 'Ayuda a las personas a recuperar la confianza en su aspecto físico mediante resultados naturales y seguros.',
                valueProp: 'Resultados médicos sutiles y elegantes, de la mano de profesionales certificados que priorizan la salud y la armonía natural.',
                tone: 'Profesional, cálido, ético y sumamente sofisticado'
            },
            'urologia': {
                whatItDoes: 'Consultorio urológico especializado en salud masculina y tratamientos de mínima invasión.',
                whatItOffers: 'Consultas de especialidad, ecografía urológica, tratamiento de cálculos renales, próstata y disfunción eréctil.',
                problemSolved: 'Resuelve problemas urinarios y reproductivos devolviendo la calidad de vida y tranquilidad al paciente.',
                valueProp: 'Tratamiento confidencial, humano y de alta tecnología por especialistas de primer nivel.',
                tone: 'Profesional, empático, serio y tranquilizador'
            },
            'odontologia': {
                whatItDoes: 'Clínica odontológica de alta especialidad en rehabilitación oral y estética dental.',
                whatItOffers: 'Implantes dentales, diseño de sonrisa, ortodoncia invisible y blanqueamiento dental.',
                problemSolved: 'Resuelve problemas de masticación y estética de la sonrisa para mejorar la autoestima de los pacientes.',
                valueProp: 'Tecnología digital de punta y odontología sin dolor con especialistas calificados.',
                tone: 'Cercano, profesional, alegre y de confianza'
            },
            'gastronomia': {
                whatItDoes: 'Restaurante de comida artesanal y experiencia gastronómica premium.',
                whatItOffers: 'Platillos gourmet preparados al momento, servicio de coctelería y reservas de mesa.',
                problemSolved: 'Ofrece un espacio único de celebración y disfrute con comida de altísima calidad y ambiente excepcional.',
                valueProp: 'Ingredientes 100% frescos y locales combinados en recetas de autor que deleitan todos los sentidos.',
                tone: 'Cálido, amigable, entusiasta y hospitalario'
            }
        };

        const indKey = industry.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let industryFallback = {
            whatItDoes: 'Servicios profesionales de alta calidad orientados a la satisfacción del cliente.',
            whatItOffers: 'Consultoría personalizada, asesoramiento técnico y soluciones a la medida.',
            problemSolved: 'Optimiza la eficiencia y resuelve las fricciones operativas y comerciales del cliente.',
            valueProp: 'Atención personalizada por expertos y soluciones innovadoras con resultados medibles.',
            tone: 'Profesional, atento, confiable y resolutivo'
        };

        for (const [key, defaults] of Object.entries(industryDefaults)) {
            if (indKey.includes(key)) {
                industryFallback = defaults;
                break;
            }
        }

        const whatItDoes = strategic.whatItDoes || industryFallback.whatItDoes;
        const whatItOffers = strategic.whatItOffers || industryFallback.whatItOffers;
        const problemSolved = strategic.problemSolved || industryFallback.problemSolved;
        const valueProp = strategic.valueProp || industryFallback.valueProp;
        const tone = strategic.tone || industryFallback.tone;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: `
                Eres un experto en Ventas y atención al cliente de DIIC ZONE.
                Tu objetivo es generar una respuesta persuasiva, profesional y empática para un paciente o lead.
                
                CONTEXTO ESTRATÉGICO DE LA MARCA (DATOS REALES):
                - Nombre de la Marca: ${brandName}
                - Industria/Nicho: ${industry}
                - ¿Qué hace?: ${whatItDoes}
                - ¿Qué ofrece?: ${whatItOffers}
                - Dolor que resuelve: ${problemSolved}
                - Propuesta de Valor (USP): ${valueProp}
                - Tono de Comunicación: ${tone}
                
                DATOS DEL RECEPTOR:
                - Nombre: ${lead.full_name}
                - Interés registrado: ${lead.industry || 'Consulta o asesoría'}
                - Origen: ${lead.source || 'Social Media'}
                
                MENSAJE RECIBIDO (Si hay uno):
                "${lastMessage || ''}"

                INSTRUCCIONES DE RESPUESTA:
                1. DIÁLOGO PROGRESIVO ("IR POCO A POCO"): No intentes vender todo ni abrumar al cliente con textos largos de golpe. Responde de forma directa, corta (máximo 2 párrafos breves, idealmente de 2 a 3 oraciones por respuesta) y sumamente natural.
                2. VENTA CONSULTIVA Y EMPATÍA: Escucha activamente la duda del cliente. Brinda ayuda y calidez primero. Haz preguntas de calificación sencillas para avanzar el proceso de compra paso a paso (ej. "¿Para qué fecha te gustaría agendar?" o "¿Qué tipo de evento estás planeando?").
                3. REDIRECCIÓN NATURAL A LA CONVERSIÓN: Cada mensaje debe terminar con una pregunta abierta o un micro-compromiso que guíe al prospecto hacia la conversión (agendar una cita, cotizar un producto, etc.) de manera fluida y sin presión.
                4. USO RIGUROSO DE DATOS REALES: Responde basándote únicamente en lo que la empresa ofrece (${whatItOffers}) y hace (${whatItDoes}). Si te preguntan por un servicio, precio o detalle que no conoces, indica cordialmente que lo consultarás o haz una pregunta aclaratoria en lugar de simular datos falsos.
                5. TONO DE MARCA: Adapta la comunicación exactamente al tono definido: ${tone}.
                6. Solo devuelve el texto de la respuesta final que se enviará al cliente, sin introducciones ni comentarios extras.
            `
        });

        const prompt = lastMessage 
            ? `Responde al siguiente mensaje del paciente: "${lastMessage}"`
            : "Genera un mensaje de bienvenida y seguimiento inicial para este paciente.";

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });

    } catch (error) {
        console.error("Suggestion API Error:", error);
        return NextResponse.json({ error: "Error generating suggestion" }, { status: 500 });
    }
}
