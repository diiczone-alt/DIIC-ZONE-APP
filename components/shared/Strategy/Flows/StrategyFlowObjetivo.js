'use client';

import React, { useState } from 'react';
import { 
    Target, Flag, Star, Sun, 
    CheckCircle2, Plus, Trash2, Edit3,
    Trophy, Compass, Rocket, Anchor
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrategyFlowObjetivo() {
    const [goals, setGoals] = useState([
        { id: 1, text: 'Facturar $50k USD en el próximo trimestre con el servicio High Ticket.', completed: false, type: 'SMART' },
        { id: 2, text: 'Posicionarme como el referente #1 de IA en el nicho inmobiliario de habla hispana.', completed: false, type: 'Visión' },
        { id: 3, text: 'Reducir el Costo por Lead (CPL) a menos de $1.50 mediante optimización de creativos.', completed: true, type: 'Métrica' }
    ]);

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* 1. Header */}
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black text-purple-400 uppercase tracking-widest">
                            Fase: Claridad Estratégica
                        </span>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                            Objetivo <span className="text-purple-500">Maestro</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                            Define el Norte de tu negocio con precisión quirúrgica
                        </p>
                    </div>
                    
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                        Añadir Meta <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. The North Star Metric (Focus of Marketing Experts) */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[48px] p-12 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                        <Star className="w-40 h-40 text-white" />
                    </div>
                    
                    <div className="relative max-w-2xl space-y-4">
                        <div className="flex items-center gap-3 text-white/60">
                            <Anchor className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Métrica Estrella Alerta (North Star)</span>
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
                            RECURRENCIA DE <br/> <span className="text-white/80">CLIENTES HIGH-TICKET</span>
                        </h3>
                        <p className="text-white/60 text-sm font-medium leading-relaxed">
                            Esta es la métrica que realmente mueve la aguja en tu negocio. Todo tu ecosistema estratégico debe empujar esta cifra hacia arriba.
                        </p>
                    </div>
                </div>

                {/* 3. Global Vision Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-amber-500">
                                <Sun className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Visión de Marca</h4>
                        </div>
                        <textarea 
                            className="w-full bg-transparent border-none text-gray-400 font-medium leading-relaxed focus:outline-none resize-none h-32 text-sm italic"
                            placeholder="Describe el impacto que tu negocio tendrá en 5 años..."
                            defaultValue="Ser la plataforma líder que empodera a creadores y dueños de negocio mediante arquitecturas de IA automatizadas, eliminando la fricción técnica y permitiendo que se enfoquen en la creatividad real."
                        />
                    </div>

                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-cyan-400">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Propósito (WHY)</h4>
                        </div>
                        <textarea 
                            className="w-full bg-transparent border-none text-gray-400 font-medium leading-relaxed focus:outline-none resize-none h-32 text-sm italic"
                            placeholder="¿Por qué haces lo que haces? (Simón Sinek style)"
                            defaultValue="Democratizar el acceso a estrategias de marketing de élite a través de tecnología accesible, para que cualquier visión con propósito pueda escalar y dominar su mercado."
                        />
                    </div>
                </div>

                {/* 4. SMART Goals List (Professional Execution) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Flag className="w-6 h-6 text-indigo-500" />
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Metas de Ejecución (Q1 - 2024)</h4>
                    </div>

                    <div className="grid gap-4">
                        {goals.map((goal, idx) => (
                            <motion.div 
                                key={goal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group flex items-center justify-between p-6 rounded-[28px] border transition-all ${
                                    goal.completed 
                                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-6">
                                    <button 
                                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                            goal.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-gray-700 text-transparent hover:border-white/40'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <div className="space-y-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${goal.completed ? 'text-emerald-500' : 'text-gray-600'}`}>
                                            [{goal.type}]
                                        </span>
                                        <p className={`text-sm font-bold transition-all ${goal.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                            {goal.text}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="p-3 rounded-xl bg-white/5 text-gray-600 hover:text-white transition-all">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button className="p-3 rounded-xl bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 5. Motivational / Status Banner */}
                <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                        <Trophy className="w-12 h-12 text-indigo-500/20 mx-auto" />
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">"Tu estrategia es tan fuerte como la claridad de tu ejecución"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
