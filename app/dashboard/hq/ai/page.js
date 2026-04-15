'use client';

import { useState } from 'react';
import HQSidebar from '@/components/layout/HQSidebar';
import {
    Sparkles, BrainCircuit, ArrowRight, Target,
    TrendingUp, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StrategicAIPage() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hola Admin. Soy la IA Estratégica de DIIC ZONE. Analizo tus datos operativos para darte recomendaciones de crecimiento. ¿Qué quieres saber hoy?' }
    ]);

    // Strategic Insights Feed (Mock)
    const insights = [
        { title: 'Oportunidad de Escalamiento', desc: 'El cliente "Clínica Smith" tiene un margen del 62% y capacidad de inversión. Recomiendo ofrecer el paquete "Content Scale 2.0".', type: 'growth' },
        { title: 'Eficiencia Operativa', desc: 'El departamento de Audio está subutilizado (40%). Podríamos lanzar una promo de Podcast para equilibrar la carga.', type: 'efficiency' },
        { title: 'Predicción de Churn', desc: 'Power Gym ha reducido su interacción un 40% este mes. Riesgo de cancelación. Programa una reunión de seguimiento.', type: 'risk' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setMessages([...messages, { role: 'user', content: query }]);
        setQuery('');
        // Mock response simulation would go here
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Analizando base de datos global... (Simulación: Aquí la IA respondería con datos reales)' }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            <HQSidebar />
            <div className="pl-64 h-screen flex flex-col">
                <header className="h-20 shrink-0 border-b border-white/5 flex items-center px-8 bg-[#050511]/80 backdrop-blur-xl z-40">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" /> DIIC AI Estratégica
                    </h2>
                </header>

                <main className="flex-1 p-8 max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">

                    {/* Left: Chat Interface */}
                    <div className="lg:col-span-2 flex flex-col bg-[#0E0E18] rounded-3xl border border-white/5 overflow-hidden">
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                                                <BrainCircuit className="w-3 h-3" /> DIIC Mind
                                            </div>
                                        )}
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/5">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Pregunta sobre rentabilidad, carga de equipo o estrategia..."
                                    className="w-full bg-[#050511] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-white">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Insights Feed */}
                    <div className="space-y-6 overflow-y-auto pr-2">
                        <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs flex items-center gap-2">
                            <Target className="w-4 h-4" /> Insights Proactivos
                        </h3>

                        {insights.map((insight, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="p-5 rounded-2xl bg-gradient-to-br from-[#0E0E18] to-[#151525] border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${insight.type === 'growth' ? 'bg-green-500/10 text-green-400' :
                                            insight.type === 'efficiency' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-red-500/10 text-red-400'
                                        }`}>
                                        {insight.type}
                                    </span>
                                    <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h4 className="font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                    {insight.title}
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {insight.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
}
