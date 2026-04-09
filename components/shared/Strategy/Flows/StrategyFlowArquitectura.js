'use client';

import React from 'react';
import { 
    Layers, Zap, Target, ArrowDown, 
    MousePointer2, MessageSquare, 
    CreditCard, Users, Link, 
    ShieldCheck, Sparkles, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrategyFlowArquitectura() {
    const funnelStages = [
        { 
            id: 'top', 
            label: 'Tráfico & Atracción (TOFU)', 
            desc: 'Entrada masiva de leads cualificados',
            icon: Users,
            color: 'text-blue-400',
            borderColor: 'border-blue-500/20',
            bgColor: 'bg-blue-500/5',
            items: ['Meta Ads', 'SEO Content', 'Viral Reels', 'YouTube Ads']
        },
        { 
            id: 'mid', 
            label: 'Consideración & Nutrición (MOFU)', 
            desc: 'Demostración de autoridad y valor',
            icon: Target,
            color: 'text-purple-400',
            borderColor: 'border-purple-500/20',
            bgColor: 'bg-purple-500/5',
            items: ['Email Sequences', 'Lead Magnet', 'Webinar', 'Blog Case Studies']
        },
        { 
            id: 'bottom', 
            label: 'Conversión & Venta (BOFU)', 
            desc: 'Cierre y monetización del activo',
            icon: CreditCard,
            color: 'text-emerald-400',
            borderColor: 'border-emerald-500/20',
            bgColor: 'bg-emerald-500/5',
            items: ['Sales Page', 'Checkout', 'Upsell Strategy', 'Referral Loop']
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* 1. Header */}
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                            Fase: Ingeniería de Conversión
                        </span>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                            Arquitectura <span className="text-indigo-500">del Sistema</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                            Maqueta el motor que impulsa tu crecimiento exponencial
                        </p>
                    </div>
                </div>

                {/* 2. Structured Funnel View (Expert Design) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                    {funnelStages.map((stage, idx) => (
                        <motion.div 
                            key={stage.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className={`relative p-10 rounded-[48px] border-2 ${stage.borderColor} ${stage.bgColor} space-y-8 group hover:scale-[1.02] transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`p-4 rounded-2xl bg-white/5 ${stage.color}`}>
                                    <stage.icon className="w-8 h-8" />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">Etapa 0{idx + 1}</span>
                                    <div className="flex gap-1 mt-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`h-1 w-4 rounded-full ${i <= idx + 1 ? stage.color.replace('text', 'bg') : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white leading-none uppercase italic tracking-tight italic mb-2">{stage.label}</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stage.desc}</p>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5">
                                {stage.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-4 bg-black/20 rounded-2xl border border-white/5 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-white hover:border-white/10 transition-all cursor-pointer">
                                        <div className={`w-1.5 h-1.5 rounded-full ${stage.color.replace('text', 'bg')}`} />
                                        {item}
                                    </div>
                                ))}
                            </div>

                            {/* Connector Arrow for LG */}
                            {idx < 2 && (
                                <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white/5 border border-white/10 rounded-full items-center justify-center z-20 text-indigo-500">
                                    <ArrowDown className="-rotate-90 w-5 h-5" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* 3. Global Logic Overview (Traffic & Conversion) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-8 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Filter className="w-6 h-6 text-indigo-500" />
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Cálculo de Fugas (Leakage)</h4>
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                Evalúa dónde estás perdiendo clientes en tu arquitectura actual.
                            </p>
                        </div>
                        <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl text-center space-y-4 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-8 h-8 text-indigo-500" />
                             </div>
                             <span className="text-indigo-400 text-4xl font-black italic italic leading-none">-18%</span>
                             <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Fuga crítica detectada en el Checkout Page</p>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 flex flex-col justify-between">
                         <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <Zap className="w-6 h-6 text-emerald-400" />
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Potencial de Escalamiento</h4>
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                Capacidad instalada de tu arquitectura para absorber tráfico masivo sin romperse.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Saturación</span>
                                <span className="text-lg font-black text-white uppercase">Baja (22%)</span>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Margen Escalable</span>
                                <span className="text-lg font-black text-emerald-400 uppercase">Alto (4.5x)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Infrastructure Visual (Symbolic) */}
                <div className="flex flex-col items-center py-12 gap-6 opacity-30 group cursor-default">
                    <Layers className="w-12 h-12 text-indigo-500/50 group-hover:scale-110 group-hover:text-indigo-500 transition-all duration-700" />
                    <div className="flex gap-4">
                        <div className="h-0.5 w-12 bg-white/10" />
                        <div className="h-0.5 w-12 bg-indigo-500/30" />
                        <div className="h-0.5 w-12 bg-white/10" />
                    </div>
                    <p className="text-[8px] font-black text-gray-800 uppercase tracking-[0.8em]">Architectural Integrity Verified</p>
                </div>
            </div>
        </div>
    );
}
