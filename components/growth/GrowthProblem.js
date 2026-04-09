'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Target, AlertTriangle, ZapOff } from 'lucide-react';

const PROBLEMS = [
    { text: "Publicas sin estrategia", icon: ZapOff },
    { text: "No conviertes seguidores en clientes", icon: Target },
    { text: "Pierdes oportunidades por falta de organización", icon: AlertTriangle },
    { text: "No tienes un sistema de crecimiento", icon: XCircle }
];

export default function GrowthProblem() {
    return (
        <section className="relative py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[9px] font-black text-rose-400 uppercase tracking-widest">
                        El Problema
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight leading-[1.1]">
                        ¿POR QUÉ TU NEGOCIO NO ESTÁ CRECIENDO <span className="inline-block px-1 text-rose-500 underline decoration-rose-500/30">COMO DEBERÍA?</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {PROBLEMS.map((problem, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-6"
                        >
                            <div className="w-12 h-12 rounded-xl bg-rose-500/5 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                <problem.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold uppercase tracking-tight text-gray-300 group-hover:text-white transition-colors">
                                {problem.text}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-black text-center text-white italic uppercase tracking-tighter pt-10"
                >
                    EL PROBLEMA NO ES EL CONTENIDO, ES LA <span className="text-rose-500">FALTA DE ESTRUCTURA.</span>
                </motion.p>
            </div>
        </section>
    );
}
