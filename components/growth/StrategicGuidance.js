'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, TrendingUp, HelpCircle, ChevronRight, Zap } from 'lucide-react';

export default function StrategicGuidance({ config, userName, adaptedLabel }) {
    const mentorship = config.mentorship || {};
    const terms = config.terms || {};

    return (
        <section className="relative px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto p-12 rounded-[48px] bg-gradient-to-br from-[#0a0a20] to-[#050511] border border-white/5 shadow-2xl relative overflow-hidden group"
            >
                {/* Decorative Highlights */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-colors" />
                
                {/* Header: Greeting & Role */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                                {adaptedLabel} {userName || 'Estratega'}
                            </h2>
                            <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Acompañamiento Activo</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-widest italic opacity-80">
                            {mentorship.title}
                        </p>
                    </div>
                    
                    <div className="shrink-0 p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <ShieldCheck className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>
                </div>

                {/* Mentorship Insight Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                    <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                            <div className="flex items-center gap-3 text-blue-400">
                                <HelpCircle className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Visión Estratégica</span>
                            </div>
                            <p className="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed italic">
                                "{mentorship.description}"
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-6 rounded-[28px] bg-emerald-500/5 border border-emerald-500/10 space-y-3 group/tip">
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70">Tip de Facturación</span>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    {mentorship.facturacionTip}
                                </p>
                            </div>
                            
                            <div className="p-6 rounded-[28px] bg-blue-500/5 border border-blue-500/10 space-y-3">
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Target className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/70">Objetivo Principal</span>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Consolidar su {terms.mainObjective} mediante un sistema predecible.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Call to Action / Next Step */}
                    <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center gap-6">
                        <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 shadow-xl space-y-6 group/card">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Próximo Paso</h4>
                                <p className="text-xl font-black italic uppercase tracking-tighter text-white">
                                    Inicie el {terms.protocolLabel}
                                </p>
                            </div>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                Su consultor está listo para guiarle en la transición al siguiente nivel de autoridad.
                            </p>
                            <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                {terms.ctaLabel}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 py-4 px-8 rounded-full bg-white/5 border border-white/5">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500">Mentoría 1-a-1 Disponible</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
