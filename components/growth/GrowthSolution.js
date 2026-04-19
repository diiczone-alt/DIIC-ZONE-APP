'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Layers, Activity, Users, Zap } from 'lucide-react';

const SOLUTIONS = [
    { text: "Presencia", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { text: "Crecimiento", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
    { text: "Autoridad", icon: Layers, color: "text-purple-400", bg: "bg-purple-500/10" },
    { text: "Sistemas", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
    { text: "Escala", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" }
];

export default function GrowthSolution({ config }) {
    const terms = config?.terms || {};

    return (
        <section className="relative py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4 text-right px-2"
                >
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                        Nuestra Solución
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white italic tracking-tight leading-[1.1] pb-2 uppercase">
                        {terms.strategyLabel} <span className="inline-block px-1 text-emerald-500 underline decoration-emerald-500/30 font-black">DIIC ZONE</span>
                    </h2>
                    <p className="text-gray-400 text-lg font-bold uppercase tracking-widest max-w-xl ml-auto pt-4 leading-relaxed">
                        Trabajamos con un proceso estructurado que permite escalar tu marca paso a paso.
                    </p>
                </motion.div>

                <div className="flex flex-wrap items-center justify-center gap-6">
                    {SOLUTIONS.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group flex flex-col items-center gap-4 min-w-[140px]"
                        >
                            <div className={`w-20 h-20 rounded-[28px] ${item.bg} border border-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-xl`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                                {item.text}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
