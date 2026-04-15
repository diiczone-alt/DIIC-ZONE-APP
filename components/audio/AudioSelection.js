'use client';

import { motion } from 'framer-motion';
import {
    Mic2, Music, Sliders, Radio, Activity, Headphones,
    ArrowLeft, Speaker, Settings, Podcast, Wand2, FileAudio
} from 'lucide-react';

const STUDIOS = [
    {
        id: 'recording-suite',
        name: 'Suite de Grabación',
        subtitle: 'Captura de Audio High-Fidelity',
        desc: 'Espacios acústicamente tratados para voz e instrumentos.',
        icon: Mic2,
        color: 'from-sky-500 to-indigo-500',
        stats: ['Microfonía Neumann', 'Pre-amps Avalon', 'Cabinas Insonorizadas'],
        services: [
            { id: 'podcast', label: 'Podcast Production', tag: 'Studio A' },
            { id: 'voiceover', label: 'Voice Over & Locución', tag: 'Booth 1' },
            { id: 'adr', label: 'Doblaje (ADR)', tag: 'Sync' }
        ]
    },
    {
        id: 'mixing-lab',
        name: 'Laboratorio de Mezcla',
        subtitle: 'Balance, EQ y Procesamiento',
        desc: 'Donde las pistas individuales se convierten en una unidad.',
        icon: Sliders,
        color: 'from-violet-500 to-fuchsia-500',
        stats: ['Pro Tools HDX', 'Waves Mercury', 'Analog Summing'],
        services: [
            { id: 'mixing', label: 'Mezcla Multipista', tag: 'Consola' },
            { id: 'cleanup', label: 'Restauración de Audio', tag: 'iZotope' },
            { id: 'beatmaking', label: 'Producción de Beats', tag: 'MIDI' }
        ]
    },
    {
        id: 'mastering-room',
        name: 'Sala de Mastering',
        subtitle: 'El Toque Final de la Industria',
        desc: 'Optimización para todas las plataformas (Spotify, TV, Cine).',
        icon: Speaker,
        color: 'from-amber-500 to-orange-500',
        stats: ['Loudness Standards', 'Dynamic Range Control', 'Metadata'],
        services: [
            { id: 'mastering', label: 'Mastering Digital', tag: 'Finalizer' },
            { id: 'stems', label: 'Exportación de Stems', tag: 'Delivery' },
            { id: 'formats', label: 'Conversión de Formatos', tag: 'Codecs' }
        ]
    }
];

export default function AudioSelection({ onSelect, onBack }) {
    return (
        <div className="min-h-screen bg-[#050511] p-6 lg:p-12 text-white">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="group p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/20 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Studios Available</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Selecciona tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Suite</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {STUDIOS.map((studio, index) => (
                        <motion.div
                            key={studio.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#0E0E18] border border-white/5 rounded-[2rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
                        >
                            {/* Inner Card */}
                            <div className="bg-[#0E0E18] rounded-[1.8rem] h-full p-8 flex flex-col relative z-10">

                                {/* Header */}
                                <div className="mb-8">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${studio.color} p-0.5 mb-6 shadow-2xl skew-x-[-6deg]`}>
                                        <div className="w-full h-full bg-[#0E0E18] rounded-[0.9rem] flex items-center justify-center skew-x-[6deg]">
                                            <studio.icon className="w-8 h-8 text-white opacity-80" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{studio.name}</h3>
                                    <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 uppercase tracking-wider mb-4">{studio.subtitle}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed">{studio.desc}</p>
                                </div>

                                {/* Tech Specs (Small Pills) */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {studio.stats.map((stat, i) => (
                                        <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-500 font-mono">
                                            {stat}
                                        </span>
                                    ))}
                                </div>

                                {/* Services List */}
                                <div className="space-y-2 mt-auto">
                                    {studio.services.map((srv) => (
                                        <button
                                            key={srv.id}
                                            onClick={() => onSelect({ ...srv, category: studio.id })}
                                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group/item"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-8 bg-gray-700 rounded-full group-hover/item:bg-white transition-colors"></div>
                                                <span className="font-bold text-sm text-gray-300 group-hover/item:text-white">{srv.label}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-600 group-hover/item:text-gray-400 uppercase">{srv.tag}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Ambient Effect */}
                            <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${studio.color} opacity-0 group-hover:opacity-10 blur-[80px] rounded-full transition-opacity pointer-events-none duration-700`}></div>
                        </motion.div>
                    ))}
                </div>

                {/* Pro Tip Footer */}
                <div className="mt-16 border-t border-white/5 pt-8 flex items-start gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <Activity className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                        <h4 className="text-sm font-bold text-white">¿No sabes qué necesitas?</h4>
                        <p className="text-xs text-gray-500 max-w-md">Nuestros ingenieros pueden auditar tu material y sugerir la mejor cadena de procesamiento. Agenda una consulta de diagnóstico.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
