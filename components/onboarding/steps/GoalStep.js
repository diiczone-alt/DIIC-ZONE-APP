'use client';

import { useState } from 'react';
import { TrendingUp, Users, Award, Zap, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GoalStep({ onNext, updateData }) {
    const goals = [
        { id: 'clients', label: 'Conseguir más clientes', icon: Users, desc: 'Aumentar mi cartera y citas.' },
        { id: 'sales', label: 'Vender más', icon: DollarSign, desc: 'Incrementar facturación y cierre.' },
        { id: 'authority', label: 'Posicionarme como experto', icon: Award, desc: 'Crear marca personal sólida.' },
        { id: 'automate', label: 'Automatizar mi negocio', icon: Zap, desc: 'Ahorrar tiempo con sistemas.' },
        { id: 'scale', label: 'Escalar mi marca', icon: TrendingUp, desc: 'Crecer a nuevos mercados.' }
    ];

    const [selectedGoals, setSelectedGoals] = useState([]);

    const toggleGoal = (id) => {
        if (selectedGoals.includes(id)) {
            setSelectedGoals(prev => prev.filter(x => x !== id));
        } else {
            setSelectedGoals(prev => [...prev, id]);
        }
    };

    const handleContinue = () => {
        if (selectedGoals.length === 0) return;
        updateData({ goals: selectedGoals });
        onNext();
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto w-full space-y-6">
            <div className="text-center mb-6 space-y-2">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">¿Qué quieres lograr?</h2>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Selecciona uno o más objetivos para enfocar a tu equipo creativo.</p>
            </div>

            <div className="grid gap-3 flex-1 overflow-y-auto custom-scrollbar pb-6 content-start w-full">
                {goals.map((g) => {
                    const isSelected = selectedGoals.includes(g.id);
                    return (
                        <button
                            key={g.id}
                            type="button"
                            onClick={() => toggleGoal(g.id)}
                            className={`group flex items-center gap-6 p-5 rounded-2xl border transition-all text-left relative overflow-hidden w-full ${
                                isSelected 
                                    ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.15)]' 
                                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className={`p-3.5 rounded-xl transition-all ${
                                isSelected 
                                    ? 'bg-indigo-500 text-white' 
                                    : 'bg-[#0A0A12] text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-300'
                            }`}>
                                <g.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold transition-all ${isSelected ? 'text-indigo-400' : 'text-white'}`}>{g.label}</h3>
                                <p className="text-gray-500 text-xs font-medium mt-0.5">{g.desc}</p>
                            </div>
                            
                            <div className="ml-auto flex items-center gap-2">
                                {isSelected ? (
                                    <motion.div 
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-white fill-indigo-500" />
                                    </motion.div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-indigo-500/50 transition-colors" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-white/5 w-full">
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={selectedGoals.length === 0}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                    Establecer Objetivos Estratégicos <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
