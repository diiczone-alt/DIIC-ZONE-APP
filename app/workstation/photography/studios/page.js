'use client';

import { useState } from 'react';
import {
    MapPin, Star, Search, Filter, Camera,
    ArrowRight
} from 'lucide-react';

import { useSearchParams } from 'next/navigation';

export default function PhotoStudios() {
    const searchParams = useSearchParams();
    const sessionType = searchParams.get('type'); // e.g., 'wedding', 'product'

    // Mock Photographer/Studios
    const studios = [
        {
            id: 1,
            name: 'Estudio Luz Natural',
            location: 'Centro Histórico',
            rating: 4.8,
            price: '$60/h',
            specs: ['Ciclorama Infinito', 'Luz Natural 10am-4pm', 'Vestidor'],
            type: 'studio',
            image: 'https://images.unsplash.com/photo-1590490401826-3d2d0b6df790?q=80&w=2070&auto=format&fit=crop',
            status: 'available'
        },
        {
            id: 2,
            name: 'Carlos R. - Fotógrafo Moda',
            location: 'Zona Norte',
            rating: 5.0,
            price: '$150/sesión',
            specs: ['Retrato', 'Editorial', 'Lookbook'],
            type: 'photographer',
            image: 'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1935&auto=format&fit=crop',
            status: 'busy'
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Mapa de Talentos
                        {sessionType && (
                            <span className="text-sm font-normal text-pink-400 bg-pink-500/10 px-2 py-1 rounded-lg border border-pink-500/20 capitalize">
                                • {sessionType === 'wedding' ? 'Bodas' : sessionType}
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-400">Encuentra fotógrafos y estudios para tu producción.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por estilo o ubicación..."
                            className="bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 w-64"
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
                        <div key={studio.id} className="group bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all cursor-pointer">
                            <div className="h-48 relative">
                                <img src={studio.image} alt={studio.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" /> {studio.rating}
                                </div>
                                <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase ${studio.status === 'available' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                    {studio.status === 'available' ? 'Disponible' : 'Ocupado'}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">{studio.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                            <MapPin className="w-3.5 h-3.5" /> {studio.location}
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-white bg-white/5 px-2 py-1 rounded">{studio.price}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 my-4">
                                    {studio.specs.map((spec, i) => (
                                        <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/5">
                                            {spec}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-pink-600/20">
                                    Contactar / Reservar <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map View Placeholder */}
                <div className="flex-1 bg-[#0A0A0E] relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-99.1332,19.4326,12,0/800x600?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale" />

                    <div className="relative z-10 text-center p-8 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md">
                        <MapPin className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Mapa de Fotografía</h3>
                        <p className="text-gray-400 text-sm mb-6">Localiza estudios, parques para sesiones y fotógrafos disponibles en tu área.</p>
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-colors">
                            Ver mi ubicación
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
