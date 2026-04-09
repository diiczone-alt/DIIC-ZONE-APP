'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Clapperboard, Rocket } from 'lucide-react';

const STEPS = [
    { title: "Diagnóstico", desc: "Analizamos tu negocio", icon: Search, color: "text-blue-400" },
    { title: "Estrategia", desc: "Definimos tu nivel", icon: Compass, color: "text-purple-400" },
    { title: "Producción", desc: "Creamos contenido", icon: Clapperboard, color: "text-rose-400" },
    { title: "Escalamiento", desc: "Implementamos sistemas", icon: Rocket, color: "text-emerald-400" }
];

export default function GrowthProcess() {
    return (
        <section className="relative py-20">
            <div className="space-y-16">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4"
                >
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        El Proceso
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight leading-[1.1]">
                        CÓMO <span className="inline-block px-1 text-blue-500">FUNCIONA</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {STEPS.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="group relative"
                        >
                            <div className="p-8 rounded-[40px] bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center space-y-6">
                                <div className={`w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center ${step.color} group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                                        {idx + 1}. {step.title}
                                    </h3>
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
