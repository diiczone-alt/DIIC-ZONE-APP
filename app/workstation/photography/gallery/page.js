'use client';

import { useState } from 'react';
import {
    Image as ImageIcon, Grid, List, Download,
    Share2, CheckCircle, Clock
} from 'lucide-react';

export default function PhotoGallery() {

    // Mock Albums
    const albums = [
        {
            id: 1,
            title: 'Campaña Verano 2026',
            count: 124,
            date: 'Hace 2 días',
            status: 'delivered', // delivered, selection, editing
            cover: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Retratos Ejecutivos',
            count: 45,
            date: 'Hace 1 semana',
            status: 'selection',
            cover: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'Evento Lanzamiento',
            count: 350,
            date: 'Hace 3 semanas',
            status: 'editing',
            cover: 'https://images.unsplash.com/photo-1540575467063-178a5093df08?q=80&w=2198&auto=format&fit=crop'
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Galería de Entregas</h1>
                    <p className="text-sm text-gray-400">Gestiona, selecciona y descarga tu material visual.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
                        <Grid className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 transition-colors">
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* Upload New Card */}
                    <button className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-pink-500/30 hover:text-pink-400 hover:bg-white/5 transition-all min-h-[300px] group">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-8 h-8 opacity-50" />
                        </div>
                        <span className="font-bold text-lg">Nueva Galería</span>
                        <span className="text-xs mt-2 opacity-50">Arrastra carpetas aquí</span>
                    </button>

                    {albums.map(album => (
                        <div key={album.id} className="group bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all cursor-pointer shadow-lg">
                            <div className="h-48 relative overflow-hidden">
                                <img src={album.cover} alt={album.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                    <div className="text-white">
                                        <p className="text-xs font-bold opacity-80">{album.count} Fotos</p>
                                    </div>
                                    <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-pink-600 transition-colors">
                                        <Download className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors truncate">{album.title}</h3>
                                <p className="text-xs text-gray-500 mb-4">{album.date}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <StatusBadge status={album.status} />
                                    <button className="text-gray-500 hover:text-white transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    if (status === 'delivered') {
        return (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                <CheckCircle className="w-3 h-3" /> Entregado
            </span>
        );
    }
    if (status === 'selection') {
        return (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                <Grid className="w-3 h-3" /> Selección
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> Editando
        </span>
    );
}
