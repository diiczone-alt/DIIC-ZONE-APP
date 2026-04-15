'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, DollarSign, TrendingUp, MessageCircle, Users, ShoppingBag, Send, CreditCard, ChevronRight } from 'lucide-react';

export default function AdsManager() {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hola, soy tu estratega de pauta. ¿Qué objetivo deseas lograr con tu inversión de hoy?' }
    ]);
    const [budget, setBudget] = useState('');
    const [objective, setObjective] = useState(null);

    const OBJECTIVES = [
        { id: 'messages', icon: MessageCircle, label: 'Más Mensajes', detail: 'WhatsApp / DM' },
        { id: 'followers', icon: Users, label: 'Más Seguidores', detail: 'Comunidad' },
        { id: 'sales', icon: ShoppingBag, label: 'Más Ventas', detail: 'Conversión' },
        { id: 'reach', icon: TrendingUp, label: 'Más Alcance', detail: 'Brand Aware' },
    ];

    const CAMPAIGNS = [
        { id: 1, name: 'Promo Black Friday', status: 'active', spend: '$450', results: '1.2k Clics', roi: '+3.5x', platform: 'Meta' },
        { id: 2, name: 'Reel Viral Boost', status: 'completed', spend: '$120', results: '45k Vistas', roi: '+2.1x', platform: 'TikTok' },
    ];

    const handleSend = () => {
        if (!budget) return;

        const userMsg = { role: 'user', text: `Quiero invertir $${budget} para conseguir ${objective ? objective.label : 'resultados'}.` };
        setMessages(prev => [...prev, userMsg]);
        setBudget('');

        // Simulate AI Logic
        setTimeout(() => {
            const aiMsg = {
                role: 'assistant',
                text: `Entendido. Con un presupuesto de $${budget} para ${objective ? objective.label : 'ese objetivo'}, te sugiero:`,
                suggestion: true
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-full">

            {/* Left: Campaign Monitor */}
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0E0E18] p-6 rounded-2xl border border-white/5">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Inversión Mensual</div>
                        <div className="text-3xl font-black text-white">$1,250</div>
                        <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs mes pasado</div>
                    </div>
                    <div className="bg-[#0E0E18] p-6 rounded-2xl border border-white/5">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Retorno (ROAS)</div>
                        <div className="text-3xl font-black text-white">4.2x</div>
                        <div className="text-xs text-gray-500 mt-1">Excelente rendimiento</div>
                    </div>
                </div>

                <div className="bg-[#0E0E18] rounded-3xl border border-white/5 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-6">Campañas Activas</h3>
                    <div className="space-y-4">
                        {CAMPAIGNS.map(camp => (
                            <div key={camp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${camp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                        <span className="text-white font-bold text-sm">{camp.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex gap-3">
                                        <span>{camp.platform}</span>
                                        <span>•</span>
                                        <span>{camp.results}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold">{camp.spend}</div>
                                    <div className="text-xs text-emerald-400 font-bold">ROAS {camp.roi}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
                        + Nueva Campaña
                    </button>
                </div>
            </div>

            {/* Right: AI Strategy Assistant */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-1 flex flex-col h-[600px] lg:h-auto">
                <div className="bg-[#151520] rounded-[20px] p-6 flex-1 flex flex-col relative overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Asistente de Pauta</h3>
                            <p className="text-xs text-gray-400">Optimiza tu presupuesto con IA</p>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-fuchsia-600' : 'bg-indigo-600'}`}>
                                    {msg.role === 'user' ? <Users className="w-4 h-4 text-white" /> : <Target className="w-4 h-4 text-white" />}
                                </div>
                                <div className="space-y-2 max-w-[80%]">
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-fuchsia-600 text-white rounded-tr-none'
                                            : 'bg-[#0E0E18] text-gray-300 border border-white/5 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>

                                    {/* AI Suggestion Card */}
                                    {msg.suggestion && (
                                        <div className="bg-[#0E0E18] border border-indigo-500/30 rounded-2xl p-4 mt-2">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-indigo-400 uppercase">Estrategia Recomendada</span>
                                                <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded">Confianza 94%</span>
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm text-gray-400">
                                                    <span>Formato:</span> <span className="text-white font-bold">Reels + Stories</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-400">
                                                    <span>Duración:</span> <span className="text-white font-bold">5 días</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-400">
                                                    <span>Audiencia:</span> <span className="text-white font-bold">Intereses Similares</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
                                                <div className="text-xs text-gray-400 mb-1">Proyección de Resultados</div>
                                                <div className="text-lg font-black text-emerald-400">+2,400 <span className="text-xs font-normal text-gray-400">Interacciones est.</span></div>
                                            </div>
                                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-bold transition-colors">
                                                Aprobar y Lanzar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                        {!objective && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {OBJECTIVES.map(obj => (
                                    <button
                                        key={obj.id}
                                        onClick={() => setObjective(obj)}
                                        className="p-3 bg-[#0E0E18] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 rounded-xl transition-all text-left group"
                                    >
                                        <obj.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 mb-2 transition-colors" />
                                        <div className="text-xs font-bold text-white leading-tight">{obj.label}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="bg-[#0E0E18] p-2 rounded-xl border border-white/5 flex items-center gap-2">
                            <div className="relative">
                                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="number"
                                    placeholder="Presupuesto"
                                    className="w-24 bg-[#151520] rounded-lg pl-8 pr-2 py-2 text-sm text-white focus:outline-none"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder={objective ? `Objetivo: ${objective.label}...` : "Selecciona un objetivo arriba..."}
                                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                                disabled={!objective}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!budget || !objective}
                                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
