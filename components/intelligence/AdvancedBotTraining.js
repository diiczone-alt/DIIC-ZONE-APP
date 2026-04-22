'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, Zap, User, Bot, AlertCircle, TrendingUp, 
    MessageSquare, History, Sparkles, ChevronRight,
    Search, Headphones, Database, Network
} from 'lucide-react';

export default function AdvancedBotTraining({ selectedAgent }) {
    const [messages, setMessages] = useState([
        { role: 'user', content: '¿Qué diferencia hay entre el tratamiento de láser y el tradicional?', type: 'complex' },
        { role: 'bot', content: 'Pensando: El cliente busca una comparación técnica enfocada en beneficios... Accediendo a historial clínico de procedimientos similares...', thinking: true },
        { role: 'bot', content: 'Hola Dra. Rey, basándome en su protocolo de Urología Avanzada: El tratamiento láser (HoLEP) reduce el sangrado y permite una recuperación en 24h, a diferencia de la cirugía tradicional que requiere 3 días de sonda. ¿Le gustaría que le agende una valoración para ver si es candidato?', type: 'expert' }
    ]);
    const [input, setInput] = useState('');

    return (
        <div className="space-y-6">
            {/* Header: Training Lab */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Network className="w-32 h-32 text-indigo-400" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Laboratorio de Redes Neuronales</h3>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-2 flex items-center gap-2">
                             Entrenando a <span className="text-white">"{selectedAgent.name}"</span> con Contexto Profundo
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <StatusBadge icon={Zap} label="Baja Latencia: 0.8s" color="text-emerald-400 bg-emerald-500/10" />
                        <StatusBadge icon={Database} label="Memoria: 5GB" color="text-indigo-400 bg-indigo-500/10" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Simulator: The "Human-Like" Chat */}
                <div className="lg:col-span-7 bg-[#0A0A12] border border-white/5 rounded-[2.5rem] flex flex-col h-[600px] overflow-hidden shadow-2xl">
                    <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Bot className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Prueba de Razonamiento Complejo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-gray-500 uppercase">Modo Entrenamiento Activo</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl ${
                                    msg.role === 'user' 
                                    ? 'bg-white/5 border border-white/10 rounded-tl-sm' 
                                    : msg.thinking 
                                    ? 'bg-indigo-500/10 border border-indigo-500/20 italic text-[10px] text-indigo-300 rounded-tr-sm'
                                    : 'bg-indigo-600 border border-indigo-400 rounded-tr-sm shadow-lg shadow-indigo-600/20'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <div className="flex justify-between items-center mt-2 opacity-50">
                                        <span className="text-[8px] uppercase font-black">{msg.role === 'user' ? 'Prospecto' : 'IA Experta'}</span>
                                        {msg.type === 'expert' && <Sparkles className="w-3 h-3 text-yellow-400" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-black/40">
                        <div className="relative">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe una pregunta compleja (ej: ¿Puedo hacer deporte tras la cirugía?)..."
                                className="w-full bg-[#151520] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                            <button className="absolute right-3 top-2.5 p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow-lg">
                                <Zap className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Training Controls */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Continuous Learning Panel */}
                    <div className="bg-[#151520] border border-white/5 rounded-[2rem] p-6 space-y-6 shadow-xl">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-emerald-400" /> Motor de Aprendizaje Continuo
                        </h4>
                        
                        <div className="space-y-4">
                            <LearningToggle 
                                icon={History} 
                                label="Uso de Historial y Contexto" 
                                description="El bot recordará conversaciones previas del lead para personalizar respuestas."
                                active={true}
                            />
                            <LearningToggle 
                                icon={Headphones} 
                                label="Escalar a Humano Automático" 
                                description="Si detecta frustración o dudas de alta complejidad médica, avisará a recepción."
                                active={true}
                            />
                            <LearningToggle 
                                icon={Brain} 
                                label="Razonamiento Multimodal" 
                                description="Entiende audios, imágenes y textos largos con profundidad clínica."
                                active={true}
                            />
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nivel de Madurez IA</span>
                                <span className="text-xs font-black text-emerald-400">88%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '88%' }}
                                    className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reasoning Chain Preview */}
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-6 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                             <Sparkles className="w-4 h-4" /> Memoria de Largo Plazo
                        </h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg h-fit"><Search className="w-3 h-3 text-indigo-400" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-white">Lead 'Inmobiliaria City'</p>
                                    <p className="text-[9px] text-gray-500 italic">"Interés en HoLEP. Última consulta hace 2 meses."</p>
                                </div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg h-fit"><CheckCircle2 className="w-3 h-3 text-emerald-400" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-white">Aprendizaje: Recuperación Láser</p>
                                    <p className="text-[9px] text-gray-500 italic">"Actualizado protocolo: 24h hospitalización."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ icon: Icon, label, color }) {
    return (
        <div className={`px-4 py-2 rounded-xl border border-white/10 ${color} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}>
            <Icon className="w-3 h-3" /> {label}
        </div>
    );
}

function LearningToggle({ icon: Icon, label, description, active }) {
    return (
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/10 text-gray-500'}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-indigo-600' : 'bg-gray-800'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
                </div>
            </div>
            <p className="text-[9px] text-gray-500 leading-normal pl-11">{description}</p>
        </div>
    );
}
