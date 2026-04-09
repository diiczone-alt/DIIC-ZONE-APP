'use client';

import React from 'react';
import { 
    BarChart3, TrendingUp, Users, Target, 
    Sparkles, ArrowRight, Zap, Shield, 
    Activity, Globe, MousePointer2, PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrategyFlowResumen({ strategyData }) {
    const kpis = [
        { label: 'Alcance Estimado', value: '125K', change: '+12%', icon: Users, color: 'text-blue-400' },
        { label: 'CTR Proyectado', value: '4.8%', change: '+0.5%', icon: MousePointer2, color: 'text-indigo-400' },
        { label: 'Costo por Lead', value: '$2.40', change: '-15%', icon: Activity, color: 'text-emerald-400' },
        { label: 'ROAS Objetivo', value: '5.2x', change: 'Estable', icon: Zap, color: 'text-amber-400' }
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* 1. Header & Quick Status */}
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                Vista Experta: Trafficker & Marketing
                            </span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                            Resumen del <span className="text-indigo-500">Ecosistema</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                            Análisis de alto nivel de tu arquitectura de negocio actual
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Salud de Estrategia</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[85%]" />
                                </div>
                                <span className="text-xs font-black text-white">85%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpis.map((kpi, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[32px] hover:border-white/10 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-white/5 rounded-2xl ${kpi.color}`}>
                                    <kpi.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-black ${kpi.change.startsWith('+') ? 'text-emerald-500' : kpi.change.startsWith('-') ? 'text-blue-500' : 'text-gray-500'}`}>
                                    {kpi.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{kpi.value}</h3>
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{kpi.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 3. Architecture Visualization Preview */}
                    <div className="lg:col-span-2 bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
                        
                        <div className="relative space-y-8">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Estructura de Conversión</h4>
                                <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                    Ver Pizarra Completa <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="flex items-center justify-around py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 group-hover:scale-110 transition-all">
                                        <Globe className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tráfico</span>
                                </div>
                                <div className="h-px w-20 bg-gradient-to-r from-indigo-500/50 to-purple-500/50" />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 flex items-center justify-center bg-purple-500/5 group-hover:scale-110 transition-all">
                                        <TrendingUp className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nutrición</span>
                                </div>
                                <div className="h-px w-20 bg-gradient-to-r from-purple-500/50 to-emerald-500/50" />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/5 group-hover:scale-110 transition-all">
                                        <Shield className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Conversión</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. AI Strategic Insights */}
                    <div className="bg-indigo-600 rounded-[40px] p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <Sparkles className="w-12 h-12 text-white/20" />
                        </div>
                        
                        <div className="relative space-y-6">
                            <h4 className="text-2xl font-black text-white leading-none uppercase italic tracking-tighter">
                                Insights del <br/> <span className="text-white/60 text-lg">DIIC AI Auditor</span>
                            </h4>
                            
                            <div className="space-y-4">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <p className="text-[11px] font-bold text-white/90 leading-relaxed">
                                        "Tu fase de tráfico orgánico está saturada. Sugerimos derivar presupuesto a YouTube Ads para escalar la fase de Autoridad."
                                    </p>
                                </div>
                                <div className="bg-black/10 rounded-2xl p-4 border border-black/5">
                                    <p className="text-[11px] font-bold text-white/70 leading-relaxed">
                                        "Falta un 'Downsell' en tu oferta principal. Podrías aumentar el LTV un 22% añadiendo un servicio recurrente."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                            Solicitar Auditoría Full
                        </button>
                    </div>
                </div>

                {/* 5. Channel Distribution (Traffic Expert View) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <PieChart className="w-6 h-6 text-indigo-500" />
                            <h4 className="text-xl font-black text-white uppercase italic">Distribución de Tráfico</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'Instagram Orgánico', value: 45, color: 'bg-indigo-500' },
                                { name: 'YouTube Content', value: 30, color: 'bg-purple-500' },
                                { name: 'Paid Ads (Meta)', value: 15, color: 'bg-emerald-500' },
                                { name: 'Referidos / Otros', value: 10, color: 'bg-gray-700' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-400">{item.name}</span>
                                        <span className="text-white">{item.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 flex flex-col justify-center gap-8">
                        <div className="text-center space-y-2">
                            <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Fase Actual Diic Zone</h5>
                            <p className="text-4xl font-black text-white uppercase italic tracking-tighter italic">MARKET <span className="text-indigo-500">DOMINATION</span></p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                Scalability: OK
                            </div>
                            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest text-indigo-400">
                                Velocity: Fast
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
