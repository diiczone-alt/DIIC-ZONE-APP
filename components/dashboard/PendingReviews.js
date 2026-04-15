'use client';

import { Clapperboard, Palette, FileText, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ActiveProduction() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_orange]" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Producción Activa</h2>
                </div>
                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-wide animate-pulse">
                    3 En Curso
                </div>
            </div>

            {/* Control Center Counters - New Titles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatusCounter label="En Producción" count={3} color="amber" icon="🟡" />
                <StatusCounter label="En Postproducción" count={2} color="indigo" icon="🎬" />
                <StatusCounter label="Esperando Revisión" count={3} color="blue" icon="👀" />
                <StatusCounter label="Activos Publicados" count={12} color="emerald" icon="✅" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProductionCard
                    type="VIDEO"
                    title="Lanzamiento V2"
                    status="En Postproducción"
                    time="Hace 2h"
                    color="amber"
                />
                <ProductionCard
                    type="DISEÑO"
                    title="Carrusel IA"
                    status="En Producción"
                    time="Hace 5h"
                    color="pink"
                />
                <ProductionCard
                    type="COPY"
                    title="Email Marketing"
                    status="Esperando Revisión"
                    time="Ayer"
                    color="blue"
                />
            </div>

            <div className="flex justify-center pt-2">
                <button className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest group">
                    Ver Flujo Completo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

function StatusCounter({ label, count, color, icon }) {
    const colors = {
        amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
        indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
        blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
        emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    };

    return (
        <div className={`rounded-2xl border ${colors[color].split(' ')[1]} ${colors[color].split(' ')[2]} p-4 text-center transition-all hover:bg-opacity-20`}>
            <div className={`text-2xl font-black ${colors[color].split(' ')[0]} mb-1`}>{count}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
                <span className="opacity-70">{icon}</span> {label}
            </div>
        </div>
    );
}

function ProductionCard({ type, title, status, time, color }) {
    const colors = {
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <div className="bg-[#0F0F1A]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden hover:border-white/10 hover:shadow-xl hover:shadow-black/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${colors[color]}`}>
                    {type}
                </span>
                <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {time}
                </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-6 group-hover:text-blue-200 transition-colors tracking-tight">{title}</h3>

            <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors">
                    Ver
                </button>
                <button className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold text-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Aprobar
                </button>
            </div>
        </div>
    );
}
