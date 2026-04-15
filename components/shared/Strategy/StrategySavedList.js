'use client';

import React from 'react';
import { 
    Plus, Search, MoreVertical, ExternalLink, 
    Copy, Trash2, FileText, Calendar, Target,
    Bookmark, Clock, ChevronRight
} from 'lucide-react';

export default function StrategySavedList({ onOpenStrategy, onNewStrategy }) {
    const savedStrategies = [
        { 
            id: '1', 
            name: 'Lanzamiento Programa High Ticket', 
            status: 'Activo', 
            date: '15 Mar 2024', 
            objective: 'Escalar ventas de formación premium',
            nodeCount: 12,
            lastEdited: 'Hace 2 horas'
        },
        { 
            id: '2', 
            name: 'Estrategia de Autoridad LinkedIn', 
            status: 'En Borrador', 
            date: '10 Mar 2024', 
            objective: 'Posicionamiento como referente en IA',
            nodeCount: 8,
            lastEdited: 'Hace 1 día'
        },
        { 
            id: '3', 
            name: 'Embudo de Captación Inmobiliaria', 
            status: 'Finalizado', 
            date: '01 Mar 2024', 
            objective: 'Generación de leads cualificados',
            nodeCount: 15,
            lastEdited: 'Hace 1 semana'
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#050511] p-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-end justify-between border-b border-white/5 pb-8">
                    <div>
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                            Mis Estrategias <span className="text-indigo-500">Guardadas</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-bold mt-2 uppercase tracking-widest">
                            Gestiona y evoluciona tus arquitecturas de negocio personales
                        </p>
                    </div>
                    <button 
                        onClick={onNewStrategy}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.05]"
                    >
                        Nueva Estrategia <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        <input 
                            type="text" 
                            placeholder="Buscar en mis estrategias..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest appearance-none focus:outline-none cursor-pointer hover:bg-white/[0.07] transition-all">
                            <option>Todos los Estados</option>
                            <option>Activo</option>
                            <option>En Borrador</option>
                            <option>Finalizado</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStrategies.map((strategy) => (
                        <div 
                            key={strategy.id}
                            className="group relative bg-[#0A0A0F] border border-white/5 rounded-[32px] p-8 transition-all hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Glow Background */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all" />

                            <div className="relative space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                        <FileText className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        strategy.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-500' :
                                        strategy.status === 'En Borrador' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-gray-500/10 text-gray-500'
                                    }`}>
                                        {strategy.status}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors">
                                        {strategy.name}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest line-clamp-1">
                                        {strategy.objective}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Nodos</span>
                                        <span className="text-sm font-black text-white">{strategy.nodeCount}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Último Edito</span>
                                        <span className="text-xs font-bold text-gray-500">{strategy.lastEdited}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button 
                                        onClick={() => onOpenStrategy(strategy.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                                    >
                                        Abrir Estrategia <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <div className="relative group/menu">
                                        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        {/* Simple context menu placeholder */}
                                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-black border border-white/10 rounded-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 transition-all z-50">
                                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                                                <Copy className="w-3.5 h-3.5" /> Duplicar
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                                                <Bookmark className="w-3.5 h-3.5" /> Como Plantilla
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-[10px] font-bold text-red-500 transition-all uppercase tracking-widest">
                                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* New Strategy Card Ghost */}
                    <button 
                        onClick={onNewStrategy}
                        className="group relative border-2 border-dashed border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-white/20 hover:bg-white/[0.02]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-white group-hover:scale-110 transition-all">
                            <Plus className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] group-hover:text-gray-400 transition-all">Nueva Estrategia</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
