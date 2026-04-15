'use client';

import { useState } from 'react';
import {
    Plus, Target, Filter, MoreHorizontal,
    Calendar, DollarSign, Layout, ArrowRight
} from 'lucide-react';

export default function CampaignsPage() {

    // Mock Data
    const campaigns = [
        {
            id: 'CMP-001',
            client: 'Ecom Store',
            name: 'Black Friday Deals',
            objective: 'Ventas',
            budget: '$2,000',
            status: 'active',
            pieces: { video: 3, image: 5, copy: 8 }
        },
        {
            id: 'CMP-002',
            client: 'Clínica Smith',
            name: 'Branding Médico',
            objective: 'Autoridad',
            budget: '$1,500',
            status: 'planning',
            pieces: { video: 1, image: 10, copy: 10 }
        }
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Campañas</h1>
                    <p className="text-sm text-gray-400">Gestiona y coordina estrategias completas.</p>
                </div>
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nueva Campaña
                </button>
            </header>

            {/* Filters */}
            <div className="px-8 py-6 flex gap-4 overflow-x-auto shrink-0">
                <FilterButton label="Todas" active />
                <FilterButton label="Activas" />
                <FilterButton label="Planificación" />
                <FilterButton label="Finalizadas" />
            </div>

            {/* Campaign Grid */}
            <div className="flex-1 overflow-y-auto px-8 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {campaigns.map(camp => (
                        <div key={camp.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group cursor-pointer relative overflow-hidden">
                            {/* Status Badge */}
                            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${camp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {camp.status}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{camp.name}</h3>
                                <p className="text-sm text-gray-400 font-bold">{camp.client}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                        <Target className="w-3 h-3" /> Objetivo
                                    </div>
                                    <div className="text-sm font-bold text-white">{camp.objective}</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                        <DollarSign className="w-3 h-3" /> Budget
                                    </div>
                                    <div className="text-sm font-bold text-white">{camp.budget}</div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Layout className="w-3 h-3" /> {camp.pieces.image + camp.pieces.video} Piezas</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 30 días</span>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Placeholder */}
                    <button className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-white/5 transition-all min-h-[250px]">
                        <Plus className="w-8 h-8 mb-4 opacity-50" />
                        <span className="font-bold">Crear Nueva Campaña</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function FilterButton({ label, active }) {
    return (
        <button className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${active ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}>
            {label}
        </button>
    );
}
