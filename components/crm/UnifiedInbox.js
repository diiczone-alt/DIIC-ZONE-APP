'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    Search, Bot, User, MessageCircle, MoreVertical, Paperclip, 
    Send, CheckCircle2, AlertCircle, Phone, X, Shield, Wallet, MapPin, DollarSign, BrainCircuit, ShoppingCart,
    Mic, Volume2, Waveform
} from 'lucide-react';
import MedicalCatalog from './MedicalCatalog';
import { motion, AnimatePresence } from 'framer-motion';

// Conversation generator based on client niche (Initial demo conversations)
const generateConversations = (activeClient) => {
    const brandName = activeClient?.onboarding_data?.strategic?.brandName || 
                      activeClient?.onboarding_data?.company_profile?.company_name || 
                      (activeClient?.name && activeClient.name !== 'Neyser' ? activeClient.name : 'Espiga de oro');
    const industry = activeClient?.industry || activeClient?.onboarding_data?.strategic?.industry || 'General';
    const industryLower = industry.toLowerCase();
    const nameLower = (activeClient?.name || '').toLowerCase();
    
    const isMedical = ['doctor', 'medico', 'médico', 'medical', 'salud', 'clinica', 'clínica', 'urologia', 'urología'].some(k => industryLower.includes(k));
    const isAgro = ['agro', 'campo', 'agropecuario', 'agropecuaria', 'vete', 'veterinaria'].some(k => industryLower.includes(k));
    const isFood = ['panaderia', 'panadería', 'pasteleria', 'pastelería', 'bakery', 'comida', 'restaurante', 'alimentos'].some(k => industryLower.includes(k) || nameLower.includes(k)) || activeClient?.id === 'C-NEYSER-964';
    const isGym = ['gym', 'fitness', 'gimnasio', 'deporte', 'entrenador'].some(k => industryLower.includes(k));
    const isEducation = ['curso', 'formacion', 'formación', 'educacion', 'educación', 'mentoria', 'mentoría'].some(k => industryLower.includes(k));
    const isIndustrial = ['industrial', 'fabrica', 'fábrica', 'manufactura'].some(k => industryLower.includes(k));

    if (isMedical) {
        return [
            {
                id: 'c1',
                name: 'Roberto Mendoza',
                avatar: 'https://i.pravatar.cc/150?u=roberto',
                niche: 'Paciente',
                lastMessage: 'Sí, me interesa agendar una cita.',
                time: '10:42 AM',
                unread: 2,
                botActive: true,
                source: 'whatsapp',
                score: 85,
                status: 'Negociación',
                value: 150,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA de atención médica. ¿En qué puedo ayudarte hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Me gustaría información sobre consultas de urología y agendamiento.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: '¡Claro! Ofrecemos consultas médicas presenciales y virtuales especializadas. ¿Qué horario te acomoda más?', time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Preferiría por las tardes, a partir de las 3 PM.', time: '10:40 AM' },
                    { id: 5, sender: 'bot', text: 'Perfecto. Tenemos disponibilidad esta semana el miércoles y jueves a las 4:00 PM. ¿Te agendamos alguna?', time: '10:41 AM' },
                    { id: 6, sender: 'user', text: 'Sí, me interesa agendar una cita.', time: '10:42 AM' },
                ]
            },
            {
                id: 'c2',
                name: 'María Elena S.',
                avatar: 'https://i.pravatar.cc/150?u=maria',
                niche: 'Paciente',
                lastMessage: '¿Tienen citas disponibles para ecografía?',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 60,
                status: 'Contactado',
                value: 120,
                messages: [
                    { id: 1, sender: 'user', text: 'Hola, buenas tardes. ¿Realizan ecografías vesicales?', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Sí, realizamos ecografías renales y vesicales de alta resolución en nuestro consultorio de ${activeClient?.city || 'Santo Domingo'}. ¿Tienes orden médica?`, time: 'Ayer, 4:00 PM' },
                    { id: 3, sender: 'user', text: 'Sí, mi médico me la envió ayer.', time: 'Ayer, 4:05 PM' },
                    { id: 4, sender: 'user', text: '¿Tienen citas disponibles para ecografía?', time: 'Ayer, 4:06 PM' },
                ]
            }
        ];
    } else if (isAgro) {
        return [
            {
                id: 'c1',
                name: 'Hacienda La Florida (Juan R.)',
                avatar: 'https://i.pravatar.cc/150?u=florida',
                niche: 'Productor',
                lastMessage: 'Necesito cotizar 50 sacos de abono orgánico.',
                time: '10:42 AM',
                unread: 2,
                botActive: true,
                source: 'whatsapp',
                score: 90,
                status: 'Negociación',
                value: 850,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA de asistencia agropecuaria. ¿Cómo te encuentras hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Hola, me gustaría saber si tienen stock de fertilizantes y asesoría técnica en la zona.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: `¡Hola, Juan! Sí, contamos con stock completo de insumos y ofrecemos asesoría técnica directa en campo para optimizar tus cultivos en ${activeClient?.city || 'Santo Domingo'}.`, time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Excelente. Necesito cotizar 50 sacos de abono orgánico.', time: '10:40 AM' },
                ]
            },
            {
                id: 'c2',
                name: 'Agropecuaria del Sur',
                avatar: 'https://i.pravatar.cc/150?u=agrosur',
                niche: 'Distribuidor',
                lastMessage: '¿Cuál es el costo del servicio de riego automatizado?',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 75,
                status: 'Contactado',
                value: 3500,
                messages: [
                    { id: 1, sender: 'user', text: 'Buenas tardes, quisiera consultar por los sistemas de riego.', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Qué gusto saludarte de parte de ${brandName}. Ofrecemos diseño e instalación de sistemas de riego automatizado a la medida de tu parcela. ¿De cuántas hectáreas es tu cultivo?`, time: 'Ayer, 4:00 PM' },
                    { id: 3, sender: 'user', text: 'Tengo unas 4 hectáreas de maíz.', time: 'Ayer, 4:05 PM' },
                    { id: 4, sender: 'user', text: '¿Cuál es el costo del servicio de riego automatizado?', time: 'Ayer, 4:06 PM' },
                ]
            }
        ];
    } else if (isFood) {
        return [
            {
                id: 'c1',
                name: 'Sofía Gómez',
                avatar: 'https://i.pravatar.cc/150?u=sofia',
                niche: 'Cliente',
                lastMessage: '¿Hacen entregas a domicilio?',
                time: '10:42 AM',
                unread: 1,
                botActive: true,
                source: 'whatsapp',
                score: 80,
                status: 'Negociación',
                value: 75,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA de atención rápida. ¿En qué podemos ayudarte hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Hola, me gustaría saber si tienen tortas personalizadas para cumpleaños y si hacen envíos.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: `¡Claro que sí! En ${brandName} preparamos tortas y pasteles de diseño personalizados para cualquier evento especial. Hacemos entregas a domicilio en ${activeClient?.city || 'Santo Domingo'}.`, time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Excelente, ¿tienen un catálogo con precios?', time: '10:40 AM' },
                    { id: 5, sender: 'bot', text: 'Sí, puedes ver nuestro catálogo de productos en el botón de la tienda o aquí mismo. ¿Para qué fecha necesitas el pastel?', time: '10:41 AM' },
                    { id: 6, sender: 'user', text: '¿Hacen entregas a domicilio?', time: '10:42 AM' }
                ]
            },
            {
                id: 'c2',
                name: 'Restaurante El Sabor',
                avatar: 'https://i.pravatar.cc/150?u=restaurante',
                niche: 'Distribuidor',
                lastMessage: 'Me gustaría cotizar pan de hamburguesa al por mayor.',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 95,
                status: 'Contactado',
                value: 300,
                messages: [
                    { id: 1, sender: 'user', text: 'Hola, vi sus productos en redes sociales.', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Qué gusto saludarte. Soy el asistente IA de ${brandName}. ¿En qué te puedo colaborar hoy?`, time: 'Ayer, 4:00 PM' },
                    { id: 3, sender: 'user', text: 'Me gustaría cotizar pan de hamburguesa al por mayor.', time: 'Ayer, 4:05 PM' }
                ]
            }
        ];
    } else if (isGym) {
        return [
            {
                id: 'c1',
                name: 'Mateo Silva',
                avatar: 'https://i.pravatar.cc/150?u=mateo',
                niche: 'Atleta',
                lastMessage: '¿Tienen pase de cortesía para probar?',
                time: '10:42 AM',
                unread: 2,
                botActive: true,
                source: 'whatsapp',
                score: 75,
                status: 'Negociación',
                value: 90,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA de soporte deportivo. ¿Listo para empezar a entrenar hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Hola, me gustaría saber si tienen planes trimestrales y qué incluyen.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: '¡Hola! Sí, manejamos planes trimestrales con acceso libre a máquinas, clases funcionales guiadas y evaluación mensual.', time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Excelente. ¿Tienen pase de cortesía para probar?', time: '10:40 AM' },
                ]
            },
            {
                id: 'c2',
                name: 'Clara Ortiz',
                avatar: 'https://i.pravatar.cc/150?u=clara',
                niche: 'Cliente',
                lastMessage: '¿En qué horario son las clases funcionales?',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 80,
                status: 'Contactado',
                value: 35,
                messages: [
                    { id: 1, sender: 'user', text: 'Hola, qué tal. ¿Dan clases dirigidas por la mañana?', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Sí, tenemos clases funcionales y de cardio en las mañanas. ¿En qué horario te gustaría asistir?`, time: 'Ayer, 4:00 PM' },
                    { id: 3, sender: 'user', text: '¿En qué horario son las clases funcionales?', time: 'Ayer, 4:05 PM' }
                ]
            }
        ];
    } else if (isEducation) {
        return [
            {
                id: 'c1',
                name: 'Diego Falconí',
                avatar: 'https://i.pravatar.cc/150?u=diego',
                niche: 'Estudiante',
                lastMessage: '¿El curso incluye certificación?',
                time: '10:42 AM',
                unread: 2,
                botActive: true,
                source: 'whatsapp',
                score: 85,
                status: 'Negociación',
                value: 290,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA de admisiones. ¿En qué programa formativo estás interesado hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Hola, quisiera información sobre el temario del programa premium.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: '¡Hola Diego! Con gusto, te comparto el plan de estudios del programa. El curso es 100% interactivo con clases grabadas de por vida.', time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Excelente. ¿El curso incluye certificación?', time: '10:40 AM' },
                ]
            },
            {
                id: 'c2',
                name: 'Paola V.',
                avatar: 'https://i.pravatar.cc/150?u=paola',
                niche: 'Prospecto',
                lastMessage: '¿Tienen financiamiento para la mentoría?',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 70,
                status: 'Contactado',
                value: 950,
                messages: [
                    { id: 1, sender: 'user', text: 'Hola, me interesa agendar una mentoría uno a uno.', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Qué gusto saludarte. Sí, ofrecemos mentorías personalizadas de crecimiento empresarial con cupos limitados. ¿Buscas financiamiento o pago en cuotas?`, time: 'Ayer, 4:00 PM' },
                    { id: 3, sender: 'user', text: '¿Tienen financiamiento para la mentoría?', time: 'Ayer, 4:05 PM' }
                ]
            }
        ];
    } else if (isIndustrial) {
        return [
            {
                id: 'c1',
                name: 'Ing. Pedro Rosas',
                avatar: 'https://i.pravatar.cc/150?u=pedro',
                niche: 'Proveedor',
                lastMessage: '¿Me envían la cotización del lote?',
                time: '10:42 AM',
                unread: 1,
                botActive: true,
                source: 'whatsapp',
                score: 95,
                status: 'Negociación',
                value: 12000,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA de soporte industrial. ¿En qué le podemos servir hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Buenas tardes, necesitamos una cotización formal para el suministro de materiales metálicos a medida.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: 'Entendido, Ing. Pedro. ¿Nos podría compartir los planos y cantidades deseadas para cotizarle a la brevedad?', time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Sí, ya se los pasé a su correo corporativo.', time: '10:40 AM' },
                    { id: 5, sender: 'bot', text: 'Recibido correctamente. ¿Me envían la cotización del lote?', time: '10:42 AM' }
                ]
            },
            {
                id: 'c2',
                name: 'Tecno-Metal Cía.',
                avatar: 'https://i.pravatar.cc/150?u=tecno',
                niche: 'Cliente Corp.',
                lastMessage: '¿Cuál es el tiempo de entrega?',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 80,
                status: 'Contactado',
                value: 4500,
                messages: [
                    { id: 1, sender: 'user', text: 'Hola, vi sus maquinarias en su catálogo digital.', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Con gusto. Fabricamos maquinaria industrial a medida con entregas a nivel nacional en Ecuador. ¿Cuál es el tiempo de entrega?`, time: 'Ayer, 4:00 PM' }
                ]
            }
        ];
    } else {
        return [
            {
                id: 'c1',
                name: 'Carlos Ruiz',
                avatar: 'https://i.pravatar.cc/150?u=carlos',
                niche: 'Prospecto',
                lastMessage: 'Me interesa contratar el plan de crecimiento.',
                time: '10:42 AM',
                unread: 2,
                botActive: true,
                source: 'whatsapp',
                score: 70,
                status: 'Negociación',
                value: 500,
                messages: [
                    { id: 1, sender: 'bot', text: `¡Hola! Bienvenido a ${brandName}. Soy el asistente IA. ¿En qué podemos ayudarte hoy?`, time: '10:30 AM' },
                    { id: 2, sender: 'user', text: 'Hola, me interesa conocer los servicios y planes que ofrecen.', time: '10:32 AM' },
                    { id: 3, sender: 'bot', text: `¡Hola Carlos! Qué gusto. En ${brandName} ofrecemos soluciones especializadas para impulsar tus objetivos. ¿Qué tipo de servicio buscas?`, time: '10:32 AM' },
                    { id: 4, sender: 'user', text: 'Me interesa contratar el plan de crecimiento.', time: '10:40 AM' },
                ]
            },
            {
                id: 'c2',
                name: 'Ana María G.',
                avatar: 'https://i.pravatar.cc/150?u=ana',
                niche: 'Cliente',
                lastMessage: '¿Cuándo es el próximo taller o mentoría?',
                time: 'Ayer',
                unread: 0,
                botActive: true,
                source: 'instagram',
                score: 80,
                status: 'Contactado',
                value: 150,
                messages: [
                    { id: 1, sender: 'user', text: 'Hola, quisiera saber los detalles del próximo evento.', time: 'Ayer, 4:00 PM' },
                    { id: 2, sender: 'bot', text: `¡Hola! Qué gusto saludarte. Soy el asistente IA de ${brandName}. Con gusto te brindo la información del próximo evento. ¿Buscas presencial o virtual?`, time: 'Ayer, 4:00 PM' },
                    { id: 3, sender: 'user', text: 'Preferiría virtual si es posible.', time: 'Ayer, 4:05 PM' },
                    { id: 4, sender: 'user', text: '¿Cuándo es el próximo taller o mentoría?', time: 'Ayer, 4:06 PM' }
                ]
            }
        ];
    }
};

