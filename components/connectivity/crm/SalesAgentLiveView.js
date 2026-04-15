'use client';

import { useState, useEffect } from 'react';
import {
    MessageCircle, BrainCircuit, Calendar, FileText,
    CheckCircle, User, Zap, ArrowRight, Bot, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = [
    {
        id: 'hot',
        type: 'Lead Caliente 🔥',
        chat: [
            { role: 'user', text: 'Hola, quiero una cita para la cirugía láser.' },
            { role: 'ai', text: '¡Hola! Claro, soy el asistente virtual. Veo que te interesa la cirugía láser. ¿Para cuándo te gustaría agendar?', thinking: 'Intención: Compra Directa' },
            { role: 'user', text: 'Para este viernes por favor.' },
            { role: 'ai', text: 'Perfecto. Tengo espacio a las 3pm. Te envío la confirmación ahora mismo.', thinking: 'Acción: Bloquear Calendario' }
        ],
        steps: ['Detectar Intención: Compra', 'Calificación: LEAD CALIENTE', 'Acción: Agendar Cita', 'CRM: Guardar Venta'],
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
    },
    {
        id: 'interested',
        type: 'Lead Interesado 🟡',
        chat: [
            { role: 'user', text: 'Hola, ¿cuánto cuesta el tratamiento?' },
            { role: 'ai', text: 'Hola 👋 El tratamiento de rejuvenecimiento inicia en $80. ¿Te gustaría ver los detalles o agendar una valoración?', thinking: 'Intención: Información/Precio' },
            { role: 'user', text: 'Ver detalles por favor.' },
            { role: 'ai', text: 'Te he enviado el brochure completo a tu correo. ¿Te gustaría que te contactemos en 2 días?', thinking: 'Acción: Enviar Info + Seguimiento' }
        ],
        steps: ['Detectar Intención: Info', 'Calificación: INTERESADO', 'Acción: Enviar Cotización', 'CRM: Programar Seguimiento'],
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20'
    },
    {
        id: 'info',
        type: 'Duda General 🔴',
        chat: [
            { role: 'user', text: '¿Aceptan tarjeta de crédito?' },
            { role: 'ai', text: 'Sí, aceptamos todas las tarjetas y diferidos. ¿Te gustaría conocer nuestros planes?', thinking: 'Intención: Duda Administrativa' },
            { role: 'user', text: 'Solo quería saber eso, gracias.' },
            { role: 'ai', text: '¡Con gusto! Si necesitas algo más, aquí estoy 24/7.', thinking: 'Acción: Responder + Cerrar' }
        ],
        steps: ['Detectar Intención: Duda', 'Calificación: INFORMATIVO', 'Acción: Respuesta Rápida', 'CRM: Registrar Interacción'],
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    }
];

export default function SalesAgentLiveView() {
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const scenario = SCENARIOS[currentScenarioIndex];

    useEffect(() => {
        // Reset state on scenario change
        setStepIndex(0);
        setMessageIndex(0);

        // Simulate Chat Progression
        const chatInterval = setInterval(() => {
            setMessageIndex(prev => {
                if (prev < scenario.chat.length) return prev + 1;
                return prev;
            });
        }, 1500);

        // Simulate Brain Steps
        const stepInterval = setInterval(() => {
            setStepIndex(prev => {
                if (prev < scenario.steps.length) return prev + 1;
                return prev;
            });
        }, 1200);

        // Scenario Rotation
        const scenarioTimer = setTimeout(() => {
            setCurrentScenarioIndex(prev => (prev + 1) % SCENARIOS.length);
        }, 8000); // Change scenario every 8 seconds

        return () => {
            clearInterval(chatInterval);
            clearInterval(stepInterval);
            clearTimeout(scenarioTimer);
        };
    }, [currentScenarioIndex]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">

            {/* LEFT: Live Conversation */}
            <div className="bg-[#050511] border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden relative">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050511] rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Asistente Virtual</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> En línea • Responde en 0.2s
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <AnimatePresence mode='popLayout'>
                        {scenario.chat.slice(0, messageIndex).map((msg, idx) => (
                            <motion.div
                                key={currentScenarioIndex + '-' + idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-[#1A1A24] text-gray-200 border border-white/5 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                    {msg.role === 'ai' && msg.thinking && (
                                        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                                            <BrainCircuit className="w-3 h-3" /> {msg.thinking}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {messageIndex < scenario.chat.length && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-gray-500 text-xs pl-2">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* RIGHT: AI Brain Process */}
            <div className={`border ${scenario.borderColor} ${scenario.bg} rounded-3xl p-6 relative overflow-hidden transition-colors duration-500`}>

                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-400" /> Proceso de Pensamiento
                </h3>

                <div className="space-y-6 relative z-10">
                    {/* Step 1: Input */}
                    <div className="flex items-start gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase">Input</div>
                            <div className="text-sm text-white">Mensaje Recibido</div>
                        </div>
                    </div>

                    {/* Timeline Line */}
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-white/10 -z-10" />

                    {/* Dynamic Steps */}
                    {scenario.steps.map((step, idx) => {
                        const isActive = idx < stepIndex;
                        const isCurrent = idx === stepIndex - 1;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0.2, x: -10 }}
                                animate={{
                                    opacity: isActive ? 1 : 0.2,
                                    x: isActive ? 0 : -10
                                }}
                                className="flex items-center gap-4"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? `bg-white text-black shadow-lg shadow-white/20 scale-110` : 'bg-black/20 text-gray-500'
                                    }`}>
                                    {idx === 0 && <BrainCircuit className="w-4 h-4" />}
                                    {idx === 1 && <User className="w-4 h-4" />}
                                    {idx === 2 && <Zap className="w-4 h-4" />}
                                    {idx === 3 && <Database className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                        {step}
                                    </div>
                                    {isCurrent && (
                                        <div className={`text-xs ${scenario.color} animate-pulse font-mono`}>
                                            Procesando...
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Outcome Badge */}
                <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-2">Resultado Final</div>
                    <div className={`text-2xl font-black ${scenario.color} flex items-center gap-2`}>
                        {scenario.type}
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>

                {/* Scenario Indicators */}
                <div className="absolute bottom-4 right-6 flex gap-1">
                    {SCENARIOS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentScenarioIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentScenarioIndex ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
