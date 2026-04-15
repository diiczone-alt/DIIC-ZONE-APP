'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search, Filter, MapPin, Star, Heart,
    ChevronDown, Sliders
} from 'lucide-react';

export default function TalentSearch() {

    // Mock Talent
    const talents = [
        {
            id: 1,
            name: 'Valentina R.',
            title: 'Presentadora TV / Eventos',
            location: 'CDMX',
            rating: 5.0,
            level: 'Pro',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
            tags: ['Bilingüe', 'Carismática', 'TV Experience']
        },
        {
            id: 2,
            name: 'Camila S.',
            title: 'Modelo Editorial',
            location: 'Monterrey',
            rating: 4.9,
            level: 'Elite',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
            tags: ['Moda', 'Pasarela', 'Altura 1.78m']
        },
        {
            id: 3,
            name: 'Andrea M.',
            title: 'Imagen Comercial',
            location: 'Guadalajara',
            rating: 4.8,
            level: 'New Face',
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
            tags: ['Comerciales', 'Actriz', 'Sonrisa']
        },
        {
            id: 4,
            name: 'Sofía L.',
            title: 'Host & Reportera',
            location: 'CDMX',
            rating: 5.0,
            level: 'Pro',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop',
            tags: ['Entrevistas', 'Redes Sociales', 'Energía']
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, habilidad o característica..."
                            className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-sm font-bold whitespace-nowrap">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Ordenar por:</span>
                    <button className="flex items-center gap-2 text-sm text-white font-bold hover:text-orange-400 transition-colors">
                        Relevancia <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Filters Bar (Optional, can be expanded) */}
            <div className="h-12 border-b border-white/5 flex items-center px-8 gap-4 overflow-x-auto bg-[#0A0A0E]">
                {['Presentadoras', 'Modelos', 'Actrices', 'Bilingüe', 'Disponibilidad Inmediata', 'Altura > 1.70m'].map((filter, i) => (
                    <button key={i} className="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/5 transition-all whitespace-nowrap">
                        {filter}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {talents.map(talent => (
                        <Link href={`/workstation/talent/profile/${talent.id}`} key={talent.id}>
                            <div className="group bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all cursor-pointer shadow-lg relative h-[420px]">
                                {/* Image */}
                                <div className="absolute inset-0">
                                    <img src={talent.image} alt={talent.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                                </div>

                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10 uppercase tracking-wider">
                                        {talent.level}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-red-500 hover:bg-white/10 transition-all">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{talent.name}</h3>
                                        <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                            <Star className="w-3 h-3 fill-current" /> {talent.rating}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-3">{talent.title}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {talent.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[10px] text-gray-400 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                                                {tag}
                                            </span>
                                        ))}
                                        {talent.tags.length > 2 && (
                                            <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                                                +{talent.tags.length - 2}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin className="w-3.5 h-3.5" /> {talent.location}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
