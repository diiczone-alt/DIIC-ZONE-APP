'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Award, Sparkles, Shield } from 'lucide-react';

const PLANS = [
    {
        name: "PLAN PRESENCIA",
        basePrice: 250,
        baseSetup: 50,
        features: ["2 videos / reel", "4 post / carruseles", "Estrategia de contenido", "Pauta (pagado por el cliente)", "Gestión de calendario", "Producción filmmaker"],
        desc: "Ideal para iniciar y organizar tu marca",
        color: "text-blue-400",
        border: "border-blue-500/20 text-blue-500",
        bg: "bg-blue-500/10",
        glow: "shadow-blue-500/20",
        icon: Sparkles
    },
    {
        name: "PLAN CRECIMIENTO",
        basePrice: 350,
        baseSetup: 50,
        features: ["4 videos / reel", "8 post / carruseles", "Estrategia de contenido", "Pauta (pagado por el cliente)", "Gestión de calendario", "Producción filmmaker"],
        desc: "Ideal para crecer y generar interacción",
        color: "text-yellow-400",
        border: "border-yellow-500/30 text-yellow-500",
        bg: "bg-yellow-500/10",
        glow: "shadow-yellow-500/20",
        icon: Zap,
        popular: true
    },
    {
        name: "PLAN AUTORIDAD",
        basePrice: 500,
        baseSetup: 50,
        features: ["6 videos / reel", "12 post / carruseles", "Estrategia de contenido avanzado", "Gestión completa", "Producción filmmaker (1 - 2 Sesiones)"],
        desc: "Ideal para posicionarte fuerte",
        color: "text-rose-400",
        border: "border-rose-500/40 text-rose-500",
        bg: "bg-rose-500/10",
        glow: "shadow-rose-500/20",
        icon: Award
    },
    {
        name: "PLAN ÉLITE",
        basePrice: 900,
        baseSetup: 50,
        features: ["12 videos / reel", "16 post / carruseles", "Estrategia avanzada de contenido", "Gestión completa de calendario", "Producción completa filmmaker"],
        desc: "Dominio total del mercado y viralidad",
        color: "text-purple-400",
        border: "border-purple-500/40 text-purple-500",
        bg: "bg-purple-500/10",
        glow: "shadow-purple-500/20",
        icon: Star
    }
];

export default function GrowthPricing() {
    return (
        <section className="relative py-20 bg-transparent">
            <div className="space-y-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4"
                >
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Planes Estratégicos
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight leading-[1.1]">
                        PENSADO A <span className="inline-block px-1 text-blue-500 font-black">LARGO PLAZO</span>
                    </h2>
                    
                    <div className="flex justify-center pt-2">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full shadow-xl">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
                                Contrato mínimo: <strong className="text-white font-black">3 MESES</strong>
                            </span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                    {PLANS.map((plan, idx) => {
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group relative p-6 md:p-8 rounded-[32px] border transition-all duration-500 bg-[#070710] hover:bg-[#0A0A16] ${plan.border} hover:scale-[1.03] hover:shadow-2xl ${plan.glow} overflow-hidden flex flex-col`}
                            >
                                {/* Glow sutil interno */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${plan.bg} blur-[60px] rounded-full opacity-30 pointer-events-none`} />

                                {plan.popular && (
                                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-yellow-500 text-black text-[7px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-yellow-500/20">
                                        Recomendado
                                    </div>
                                )}

                                <div className="space-y-5 flex-1 relative z-10">
                                    <div className="space-y-1.5">
                                        <div className={`p-2.5 rounded-xl bg-white/5 w-fit border border-white/5 ${plan.color}`}>
                                            <plan.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className={`text-xl font-black italic uppercase tracking-tighter ${plan.color} leading-none pt-2`}>
                                            {plan.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
                                            {plan.desc}
                                        </p>
                                    </div>

                                    <div className="py-4 border-y border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-3xl lg:text-4xl font-black text-white italic tracking-tighter transition-all duration-300">
                                                    ${plan.basePrice}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">+ IVA / mes</span>
                                            </div>
                                        </div>
                                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                                            <span>Setup y Onboarding:</span>
                                            <span className="text-gray-300">
                                                ${plan.baseSetup}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-[9px] font-black uppercase text-gray-600 tracking-[0.3em]">
                                            Incluye:
                                        </div>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, fidx) => (
                                                <li key={fidx} className="flex items-start gap-2.5">
                                                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-white/5 border border-white/5 ${plan.color}`}>
                                                        <Check className="w-2.5 h-2.5" />
                                                    </div>
                                                    <span className="text-[11px] font-medium text-gray-300 tracking-tight leading-tight pt-px">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-8 relative z-10">
                                    <button 
                                        onClick={() => window.open(`https://wa.me/5491100000000?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(plan.name)}.%20Quiero%20comenzar%20con%20el%20plan%20de%20${duration}%20meses.`, '_blank')}
                                        className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl border ${
                                            plan.popular 
                                            ? 'bg-white border-white text-black hover:bg-white/90 scale-105' 
                                            : `bg-[#0A0A12] border-white/10 text-white hover:border-white/30 hover:bg-white/5 active:scale-95`
                                        }`}
                                    >
                                        Invertir Ahora
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
