'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Check, Loader2, Sparkles, Layers, Scissors, Mic, Music, Type, Palette, MonitorPlay, Film } from 'lucide-react';

export default function EditorIA_Analyzer() {
    const steps = [
        { id: 1, label: 'Organización automática del material', icon: Layers, time: 1000 },
        { id: 2, label: 'Ranking y selección de mejores tomas', icon: Film, time: 1500 },
        { id: 3, label: 'Estructuración narrativa (Gancho-Cuerpo-Cierre)', icon: BrainCircuit, time: 2000 },
        { id: 4, label: 'Cortes dinámicos y ajuste de ritmo', icon: Scissors, time: 2500 },
        { id: 5, label: 'Limpieza y nivelación de audio', icon: Mic, time: 3000 },
        { id: 6, label: 'Sincronización musical inteligente', icon: Music, time: 3500 },
        { id: 7, label: 'Generación de subtítulos dinámicos', icon: Type, time: 4000 },
        { id: 8, label: 'Inserción de B-Roll y recursos', icon: Layers, time: 4500 },
        { id: 9, label: 'Corrección de color y estilo', icon: Palette, time: 5000 },
        { id: 10, label: 'Aplicación de Branding DIIC', icon: Sparkles, time: 5500 },
        { id: 11, label: 'Revisión de calidad automática', icon: Check, time: 6000 },
        { id: 12, label: 'Generación de versiones (9:16, 16:9)', icon: MonitorPlay, time: 6500 },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < steps.length) return prev + 1;
                setIsComplete(true);
                clearInterval(interval);
                return prev;
            });
        }, 800); // Fast simulation

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 relative overflow-hidden group w-full bg-grid-white/[0.02]">

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Motor DIIC Activo</span>
                </div>
                <h2 className="text-3xl font-black text-white">Aplicando Método de 12 Pasos</h2>
            </div>

            {/* The 12 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {steps.map((step, idx) => (
                    <AnalysisStep
                        key={step.id}
                        step={step}
                        status={idx < currentStep ? 'done' : idx === currentStep ? 'processing' : 'waiting'}
                        index={idx}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 relative h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((currentStep + 1) / 12) * 100, 100)}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />
            </div>
        </div>
    );
}

function AnalysisStep({ step, status, index }) {
    const Icon = step.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                ${status === 'processing' ? 'bg-white/10 border-cyan-500/50 scale-105 shadow-lg shadow-cyan-900/20' :
                    status === 'done' ? 'bg-[#1A1A24] border-emerald-500/20 opacity-60' : 'bg-transparent border-transparent opacity-30'}`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                ${status === 'processing' ? 'bg-cyan-500 text-black' :
                    status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                {status === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
            </div>

            <div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-0.5
                    ${status === 'processing' ? 'text-cyan-400' : status === 'done' ? 'text-emerald-500' : 'text-gray-600'}`}>
                    Paso {step.id}
                </div>
                <div className={`text-xs font-medium leading-tight
                    ${status === 'processing' ? 'text-white' : status === 'done' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.label}
                </div>
            </div>

            {status === 'done' && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
        </motion.div>
    );
}
