'use client';

import { motion } from 'framer-motion';
import { Sparkles, Type, Users, ArrowRight, BrainCircuit, Zap, Check } from 'lucide-react';

export default function EditorIA_Entry({ onSelectMode }) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Ambient Glow (Reduced) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header - Restored & Compact */}
            <div className="relative z-10 text-center mb-10 space-y-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cyan-400 text-[10px] font-bold uppercase tracking-widest"
                >
                    <BrainCircuit className="w-3 h-3" /> DIIC Editor AI
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
                >
                    Hola, soy tu <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                        Editor Multimedia Inteligente.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-base max-w-xl mx-auto font-light"
                >
                    ¿Cómo deseas producir tu contenido hoy? Elige tu flujo de trabajo.
                </motion.p>
            </div>

            {/* Decision Cards - Compact Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[1200px]">

                {/* OPTION 1: AI (The Standard) */}
                <EntryCard
                    icon={Sparkles}
                    title="Editar con IA"
                    subtitle="Co-Piloto Inteligente"
                    desc="Tu grabas, la IA estructura y edita automáticamente con el Método DIIC."
                    features={['Edición 12 Pasos', 'Ritmo Viral', 'Music Sync']}
                    color="cyan"
                    onClick={() => onSelectMode('AI_TEMPLATES')}
                    recommended
                    delay={0.3}
                />

                {/* OPTION 2: GENERATIVE (The Future) */}
                <EntryCard
                    icon={Type}
                    title="Texto a Video"
                    subtitle="Generación 100% IA"
                    desc="Creación desde cero sin material previo. De una idea a un video completo."
                    features={['Guión Instantáneo', 'Stock Premium', 'Voces Neurales']}
                    color="purple"
                    onClick={() => onSelectMode('TEXT_TO_VIDEO')}
                    delay={0.4}
                />

                {/* OPTION 3: PRO TEAM (The Human Touch) */}
                <EntryCard
                    icon={Users}
                    title="Delegar a tu Editor Pro"
                    subtitle="Servicio Profesional"
                    desc="Nuestro equipo senior toma el control total de tu edición. Resultado cinematográfico."
                    features={['Narrativa Avanzada', 'Color Grading', 'Soporte 24/7']}
                    color="orange"
                    onClick={() => onSelectMode('DELEGATE')}
                    delay={0.5}
                />

            </div>
        </div>
    );
}

function EntryCard({ icon: Icon, title, subtitle, desc, features, color, onClick, recommended, delay }) {
    const colors = {
        cyan: 'from-cyan-500 to-blue-600',
        purple: 'from-purple-500 to-violet-600',
        orange: 'from-orange-500 to-red-600',
    };

    const borders = {
        cyan: 'border-cyan-500/30 hover:border-cyan-400/50',
        purple: 'border-purple-500/30 hover:border-purple-400/50',
        orange: 'border-orange-500/30 hover:border-orange-400/50',
    };

    const shadows = {
        cyan: 'hover:shadow-cyan-500/20',
        purple: 'hover:shadow-purple-500/20',
        orange: 'hover:shadow-orange-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className={`group relative h-full flex flex-col p-6 rounded-3xl bg-[#0A0A12]/80 backdrop-blur-xl border ${borders[color]} transition-all duration-300 shadow-xl ${shadows[color]} overflow-hidden`}
            onClick={onClick}
        >
            {/* Background Gradient Mesh */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${colors[color]} opacity-10 blur-[60px] group-hover:opacity-20 transition-opacity duration-500`} />

            {/* Header Area */}
            <div className="relative z-10 mb-5">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} p-0.5 shadow-lg`}>
                        <div className="w-full h-full rounded-xl bg-[#0A0A12] flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white relative z-10" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-20 group-hover:opacity-40 transition-opacity rounded-xl`} />
                        </div>
                    </div>

                    {recommended && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest">
                            <Zap className="w-2.5 h-2.5" /> Top
                        </div>
                    )}
                </div>

                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    {subtitle}
                </h3>
                <h2 className="text-2xl font-black text-white leading-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all">
                    {title}
                </h2>
                <p className="text-gray-400/90 text-xs leading-relaxed font-light">
                    {desc}
                </p>
            </div>

            {/* Features Divider */}
            <div className="w-full h-px bg-white/5 mb-5 group-hover:bg-white/10 transition-colors" />

            {/* Features List - Compact */}
            <div className="space-y-2.5 mb-6 flex-1 relative z-10">
                {features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 group/item">
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-${color.split('-')[1]}-500/50 transition-colors`}>
                            <Check className="w-2.5 h-2.5 text-white/50 group-hover/item:text-white" />
                        </div>
                        <span className="text-[11px] text-gray-300 font-medium group-hover/item:text-white transition-colors">{feat}</span>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <button className="relative w-full group/btn overflow-hidden rounded-lg bg-white text-black font-black uppercase tracking-widest py-3 text-xs transition-transform active:scale-95 text-center">
                <div className={`absolute inset-0 bg-gradient-to-r ${colors[color]} opacity-0 group-hover/btn:opacity-10 transition-opacity`} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    Iniciar <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
            </button>
        </motion.div>
    );
}