export default function UnifiedInbox({ activeClient }) {
    const brandName = activeClient?.onboarding_data?.strategic?.brandName || 
                      activeClient?.onboarding_data?.company_profile?.company_name || 
                      (activeClient?.name && activeClient.name !== 'Neyser' ? activeClient.name : 'Espiga de oro');
    
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const [showCatalog, setShowCatalog] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    
    // AI Dynamic Simulation Questions State
    const [simulatedQuestions, setSimulatedQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    // AI Suggestions Sidekick States
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);

    const chatEndRef = useRef(null);

    // Initialize/Update conversations when client changes
    useEffect(() => {
        const list = generateConversations(activeClient);
        setConversations(list);
        if (list.length > 0) {
            setSelectedId(list[0].id);
        }
    }, [activeClient]);

    const activeChat = conversations.find(c => c.id === selectedId);

    // Dynamic AI Simulation Questions based on Strategic Profile
    useEffect(() => {
        if (!activeClient) return;

        async function fetchDynamicQuestions() {
            setLoadingQuestions(true);
            try {
                const res = await fetch('/api/ai/generate-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ context: activeClient })
                });
                const data = await res.json();
                if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
                    setSimulatedQuestions(data.questions.map(q => ({
                        label: q.length > 25 ? q.substring(0, 22) + '...' : q,
                        text: q
                    })));
                } else {
                    // Fallback in case of API failure
                    setSimulatedQuestions([
                        { label: 'Servicios y tarifas', text: 'Hola, me interesa conocer los precios de sus servicios y planes.' },
                        { label: 'Contacto directo', text: 'Hola, ¿cómo puedo agendar una llamada con ustedes?' }
                    ]);
                }
            } catch (e) {
                console.error("Error loading dynamic questions:", e);
                setSimulatedQuestions([
                    { label: 'Servicios y tarifas', text: 'Hola, me interesa conocer los precios de sus servicios y planes.' },
                    { label: 'Contacto directo', text: 'Hola, ¿cómo puedo agendar una llamada con ustedes?' }
                ]);
            } finally {
                setLoadingQuestions(false);
            }
        }

        fetchDynamicQuestions();
    }, [activeClient]);

    // Auto-scroll when chat messages update or typing state changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.messages, isBotTyping]);

    // Sidekick suggestion auto-updater
    useEffect(() => {
        if (activeChat) {
            const lastUserMsg = activeChat.messages.filter(m => m.sender === 'user').slice(-1)[0]?.text;
            if (lastUserMsg) {
                fetchAISuggestion(lastUserMsg);
            } else {
                setAiSuggestion('');
            }
        }
    }, [selectedId, activeChat?.messages?.length]);

    const fetchAISuggestion = async (lastUserMsg) => {
        setLoadingSuggestion(true);
        try {
            const res = await fetch('/api/ai/suggest-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: {
                        full_name: activeChat.name,
                        industry: activeChat.niche,
                        source: activeChat.source
                    },
                    context: activeClient || { name: brandName, industry: 'General', onboarding_data: {} },
                    lastMessage: lastUserMsg
                })
            });
            const data = await res.json();
            setAiSuggestion(data.text || 'No se pudo generar una sugerencia.');
        } catch (e) {
            console.error("Error fetching suggestion:", e);
            setAiSuggestion('Error al conectar con el asistente de IA.');
        } finally {
            setLoadingSuggestion(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'human', // The operator
            text: inputText.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(chat => {
            if (chat.id === selectedId) {
                return {
                    ...chat,
                    messages: [...chat.messages, userMsg],
                    lastMessage: userMsg.text,
                    time: userMsg.time,
                    botActive: false // Pauses the automatic responses as requested
                };
            }
            return chat;
        }));

        setInputText('');
    };

    // Simulate Client Message and trigger AI Auto-response
    const handleSimulateClientMessage = async (messageText) => {
        if (!activeChat) return;

        const clientMsg = {
            id: Date.now(),
            sender: 'user', // The client
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Add client message
        setConversations(prev => prev.map(chat => {
            if (chat.id === selectedId) {
                return {
                    ...chat,
                    messages: [...chat.messages, clientMsg],
                    lastMessage: clientMsg.text,
                    time: clientMsg.time,
                    botActive: true // Turn bot back on for auto-responding
                };
            }
            return chat;
        }));

        // Trigger bot auto-response
        setIsBotTyping(true);

        try {
            const res = await fetch('/api/ai/suggest-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: {
                        full_name: activeChat.name,
                        industry: activeChat.niche,
                        source: activeChat.source
                    },
                    context: activeClient || { name: brandName, industry: 'General', onboarding_data: {} },
                    lastMessage: messageText
                })
            });
            
            const data = await res.json();
            
            // Wait 1.5 seconds for typing realism
            setTimeout(() => {
                const botMsg = {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: data.text || `¡Hola! Gracias por comunicarte con ${brandName}. En breve responderemos a tu consulta sobre "${messageText}".`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setConversations(prev => prev.map(chat => {
                    if (chat.id === selectedId) {
                        return {
                            ...chat,
                            messages: [...chat.messages, botMsg],
                            lastMessage: botMsg.text,
                            time: botMsg.time
                        };
                    }
                    return chat;
                }));
                setIsBotTyping(false);
            }, 1500);

        } catch (e) {
            console.error("AI Auto-response error:", e);
            setIsBotTyping(false);
        }
    };

    const handleUseSuggestion = () => {
        if (aiSuggestion) {
            setInputText(aiSuggestion);
        }
    };

    const handleSendSuggestionDirectly = () => {
        if (!aiSuggestion) return;
        
        const botMsg = {
            id: Date.now(),
            sender: 'bot',
            text: aiSuggestion,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(chat => {
            if (chat.id === selectedId) {
                return {
                    ...chat,
                    messages: [...chat.messages, botMsg],
                    lastMessage: botMsg.text,
                    time: botMsg.time,
                    botActive: false // Pauses bot since human operator decided to push it
                };
            }
            return chat;
        }));

        setAiSuggestion('');
    };

    // Filtering logic
    const filteredConversations = conversations.filter(chat => {
        if (filter === 'No Leídos') return chat.unread > 0;
        if (filter === 'IA Activa') return chat.botActive;
        if (filter === 'Humanos') return !chat.botActive;
        return true;
    });

    return (
        <div className="flex-1 flex h-full min-h-[600px] overflow-hidden bg-[#050511]">
            
            {/* COLUMN 1: CHAT LIST */}
            <div className="w-[320px] bg-[#0A0A12] border-r border-white/5 flex flex-col z-10">
                <div className="p-4 border-b border-white/5 bg-[#0E0E18]">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente, número o tag..." 
                            className="w-full bg-[#151520] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 custom-scrollbar">
                        {['Todos', 'No Leídos', 'IA Activa', 'Humanos'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                                    filter === f 
                                        ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' 
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {filteredConversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setSelectedId(chat.id)}
                            className={`p-3 mb-1 rounded-2xl cursor-pointer transition-all border ${
                                selectedId === chat.id 
                                    ? 'bg-[#1A1A28] border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                                    : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full border-2 border-[#151520]" />
                                        {chat.botActive && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-[#1A1A28]">
                                                <Bot className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                        {chat.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#1A1A28]">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-bold truncate w-28">{chat.name}</h4>
                                        <span className="text-[10px] text-gray-500 block">{chat.source}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1">{chat.time}</span>
                            </div>
                            <p className={`text-xs truncate ml-12 ${chat.unread > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                                {chat.lastMessage}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: CONVERSATION AREA */}
            <div className="flex-1 flex flex-col relative bg-[#050511]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-white/5 bg-[#0A0A12]/80 backdrop-blur-md px-6 flex items-center justify-between z-10 sticky top-0">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        {activeChat.name}
                                        {activeChat.score > 80 && (
                                            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                                <Shield className="w-3 h-3" /> Verificado
                                            </div>
                                        )}
                                        {activeChat.botActive 
                                            ? <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1"><Bot className="w-3 h-3" /> IA Respondiendo</span>
                                            : <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1"><User className="w-3 h-3" /> Humano</span>
                                        }
                                    </h3>
                                    <p className="text-[11px] text-gray-400 font-mono">ID: {activeChat.id} • {activeChat.source}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors tooltip relative group">
                                    <AlertCircle className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => {
                                        setConversations(prev => prev.map(chat => {
                                            if (chat.id === selectedId) {
                                                return { ...chat, botActive: !chat.botActive };
                                            }
                                            return chat;
                                        }));
                                    }}
                                    className={`px-4 py-2 text-white text-sm font-bold rounded-xl shadow-lg transition-all ${
                                        activeChat.botActive 
                                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                                    }`}
                                >
                                    {activeChat.botActive ? 'Tomar Control (Pausar IA)' : 'Activar Asistente IA'}
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Client Simulation Bar */}
                        <div className="px-6 py-2 bg-[#0E0E18]/85 border-b border-white/5 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar z-10">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Bot className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Simulador de Leads:</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-0.5 custom-scrollbar items-center">
                                {loadingQuestions ? (
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">
                                        Analizando perfil estratégico de {brandName} para formular preguntas reales...
                                    </span>
                                ) : (
                                    simulatedQuestions.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSimulateClientMessage(q.text)}
                                            className="px-3 py-1 bg-[#1a1a2e] hover:bg-indigo-600/30 border border-indigo-500/20 hover:border-indigo-500/50 rounded-full text-[10px] text-gray-300 hover:text-indigo-200 whitespace-nowrap transition-all shadow-sm"
                                        >
                                            "{q.label}"
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat Bubbles */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 relative z-0">
                            {activeChat.messages.map(msg => {
                                const isBot = msg.sender === 'bot';
                                const isHuman = msg.sender === 'human';
                                const isUser = msg.sender === 'user'; // The client

                                return (
                                    <div key={msg.id} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[75%] rounded-2xl p-4 flex flex-col ${
                                            isUser ? 'bg-[#151520] border border-white/5 rounded-tl-sm' : 
                                            isBot ? 'bg-indigo-600/10 border border-indigo-500/20 rounded-tr-sm' : 
                                            'bg-emerald-600/10 border border-emerald-500/20 rounded-tr-sm'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                                {isBot && <Bot className="w-3 h-3 text-indigo-400" />}
                                                {isHuman && <User className="w-3 h-3 text-emerald-400" />}
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isUser ? 'text-gray-400' : isBot ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                                    {isUser ? 'Cliente' : isBot ? 'Asistente IA' : 'Admin'}
                                                </span>
                                            </div>
                                            <p className={`text-sm leading-relaxed whitespace-pre-line ${isUser ? 'text-gray-200' : 'text-white'}`}>
                                                {msg.text}
                                            </p>
                                            <span className="text-[9px] text-gray-500 text-right mt-2 block">{msg.time}</span>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Typing Indicator */}
                            {isBotTyping && (
                                <div className="flex justify-end">
                                    <div className="max-w-[75%] rounded-2xl p-4 flex flex-col bg-indigo-600/10 border border-indigo-500/20 rounded-tr-sm animate-pulse">
                                        <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                            <Bot className="w-3 h-3 text-indigo-400" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                Asistente IA ({brandName})
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 items-center h-4 py-1 px-2">
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-[#0A0A12] border-t border-white/5 z-10 w-full relative">
                            {activeChat.botActive && (
                                <div className="absolute -top-10 left-0 right-0 py-2 bg-indigo-500/10 text-center border-t border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-center gap-2">
                                    <Bot className="w-4 h-4 animate-pulse" /> La IA de {brandName} responderá automáticamente a los mensajes entrantes del cliente. Escribir pausará el bot.
                                </div>
                            )}
                            <div className="flex bg-[#151520] border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                                <button className="p-4 text-gray-500 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /></button>
                                <button 
                                    onClick={() => setShowCatalog(!showCatalog)}
                                    className={`p-4 transition-colors ${showCatalog ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-white'}`}
                                    title="Catálogo Comercial"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                                <div className="flex-1 relative bg-transparent">
                                    <textarea 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        className="w-full bg-transparent text-white text-sm p-4 pr-32 resize-none focus:outline-none custom-scrollbar"
                                        placeholder={`Escribe un mensaje de respuesta manual de ${brandName}...`}
                                        rows="1"
                                    ></textarea>
                                    
                                    {/* AI VOICE PREVIEW OVERLAY (Tactical) */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group/voice">
                                        <div className="flex gap-1 items-end h-3">
                                            <div className="w-[2px] h-full bg-indigo-400 animate-[bounce_1s_infinite]" />
                                            <div className="w-[2px] h-[60%] bg-indigo-400 animate-[bounce_1.2s_infinite]" />
                                            <div className="w-[2px] h-[80%] bg-indigo-400 animate-[bounce_0.8s_infinite]" />
                                            <div className="w-[2px] h-[40%] bg-indigo-400 animate-[bounce_1.5s_infinite]" />
                                        </div>
                                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest group-hover/voice:text-white transition-colors">Voz IA Lista</span>
                                    </div>
                                </div>
                                <button className="p-4 text-emerald-400 hover:text-emerald-300 transition-colors relative group/mic">
                                    <Mic className="w-5 h-5 group-hover/mic:scale-110 transition-transform" />
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-black border border-white/10 rounded-xl text-[9px] font-black uppercase text-white whitespace-nowrap opacity-0 group-hover/mic:opacity-100 transition-opacity pointer-events-none">
                                        Enviar Nota de Voz IA (Voz de Marca)
                                    </div>
                                </button>
                                <button 
                                    onClick={handleSendMessage}
                                    className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center min-w-[60px]"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 flex-col">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
                        <p>Selecciona una conversación</p>
                    </div>
                )}
            </div>

            {/* COLUMN 3: CRM LEAD INTELLIGENCE DOCK / CATALOG */}
            {activeChat && (
                <div className="w-[340px] bg-[#0A0A12] border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar z-10">
                    <AnimatePresence mode="wait">
                        {showCatalog ? (
                            <motion.div 
                                key="catalog" 
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full"
                            >
                                <MedicalCatalog 
                                    activeClient={activeClient}
                                    onClose={() => setShowCatalog(false)} 
                                    onSelect={(service) => {
                                        // Insert catalog link or information into input
                                        setInputText(prev => prev + `Hola, te comparto la información de nuestro servicio: *${service.name}*. El precio es de $${service.price} USD.\nDescripción: ${service.description}\n`);
                                        setShowCatalog(false);
                                    }} 
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="intelligence" 
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col"
                            >
                                <div className="h-16 border-b border-white/5 flex items-center px-6 sticky top-0 bg-[#0A0A12]/80 backdrop-blur-md z-10">
                                    <h3 className="font-bold text-white text-sm tracking-widest uppercase">Perfil del Lead</h3>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    {/* Header Stats */}
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-[#151520] to-[#202030] rounded-full mx-auto mb-3 border-2 border-white/10 flex items-center justify-center relative shadow-xl shadow-black">
                                            <span className="text-2xl font-bold text-white">{activeChat.name.charAt(0)}</span>
                                            <div className="absolute -bottom-2 -right-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Score: {activeChat.score}
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold text-white">{activeChat.name}</h2>
                                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1"><BriefcaseIcon /> {activeChat.niche}</p>
                                    </div>

                                    {/* CRM Pipeline Status */}
                                    <div className="bg-[#151520] p-4 rounded-2xl border border-white/5">
                                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Estado en Pipeline</h4>
                                        <select 
                                            value={activeChat.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setConversations(prev => prev.map(chat => {
                                                    if (chat.id === selectedId) {
                                                        return { ...chat, status: newStatus };
                                                    }
                                                    return chat;
                                                }));
                                            }}
                                            className="w-full bg-[#0A0A12] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 appearance-none"
                                        >
                                            <option>Nuevo Lead</option>
                                            <option>Contactado</option>
                                            <option>Negociación</option>
                                            <option>Propuesta Enviada</option>
                                            <option>Cerrado / Ganado</option>
                                        </select>
                                    </div>

                                    {/* Financial Value Indicator */}
                                    <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                        <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mb-1 relative z-10">Valor de Venta Est.</p>
                                        <p className="text-3xl font-bold text-emerald-300 relative z-10">${activeChat.value.toLocaleString()}</p>
                                    </div>

                                    {/* AI Copilot Sidekick */}
                                    <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                                        <BrainCircuit className="absolute -right-4 -top-4 w-20 h-20 text-indigo-500/10" />
                                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Bot className="w-4 h-4" /> Sugerencia IA Real
                                        </h4>
                                        
                                        {loadingSuggestion ? (
                                            <div className="flex flex-col items-center justify-center py-4 space-y-2">
                                                <Bot className="w-6 h-6 text-indigo-400 animate-spin" />
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider">Pensando respuesta real...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-xs text-indigo-200 leading-relaxed relative z-10 font-medium whitespace-pre-line">
                                                    {aiSuggestion || "Sin mensajes recientes del cliente para analizar."}
                                                </p>
                                                {aiSuggestion && (
                                                    <div className="flex gap-2 mt-4 relative z-10">
                                                        <button 
                                                            onClick={handleUseSuggestion}
                                                            className="flex-1 bg-indigo-600/30 hover:bg-indigo-600 flex items-center justify-center py-2 text-indigo-300 hover:text-white text-xs font-bold rounded-lg border border-indigo-500/30 transition-all"
                                                        >
                                                            Copiar al Editor
                                                        </button>
                                                        <button 
                                                            onClick={handleSendSuggestionDirectly}
                                                            className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/30 transition-all"
                                                            title="Enviar Directo"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Basic Info Fields */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-white">{activeClient?.whatsapp_number || '+593 99 999 9999'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-[#151520] rounded-xl border border-white/5">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-white">{activeClient?.city || activeClient?.onboarding_data?.strategic?.city || 'Santo Domingo, Ecuador'}</span>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

function BriefcaseIcon() {
    return <Wallet className="w-3.5 h-3.5 text-gray-400" />
}
