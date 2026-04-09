'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Target, Calendar, Video, Layout, Instagram, 
    Sparkles, ArrowRight, ChevronLeft, ChevronRight,
    Trophy, Rocket, Heart, Zap, Users, ShieldCheck, 
    Briefcase, Activity, Layers, Star, Plus, Minus,
    CalendarDays, BarChart3, Fingerprint, Globe,
    Cpu, Database, Clock
} from 'lucide-react';
import { BUSINESS_TYPES, STRATEGIC_GOALS, GROWTH_LEVELS } from './StrategyConstants';

export default function StrategyCreationWizard({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({
        name: 'PROYECTO_ALPHA_v1',
        businessType: 'marca_personal',
        objective: 'ventas',
        growthLevel: 1,
        startDate: '2026-04-01',
        endDate: '2026-04-30',
        volume: {
            video: 4,
            imagen: 6,
            carrusel: 4,
            historia: 12,
            reel: 4,
            crm: 2,
            form: 1
        }
    });

    const handleVolumeChange = (type, val) => {
        setConfig(prev => ({
            ...prev,
            volume: {
                ...prev.volume,
                [type]: Math.max(0, prev.volume[type] + val)
            }
        }));
    };

    const nextStep = () => setStep(s => Math.min(4, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#020205]/95 backdrop-blur-3xl"
                onClick={onCancel}
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative w-full max-w-5xl bg-[#0A0B14] border border-[#ffffff10] rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col min-h-[680px]"
            >
                {/* Master Header Label */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                
                <div className="flex items-center justify-between p-6 px-10 border-b border-white/[0.03] bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                            <Cpu className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-black text-white tracking-[0.2em] uppercase">DIICZONE ARCHITECTURE ENGINE</h2>
                            <p className="text-[9px] text-indigo-400/60 font-medium tracking-[0.1em] uppercase">Iniciando Protocolo de Diseño Estratégico v2.0</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-8 h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 px-12 relative z-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none italic">
                                        NUEVA <span className="text-indigo-500">ARQUITECTURA</span>
                                    </h1>
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">Configuración Inicial de la Hoja de Ruta</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white/[0.02] p-8 rounded-[24px] border border-white/[0.05]">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.25em] flex items-center gap-2">
                                            <Fingerprint className="w-3 h-3" /> Identificador
                                        </label>
                                        <input 
                                            type="text" 
                                            value={config.name}
                                            onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-[#050508] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-indigo-500/50 transition-all outline-none"
                                            placeholder="Ej: Proyecto Alpha"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.25em] flex items-center gap-2">
                                            <Target className="w-3 h-3" /> Objetivo
                                        </label>
                                        <select 
                                            value={config.objective}
                                            onChange={(e) => setConfig(prev => ({ ...prev, objective: e.target.value }))}
                                            className="w-full bg-[#050508] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-indigo-500/50 transition-all outline-none"
                                        >
                                            {STRATEGIC_GOALS.map(o => <option key={o.id} value={o.id}>{o.label.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.25em] flex items-center gap-2">
                                            <CalendarDays className="w-3 h-3" /> Inicio
                                        </label>
                                        <input 
                                            type="date" 
                                            value={config.startDate}
                                            onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="w-full bg-[#050508] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-indigo-500/50 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.25em] flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Fecha Límite
                                        </label>
                                        <input 
                                            type="date" 
                                            value={config.endDate}
                                            onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                                            className="w-full bg-[#050508] border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-indigo-500/50 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.25em] flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Sector de Operación
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {BUSINESS_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setConfig(prev => ({ ...prev, businessType: type.id }))}
                                                className={`p-5 rounded-[20px] border text-[10px] font-black transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                                                    config.businessType === type.id 
                                                    ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                                                    : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:border-white/20'
                                                }`}
                                            >
                                                <type.icon className={`w-6 h-6 ${config.businessType === type.id ? 'text-indigo-400 scale-110' : 'text-gray-600'} transition-transform`} />
                                                <span className="uppercase tracking-widest">{type.label.split('/')[0]}</span>
                                                {config.businessType === type.id && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-4 h-4 text-purple-400" />
                                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Status de Madurez</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tighter italic">Nivel de <span className="text-purple-500">Crecimiento Actual</span></h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {GROWTH_LEVELS.map(level => (
                                        <button
                                            key={level.id}
                                            onClick={() => setConfig(prev => ({ ...prev, growthLevel: level.id }))}
                                            className={`p-6 rounded-[24px] border transition-all duration-500 text-left flex items-start gap-5 group relative ${
                                                config.growthLevel === level.id 
                                                ? 'bg-purple-500/10 border-purple-500 shadow-[0_15px_40px_-5px_rgba(168,85,247,0.15)] overflow-hidden scale-[1.02]' 
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${config.growthLevel === level.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-700 group-hover:text-gray-400'}`}>
                                                {level.id}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-black uppercase tracking-tight text-[12px] mb-1 ${config.growthLevel === level.id ? 'text-white' : 'text-gray-300'}`}>{level.label}</h3>
                                                <p className={`text-[9px] uppercase font-bold tracking-widest leading-relaxed ${config.growthLevel === level.id ? 'text-purple-300/80' : 'text-gray-600'}`}>{level.desc}</p>
                                            </div>
                                            {config.growthLevel === level.id && (
                                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                                    <Star className="w-24 h-24 text-purple-400" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Intervalo Maestro</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tighter italic">Horizonte de <span className="text-cyan-500">Ejecución Operativa</span></h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                                    {[7, 15, 30, 90].map(days => (
                                        <button
                                            key={days}
                                            onClick={() => setConfig(prev => ({ ...prev, duration: String(days) }))}
                                            className={`p-10 rounded-[32px] border transition-all duration-700 flex flex-col items-center justify-center gap-4 relative overflow-hidden group ${
                                                config.duration === String(days)
                                                ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_20px_40px_-5px_rgba(6,182,212,0.2)]'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            <span className={`text-6xl font-black transition-all ${config.duration === String(days) ? 'text-white scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-gray-800 group-hover:text-gray-500'}`}>{days}</span>
                                            <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${config.duration === String(days) ? 'text-cyan-400' : 'text-gray-600'}`}>DÍAS DE FLUJO</span>
                                            {config.duration === String(days) && <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div 
                                key="step4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-4 h-4 text-emerald-400" />
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Protocolo de Producción</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-white tracking-tighter italic">Ingredientes de la <span className="text-emerald-500">Estrategia Master</span></h2>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em]">Define el volumen de piezas para la generación táctica automática.</p>
                                    </div>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl hidden md:block">
                                        <Database className="w-6 h-6 text-emerald-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 bg-white/[0.01] p-6 rounded-[32px] border border-white/[0.03]">
                                    {[
                                        { id: 'video', label: 'Videos', icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                                        { id: 'reel', label: 'Reels', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                                        { id: 'imagen', label: 'Posts', icon: Layout, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                                        { id: 'historia', label: 'Stories', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
                                        { id: 'carrusel', label: 'Carousel', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                                        { id: 'crm', label: 'CRM / Ads', icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                                        { id: 'form', label: 'Forms', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
                                    ].map(item => (
                                        <div key={item.id} className={`bg-white/[0.02] border ${item.border} p-5 rounded-[24px] flex flex-col gap-5 hover:bg-white/[0.04] transition-all group overflow-hidden relative`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                                </div>
                                                <h4 className="text-white font-black text-[11px] uppercase tracking-tighter">{item.label}</h4>
                                            </div>
                                            
                                            <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl border border-white/5">
                                                <button 
                                                    onClick={() => handleVolumeChange(item.id, -1)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all active:scale-90"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <span className="text-2xl font-black text-white tracking-widest">{config.volume[item.id] || 0}</span>
                                                <button 
                                                    onClick={() => handleVolumeChange(item.id, 1)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all active:scale-90"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="md:col-span-2 lg:col-span-1 p-6 rounded-[24px] border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-center bg-white/[0.01]">
                                        <Plus className="w-6 h-6 text-gray-700" />
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Más formatos próximamente</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Unified Premium Footer */}
                <div className="p-10 px-12 flex items-center justify-between border-t border-white/[0.03] bg-white/[0.01] mt-auto">
                    <button 
                        onClick={step === 1 ? onCancel : prevStep}
                        className="text-gray-600 hover:text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 group"
                    >
                        {step === 1 ? (
                            <>
                                <Minus className="w-4 h-4" /> ABORTAR MISIÓN
                            </>
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                RETROCEDER PROTOCOLO
                            </>
                        )}
                    </button>
                    
                    <button 
                        onClick={step === 4 ? () => onComplete(config) : nextStep}
                        className={`px-12 py-5 rounded-full font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center gap-4 relative group overflow-hidden shadow-2xl ${
                            step === 4 
                            ? 'bg-emerald-500 text-black hover:bg-white shadow-emerald-500/20' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
                        }`}
                    >
                        {step === 4 ? (
                            <>
                                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                DESPLEGAR ARQUITECTURA
                            </>
                        ) : (
                            <>
                                SIGUIENTE FASE
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Custom Styles for Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}

