'use client';

import React, { useState } from 'react';
import { 
    Search, TrendingUp, Globe, BarChart2, 
    Layers, ExternalLink, Plus, Eye,
    Activity, Shield, Zap, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrategyFlowInvestigacion() {
    const [competitors, setCompetitors] = useState([
        { id: 1, name: 'Competidor Alpha', funnel: 'Webinar -> High Ticket', strengths: 'Marca Personal fuerte, Copy persuasivo', weaknesses: 'Soporte lento, Producto desactualizado' },
        { id: 2, name: 'Empresa Disruptora', funnel: 'Ads -> Low Ticket -> Upsell', strengths: 'Precio bajo, Gran volumen de tráfico', weaknesses: 'Baja retención, Marca genérica' }
    ]);

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* 1. Header */}
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-400 uppercase tracking-widest">
                            Fase: Inteligencia de Mercado (OSINT)
                        </span>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                            Investigación <span className="text-amber-500">Activa</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                            Analiza el tablero antes de mover tu primera pieza
                        </p>
                    </div>
                    
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                        Analizar Nueva Fuente <Search className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 2. Market Pulse & Trends (Marketing Expert View) */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl text-amber-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Tendencias 2024</h4>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { label: 'Video Marketing (Shorts)', score: 95, color: 'bg-amber-500' },
                                    { label: 'IA Generativa Aplicada', score: 88, color: 'bg-indigo-500' },
                                    { label: 'Comunidades Privadas', score: 72, color: 'bg-purple-500' },
                                    { label: 'Email Marketing Directo', score: 65, color: 'bg-emerald-500' }
                                ].map((trend, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-400">{trend.label}</span>
                                            <span className="text-white">{trend.score}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${trend.color}`} style={{ width: `${trend.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                                <div className="flex gap-4 items-center">
                                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                                    <p className="text-[10px] font-bold text-amber-200 leading-relaxed uppercase tracking-wider">
                                        Oportunidad Detectada: El nicho inmobiliario es el menos digitalizado en el sector IA.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Competitor Benchmarking (Strategic View) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tight italic leading-none">Análisis Ético del <br/> <span className="text-indigo-400 text-lg">Campo de Juego</span></h4>
                                </div>
                                <button className="p-4 rounded-full bg-white text-black hover:scale-105 transition-all"><Plus className="w-5 h-5" /></button>
                            </div>

                            <div className="grid gap-6">
                                {competitors.map((comp, idx) => (
                                    <motion.div 
                                        key={comp.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h5 className="text-lg font-black text-white uppercase italic tracking-tight group-hover:text-amber-400 transition-all">{comp.name}</h5>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Funnel: {comp.funnel}</p>
                                            </div>
                                            <button className="p-2 text-gray-700 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                                    <Activity className="w-3 h-3" /> Fortalezas
                                                </div>
                                                <p className="text-xs font-bold text-gray-500 leading-relaxed">{comp.strengths}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">
                                                    <Eye className="w-3 h-3" /> Vulnerabilidades
                                                </div>
                                                <p className="text-xs font-bold text-gray-500 leading-relaxed">{comp.weaknesses}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Gap Analysis */}
                        <div className="bg-gradient-to-br from-[#0A0A0F] to-indigo-900/40 border border-white/5 rounded-[40px] p-10 flex items-center justify-between">
                            <div className="space-y-2 max-w-lg">
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none italic">TU DIFERENCIAL <br/> <span className="text-indigo-400">DETECTADO</span></h4>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider leading-relaxed">
                                    "La mayoría falla en la educación post-venta. Tu arquitectura incluye un 'Success Path' automatizado que ellos no tienen."
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="p-6 bg-white rounded-[32px] shadow-2xl">
                                    <BarChart2 className="w-12 h-12 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
