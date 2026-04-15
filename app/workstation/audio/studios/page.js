'use client';

import { useState } from 'react';
import {
    MapPin, Star, Search, Filter, Headphones,
    Mic2, Music, DollarSign, Clock, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudioMarketplace() {

    // Mock Studios
    const studios = [
        {
            id: 1,
            name: 'Sonic Boom Studios',
            location: 'Centro, Av. Principal 123',
            rating: 4.9,
            price: '$50/h',
            equipment: ['Neumann U87', 'Pro Tools HD', 'Iso Booth'],
            image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
            status: 'available'
        },
        {
            id: 2,
            name: 'Vibe Lab',
            location: 'Zona Norte, Calle 45',
            rating: 4.7,
            price: '$35/h',
            equipment: ['Shure SM7B', 'Logic Pro', 'Podcast Set'],
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac618?q=80&w=2070&auto=format&fit=crop',
            status: 'busy'
        },
        {
            id: 3,
            name: 'Echo Chamber',
            location: 'Sur, Av. Los Próceres',
            rating: 5.0,
            price: '$75/h',
            equipment: ['SSL Console', 'Grand Piano', 'Live Room'],
            image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop',
            status: 'available'
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Estudios de Grabación</h1>
                    <p className="text-sm text-gray-400">Encuentra y reserva el espacio perfecto.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por zona o equipo..."
                            className="bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 w-64"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Content: Map & List Split */}
            <div className="flex-1 flex overflow-hidden">

                {/* List View */}
                <div className="w-full lg:w-[450px] border-r border-white/5 overflow-y-auto p-6 space-y-6 bg-[#050511]">
                    {studios.map(studio => (
                        <div key={studio.id} className="group bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all cursor-pointer">
                            <div className="h-40 relative">
                                <img src={studio.image} alt={studio.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" /> {studio.rating}
                                </div>
                                <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase ${studio.status === 'available' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                    {studio.status === 'available' ? 'Disponible' : 'Ocupado'}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{studio.name}</h3>
                                    <span className="text-sm font-bold text-white bg-white/5 px-2 py-1 rounded">{studio.price}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {studio.location}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {studio.equipment.map((eq, i) => (
                                        <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/5">
                                            {eq}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-violet-600/20">
                                    Reservar Ahora <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map View Placeholder */}
                <div className="flex-1 bg-[#0A0A0E] relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-74.006,40.7128,12,0/800x600?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale" />

                    <div className="relative z-10 text-center p-8 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md">
                        <MapPin className="w-12 h-12 text-violet-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Mapa Interactivo</h3>
                        <p className="text-gray-400 text-sm mb-6">Explora estudios cercanos, verifica disponibilidad en tiempo real y reserva sesiones al instante.</p>
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-colors">
                            Habilitar Ubicación
                        </button>
                    </div>

                    {/* Mock Map Pins */}
                    <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-violet-500/50 flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                    </div>
                    <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-violet-500/50 flex items-center justify-center animate-pulse delay-700">
                        <div className="w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                    </div>
                </div>

            </div>
        </div>
    );
}

import { ChevronLeft, ChevronRight } from 'lucide-react';
