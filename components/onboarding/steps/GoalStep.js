'use client';

import { useState } from 'react';
import { TrendingUp, Users, Award, Zap, DollarSign, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GoalStep({ onNext, updateData }) {
    const goals = [
        { id: 'clients', label: 'Conseguir más clientes', icon: Users, desc: 'Aumentar mi cartera y captar prospectos.' },
        { id: 'sales', label: 'Vender más', icon: DollarSign, desc: 'Incrementar mi facturación y tasa de cierre.' },
        { id: 'authority', label: 'Posicionarme como experto', icon: Award, desc: 'Construir una marca personal sólida y con autoridad.' },
        { id: 'automate', label: 'Automatizar procesos', icon: Zap, desc: 'Optimizar operaciones y ahorrar tiempo con sistemas.' },
        { id: 'scale', label: 'Escalar mi marca', icon: TrendingUp, desc: 'Llevar mi negocio a nuevos niveles y mercados.' },
        { id: 'organize', label: 'Organizar mi empresa', icon: Briefcase, desc: 'Estructurar mi equipo, tareas y recursos eficientemente.' }
    ];

    const handleSelect = (id) => {
        updateData({ 
            main_goal: id,
            goal: id,
            goals: [id]
        });
        onNext();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full space-y-6">
            <div className="text-center mb-6 space-y-2">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Define tu objetivo principal</h2>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">DIIC ZONE adaptará su ruta estratégica para alcanzar esta meta primero.</p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-3 flex-1 overflow-y-auto custom-scrollbar pb-6 content-start w-full"
            >
                {goals.map((g) => {
                    return (
                        <motion.button
                            key={g.id}
                            variants={itemVariants}
                            type="button"
                            onClick={() => handleSelect(g.id)}
                            className="group flex items-center gap-6 p-5 rounded-2xl border transition-all text-left relative overflow-hidden w-full border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)]"
                        >
                            {/* Background Glow on Hover */}
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                            <div className="p-3.5 rounded-xl transition-all bg-[#0A0A12] text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white flex-shrink-0">
                                <g.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-indigo-400">{g.label}</h3>
                                <p className="text-gray-500 text-xs font-medium mt-0.5">{g.desc}</p>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
