'use client';

import { motion } from 'framer-motion';
import {
    PartyPopper, Briefcase, Music, Trophy, Landmark,
    ArrowRight, Sparkles
} from 'lucide-react';

const EVENT_TYPES = [
    {
        id: 'social',
        title: 'Sociales',
        description: '15 años, Bodas, Bautizos, Graduaciones.',
        icon: PartyPopper,
        gradient: 'from-pink-500 to-rose-500',
        services: ['Fotografía', 'Video Resumen', 'Reels']
    },
    {
        id: 'corporate',
        title: 'Corporativos',
        description: 'Congresos, Seminarios, Lanzamientos, Ferias.',
        icon: Briefcase,
        gradient: 'from-blue-500 to-indigo-500',
        services: ['Streaming', 'Fotografía', 'Aftermovie']
    },
    {
        id: 'artistic',
        title: 'Artísticos',
        description: 'Conciertos, Shows, Obras, Festivales.',
        icon: Music,
        gradient: 'from-purple-500 to-violet-500',
        services: ['Multicámara', 'Drone', 'Entrevistas']
    },
    {
        id: 'sports',
        title: 'Deportivos',
        description: 'Torneos, Competencias, Eventos fitness.',
        icon: Trophy,
        gradient: 'from-orange-500 to-amber-500',
        services: ['Cámara Lenta', 'Drone FPV', 'Resumen']
    },
    {
        id: 'institutional',
        title: 'Institucionales',
        description: 'Actos oficiales, Proyectos sociales, Académicos.',
        icon: Landmark,
        gradient: 'from-emerald-500 to-teal-500',
        services: ['Registro Completo', 'Fotografía', 'Prensa']
    }
];

export default function EventsSelection({ onSelect, onBack }) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <button
                    onClick={onBack}
                    className="mb-6 px-4 py-1.5 rounded-full border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors"
                >
                    ← Volver
                </button>
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-lime-500" />
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Tipos de Cobertura
                    </h2>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Selecciona la categoría de tu evento para ver los paquetes disponibles.
                </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {EVENT_TYPES.map((type, idx) => (
                    <motion.button
                        key={type.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => onSelect(type)}
                        className="group relative h-full text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                        />

                        <div className="relative h-full bg-[#0E0E18] border border-white/10 rounded-3xl p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-lime-500/30 group-hover:shadow-lg overflow-hidden flex flex-col">
                            {/* Hover Gradient Border Effect */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${type.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                    <type.icon className="w-7 h-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 -rotate-45 group-hover:rotate-0 group-hover:text-lime-500 transition-all duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                                {type.title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300">
                                {type.description}
                            </p>

                            <div className="mt-auto flex flex-wrap gap-2">
                                {type.services.map((srv, i) => (
                                    <span key={i} className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-gray-500 uppercase">
                                        {srv}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
