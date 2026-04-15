'use client';

import { useState, useRef } from 'react';
import { Bot, Sparkles, Send, Mic, Image as ImageIcon, Copy, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROMPTS = {
    copy: `Crea 3 versiones de copy para [plataforma: IG/FB/TikTok/YouTube], objetivo: [vender/agendar/mensajes/alcance].
Nicho: [nicho].
Producto/servicio: [servicio].
Tono: [profesional/cercano/urgente/educativo].
Incluye: 1 gancho fuerte, 1 prueba social opcional, 1 CTA claro, 5 hashtags relevantes.`,

    reels: `Dame 12 ideas de reels para [nicho] con estructura:
Hook (0-2s)
Desarrollo (3-10s)
Cierre/CTA (10-15s)
Incluye 3 ideas educativas, 3 testimoniales, 3 de autoridad y 3 virales adaptadas al nicho.`,

    repurposing: `Voy a pegar un contenido largo. Transfórmalo en:
1. 3 reels (guion corto)
2. 1 carrusel (10 slides con títulos)
3. 5 stories (secuencia)
4. 1 post tipo autoridad
Mantén el mismo mensaje central y adapta el tono a [nicho].
Aquí va el contenido: [pegar texto/link].`,

    hooks: `Crea 25 ganchos virales para [nicho] enfocados en [dolor principal].
Divide en:
10 'Mito o verdad'
10 'Shock/curiosidad'
5 'Historia corta'
Deben ser cortos, claros y adaptados a IG/TikTok.`
};

export default function AgentPage() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { role: 'system', content: 'Hola, soy tu Agente de Contenido IA. ¿En qué puedo ayudarte hoy? Puedo generar ideas de posts, redactar copys o analizar tendencias.' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [pendingPrompt, setPendingPrompt] = useState('');
    const inputRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const newHistory = [...history, { role: 'user', content: input }];
        setHistory(newHistory);
        setInput('');

        // Simulate thinking and response
        setTimeout(() => {
            setHistory(prev => [...prev, {
                role: 'system',
                content: '¡Entendido! Aquí tienes algunas ideas basadas en tu solicitud:',
                suggestions: [
                    'Reel: "3 Mitos sobre tu nicho" (Alto alcance)',
                    'Carrusel: "Guía paso a paso" (Educativo)',
                    'Story: "Detrás de cámaras" (Conexión)'
                ]
            }]);
        }, 1500);
    };

    const handleQuickAction = (promptKey) => {
        setPendingPrompt(PROMPTS[promptKey]);
        setShowModal(true);
    };

    const confirmAction = (withContext) => {
        let finalPrompt = pendingPrompt;
        if (withContext) {
            finalPrompt += '\n\n[Contexto: Proyecto Actual - Campaña Black Friday]';
        }
        setInput(finalPrompt);
        setShowModal(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                        <Bot className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Agente IA de Contenido</h1>
                        <p className="text-xs text-gray-400">Tu asistente creativo inteligente</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 flex gap-6 relative">

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        {history.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                                    ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-fuchsia-600'}`}>
                                    {msg.role === 'user' ? <span className="text-xs font-bold">TÚ</span> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-4 
                                    ${msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>

                                    {msg.suggestions && (
                                        <div className="mt-4 space-y-2">
                                            {msg.suggestions.map((sug, i) => (
                                                <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5 hover:border-fuchsia-500/30 transition-colors cursor-pointer flex items-center gap-3 group">
                                                    <Sparkles className="w-4 h-4 text-fuchsia-500 group-hover:animate-pulse" />
                                                    <span className="text-xs font-medium text-white">{sug}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-[#050511] border-t border-white/5">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Pide ideas, copys o estrategias..."
                                className="w-full bg-[#1A1A24] text-white rounded-xl pl-4 pr-32 py-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 placeholder-gray-500 text-sm"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                    <Mic className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg transition-colors shadow-lg shadow-fuchsia-500/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Quick Actions) */}
                <div className="w-80 space-y-6">
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Acciones Rápidas
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickAction
                                label="Crear Copy"
                                icon={Copy}
                                color="text-blue-400"
                                onClick={() => handleQuickAction('copy')}
                            />
                            <QuickAction
                                label="Ideas Reel"
                                icon={VideoIcon}
                                color="text-pink-400"
                                onClick={() => handleQuickAction('reels')}
                            />
                            <QuickAction
                                label="Repurposing"
                                icon={RefreshCw}
                                color="text-emerald-400"
                                onClick={() => handleQuickAction('repurposing')}
                            />
                            <QuickAction
                                label="Viral Hooks"
                                icon={TargetIcon}
                                color="text-orange-400"
                                onClick={() => handleQuickAction('hooks')}
                            />
                        </div>
                    </div>

                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5">
                        <h3 className="text-white font-bold mb-4">Tendencias Hoy</h3>
                        <div className="space-y-3">
                            <TrendItem tag="#IAgenerativa" volume="1.2M" />
                            <TrendItem tag="#MarketingDigital" volume="850K" />
                            <TrendItem tag="#Productividad" volume="500K" />
                        </div>
                    </div>
                </div>

                {/* Context Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white">¿Aplicar al proyecto actual?</h3>
                                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-gray-400 text-sm mb-6">
                                    Podemos añadir el contexto de tu campaña activa para mejores resultados.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => confirmAction(true)}
                                        className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-fuchsia-600/20"
                                    >
                                        Sí, usar contexto del proyecto
                                    </button>
                                    <button
                                        onClick={() => confirmAction(false)}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-colors"
                                    >
                                        No, usar solo la plantilla
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}

function QuickAction({ label, icon: Icon, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all group"
        >
            <Icon className={`w-6 h-6 mb-2 ${color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs text-gray-400 font-medium">{label}</span>
        </button>
    );
}

function TrendItem({ tag, volume }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded cursor-pointer transition-colors">
            <span className="text-sm text-gray-300 font-medium">{tag}</span>
            <span className="text-xs text-gray-500">{volume}</span>
        </div>
    );
}

// Icons for Quick Actions (mocking imports if not available)
const VideoIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
);
const TargetIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
