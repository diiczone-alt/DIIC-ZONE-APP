'use client';

import React, { useState } from 'react';
import { 
    Users, Heart2, Brain, Coffee, 
    MessageSquare, AlertCircle, Plus, 
    ArrowRight, UserCheck, Lightbulb, 
    Frown, Smile
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrategyFlowDescubrimiento() {
    const [avatar, setAvatar] = useState({
        name: 'Roberto El Emprendedor Solitario',
        age: 35,
        income: '$50k - $80k / año',
        role: 'Consultor Independiente / Agente Inmobiliario',
        pains: [
            'No tiene tiempo para crear contenido constante.',
            'Siente que la tecnología de IA es demasiado compleja.',
            'Su funnel actual no convierte leads de calidad.'
        ],
        desires: [
            'Automatizar su prospección al 90%.',
            'Ser percibido como una autoridad en su nicho.',
            'Escalar su facturación sin trabajar más horas.'
        ]
    });

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* 1. Header */}
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                            Fase: Entendimiento del Mercado
                        </span>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                            Descubrimiento <span className="text-cyan-500">del Cliente</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                            Construye el perfil psicológico de tu audiencia ideal
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 2. Avatar Profile Card (Marketing Expert View) */}
                    <div className="lg:col-span-1 bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 blur-[60px] group-hover:bg-cyan-500/20 transition-all" />
                        
                        <div className="relative space-y-8 text-center pt-4">
                            <div className="w-32 h-32 rounded-full border-4 border-cyan-500/30 flex items-center justify-center bg-cyan-500/5 mx-auto p-1">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center">
                                    <Users className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight italic leading-none">{avatar.name}</h3>
                                <div className="flex justify-center gap-3">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{avatar.age} años</span>
                                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">{avatar.income}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4 text-left">
                                <div className="flex items-center gap-3">
                                    <Brain className="w-4 h-4 text-gray-600" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{avatar.role}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Coffee className="w-4 h-4 text-gray-600" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estilo de Vida: Optimización</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Psychographic Analysis (Deep Marketing) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Pains & Symptoms */}
                        <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Frown className="w-6 h-6 text-red-500" />
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Puntos de Dolor (Pains)</h4>
                                </div>
                                <button className="p-2 rounded-xl bg-white/5 text-gray-600 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {avatar.pains.map((pain, idx) => (
                                    <div key={idx} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 flex gap-4 items-start">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">{pain}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desires & Gains */}
                        <div className="bg-[#0A0A0F] border border-white/5 rounded-[40px] p-10 space-y-6 text-right">
                            <div className="flex items-center justify-between flex-row-reverse">
                                <div className="flex items-center gap-4 flex-row-reverse">
                                    <Smile className="w-6 h-6 text-emerald-500" />
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Deseos & Transformación</h4>
                                </div>
                                <button className="p-2 rounded-xl bg-white/5 text-gray-600 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {avatar.desires.map((desire, idx) => (
                                    <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex gap-4 items-start text-left">
                                        <UserCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">{desire}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Solution Mirroring (Professional Alignment) */}
                <div className="bg-cyan-600 rounded-[48px] p-12 flex flex-col items-center text-center space-y-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-indigo-700 pointer-events-none" />
                    
                    <div className="relative space-y-4 max-w-2xl">
                        <Lightbulb className="w-12 h-12 text-white/40 mx-auto" />
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter italic">
                            Alineación de <br/> <span className="text-white/60">Solución Maestro</span>
                        </h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                            "Tu producto no es una herramienta, es el vehículo que lleva a {avatar.name} de su frustración actual a su libertad soñada."
                        </p>
                    </div>

                    <div className="relative flex gap-4">
                        <div className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest">
                            Angulo: Eficiencia Radical
                        </div>
                        <div className="px-8 py-4 bg-white text-cyan-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer">
                            Refinar Propuesta Única
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
