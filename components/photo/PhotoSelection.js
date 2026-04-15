'use client';

import { motion } from 'framer-motion';
import {
    Camera, PartyPopper, Building2, ShoppingBag,
    Stethoscope, Home, ArrowRight, Sparkles, Star
} from 'lucide-react';

const PHOTO_CATEGORIES = [
    {
        id: 'studio',
        title: 'Foto Estudio',
        description: 'Retrato Fine Art, LinkedIn Profile, Marca Personal con iluminación controlada.',
        icon: Camera,
        gradient: 'from-pink-500 to-rose-500',
        tags: ['High-End', 'Headshots', 'Editorial'],
        priceStart: '150'
    },
    {
        id: 'medical',
        title: 'Médica / Profesional',
        description: 'Fotografía clínica en consultorio, branding médico y documentación de procedimientos.',
        icon: Stethoscope,
        gradient: 'from-emerald-500 to-teal-500',
        tags: ['Clínica', 'Staff', 'Quirófano'],
        featured: true,
        priceStart: '200'
    },
    {
        id: 'product',
        title: 'Producto & E-commerce',
        description: 'Packshots fondo blanco, Bodegón publicitario y Gastronomía.',
        icon: ShoppingBag,
        gradient: 'from-orange-500 to-amber-500',
        tags: ['Marketplace', 'Food Styling', 'Macro'],
        priceStart: '180'
    },
    {
        id: 'corporate',
        title: 'Corporativo & PR',
        description: 'Cobertura de congresos, headshots de equipo y arquitectura corporativa.',
        icon: Building2,
        gradient: 'from-blue-500 to-cyan-500',
        tags: ['Networking', 'Prensa', 'Anuario'],
        priceStart: '300'
    },
    {
        id: 'real_estate',
        title: 'Inmobiliaria & Arquitectura',
        description: 'Interiorismo, Airbnb Plus, Drone y Recorridos Virtuales.',
        icon: Home,
        gradient: 'from-gray-500 to-slate-500',
        tags: ['HDR', 'Gran Angular', 'Drone'],
        priceStart: '250'
    },
    {
        id: 'social',
        title: 'Social & Lifestyle',
        description: 'Narrativa documental para bodas, aniversarios y eventos sociales.',
        icon: PartyPopper,
        gradient: 'from-purple-500 to-indigo-500',
        tags: ['Candid', 'Boda', 'Storytelling'],
        priceStart: '400'
    }
];

export default function PhotoSelection({ onSelect, onBack }) {
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
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Catálogo Profesional
                    </h2>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Selecciona la especialidad fotográfica para tu proyecto.
                </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {PHOTO_CATEGORIES.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => onSelect(cat)}
                        className={`group relative h-full text-left rounded-3xl p-1 ${cat.featured ? 'bg-gradient-to-br from-emerald-500/50 to-teal-500/50' : ''}`}
                    >
                        {/* Optional Featured Border/Glow */}
                        {cat.featured && (
                            <div className="absolute -top-3 -right-3 z-20 bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Star className="w-3 h-3 fill-black" /> RECOMENDADO
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                        />

                        <div className="relative h-full bg-[#0E0E18] border border-white/10 rounded-2xl p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-pink-500/30 group-hover:shadow-2xl overflow-hidden flex flex-col">

                            {/* Hover Gradient Border Effect */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                    <cat.icon className="w-7 h-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 -rotate-45 group-hover:rotate-0 group-hover:text-pink-500 transition-all duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                                {cat.title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 line-clamp-3">
                                {cat.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {cat.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-gray-500 uppercase border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center bg-transparent">
                                    <span className="text-[10px] text-gray-600 uppercase font-bold">Desde</span>
                                    <span className="text-pink-400 font-mono font-bold">${cat.priceStart}</span>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
